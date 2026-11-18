import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { exportWorkspace, get, importWorkspace, type Glyph } from './storage';

const glyph: Glyph = {
  id: 'g1', char: 'a', dataUrl: '', createdAt: 1,
  strokes: [],
};
const legacyBackup = {
  schema: 'gptgenie-workspace' as const,
  version: 2,
  exportedAt: '2026-11-18T00:00:00.000Z',
  settings: { ink: '#123456' },
  glyphs: [glyph],
  documents: [],
  presets: [],
};

describe('workspace backup and restore', () => {
  it('exports a versioned SHA-256 integrity checksum', async () => {
    await importWorkspace(legacyBackup);
    const backup = await exportWorkspace();
    expect(backup.version).toBe(3);
    expect(backup.integrity.algorithm).toBe('SHA-256');
    expect(backup.integrity.digest).toMatch(/^[a-f0-9]{64}$/);
  });

  it('rejects a modified backup without overwriting stored data', async () => {
    await importWorkspace(legacyBackup);
    const backup = await exportWorkspace();
    backup.glyphs[0].char = 'b';
    await expect(importWorkspace(backup)).rejects.toThrow('Backup integrity check failed');
    const stored = await get<Glyph[]>('glyphs');
    expect(stored?.[0].char).toBe('a');
  });

  it('rejects malformed workspace data before starting a restore transaction', async () => {
    await importWorkspace(legacyBackup);
    await expect(importWorkspace({ ...legacyBackup, glyphs: [{ id: 'bad' }] })).rejects.toThrow('invalid or incomplete');
    const stored = await get<Glyph[]>('glyphs');
    expect(stored?.[0].char).toBe('a');
  });
});
