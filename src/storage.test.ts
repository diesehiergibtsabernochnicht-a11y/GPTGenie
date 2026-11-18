import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { exportWorkspace, get, importWorkspace, put, putMany, type Glyph } from './storage';

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
  documents: [{ id: 'd1', title: 'Editable page', text: 'a', updatedAt: 1, edits: [[{ id: 'e1', tool: 'pen', color: '#123456', width: 2, opacity: 1, points: [{ x: 1, y: 2, pressure: 1, time: 0, tiltX: 0, tiltY: 0 }, { x: 3, y: 4, pressure: 1, time: 1, tiltX: 0, tiltY: 0 }] }]] }],
  presets: [],
  fastScan: { queue: ['a', 'b'], index: 1, script: 'de' },
  draft: { title: 'Unsaved draft', text: 'a', settings: { ink: '#123456' }, script: 'de', edits: [], updatedAt: 1 },
};

describe('atomic local persistence', () => {
  it('commits all workspace records in one transaction', async () => {
    await putMany([['glyphs', [glyph]], ['documents', []], ['settings', { ink: '#123456' }]]);
    expect((await get<Glyph[]>('glyphs'))?.[0].id).toBe('g1');
    expect(await get<unknown[]>('documents')).toEqual([]);
    expect(await get<{ ink: string }>('settings')).toEqual({ ink: '#123456' });
  });

  it('rolls back earlier writes when a later value cannot be cloned', async () => {
    await put('sentinel', { value: 'before' });
    await expect(putMany([['sentinel', { value: 'after' }], ['invalid', () => 'not cloneable']])).rejects.toThrow();
    expect(await get<{ value: string }>('sentinel')).toEqual({ value: 'before' });
    expect(await get('invalid')).toBeUndefined();
  });
});

describe('workspace backup and restore', () => {
  it('exports a versioned SHA-256 integrity checksum', async () => {
    await importWorkspace(legacyBackup);
    const backup = await exportWorkspace();
    expect(backup.version).toBe(3);
    expect(backup.integrity.algorithm).toBe('SHA-256');
    expect(backup.fastScan?.index).toBe(1);
    expect(backup.draft?.text).toBe('a');
    expect(backup.documents[0].edits?.[0]).toHaveLength(1);
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
    await expect(importWorkspace({ ...legacyBackup, draft: { title: 'bad' } })).rejects.toThrow('invalid unsaved draft');
    const stored = await get<Glyph[]>('glyphs');
    expect(stored?.[0].char).toBe('a');
  });
});
