import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { unzipSync } from 'fflate';

test('formula editor autosaves locally and exports a native Goodnotes notebook', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto('./');
  await page.getByRole('button', { name: /Create notes/ }).click();

  const editor = page.locator('textarea.writing-area');
  await expect(editor).toBeVisible();
  const formula = '\\frac{a}{b} + x^2';
  await editor.fill(formula);
  await expect(page.locator('.save-state')).toContainText('Saved locally');

  const missing = await page.locator('.missing-panel').innerText();
  expect(missing).toContain('a');
  expect(missing).toContain('b');
  expect(missing).not.toContain('⁄');

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: /Goodnotes/ }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/\.goodnotes$/);
  const downloadPath = await download.path();
  expect(downloadPath).toBeTruthy();
  const bytes = await readFile(downloadPath!);
  expect(bytes.subarray(0, 2)).toEqual(Buffer.from([0x50, 0x4b]));
  const archive = unzipSync(bytes);
  expect(archive['index.events.pb']).toBeTruthy();
  expect(Object.keys(archive).some(name => name.startsWith('notes/'))).toBe(true);
  expect(Object.keys(archive).some(name => name.startsWith('attachments/'))).toBe(true);

  const [backupDownload] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Backup', exact: true }).click(),
  ]);
  const backupPath = await backupDownload.path();
  expect(backupPath).toBeTruthy();
  const backup = JSON.parse(await readFile(backupPath!, 'utf8'));
  expect(backup.schema).toBe('gptgenie-workspace');
  expect(backup.version).toBe(3);
  expect(backup.draft.text).toBe(formula);
  expect(backup.integrity.algorithm).toBe('SHA-256');
  expect(backup.integrity.digest).toMatch(/^[a-f0-9]{64}$/);

  await editor.fill('temporary unsaved change');
  await expect(page.locator('.save-state')).toContainText('Saved locally');
  await page.getByRole('button', { name: /Settings & backup/ }).click();
  await page.locator('.settings-drawer input[type="file"]').setInputFiles(backupPath!);
  await expect(editor).toHaveValue(formula);

  expect(pageErrors).toEqual([]);

  await page.reload();
  await page.getByRole('button', { name: /Create notes/ }).click();
  await expect(page.locator('textarea.writing-area')).toHaveValue(formula);

  const manifestHref = await page.locator('link[rel="manifest"]').getAttribute('href');
  expect(manifestHref).toBeTruthy();
  const manifestResponse = await page.request.get(new URL(manifestHref!, page.url()).toString());
  expect(manifestResponse.ok()).toBe(true);
  const manifest = await manifestResponse.json();
  expect(new URL(manifest.start_url, new URL(manifestHref!, page.url())).pathname).toContain('/');

  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await page.context().setOffline(true);
  await page.reload();
  await page.getByRole('button', { name: /Create notes/ }).click();
  await expect(page.locator('textarea.writing-area')).toHaveValue(formula);
  await page.context().setOffline(false);
});

test('mobile layout keeps the writing workflow inside a phone viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await page.getByRole('button', { name: /Create notes/ }).click();
  const editor = page.locator('textarea.writing-area');
  await expect(editor).toBeVisible();
  await editor.fill('x^2 + \\frac{1}{2}');
  await expect(page.locator('.preview-panel')).toBeVisible();
  const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(documentWidth).toBeLessThanOrEqual(390);
});
