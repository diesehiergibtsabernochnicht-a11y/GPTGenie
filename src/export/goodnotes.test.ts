import { describe, expect, it } from 'vitest';
import { unzipSync } from 'fflate';
import { makeGoodnotes } from './goodnotes';
import type { Glyph } from '../storage';

const settings = {
  paper: 'A4' as const, style: 'ruled-wide' as const, fontSize: 16,
  lineSpacing: 1.9, margin: 54, letterSpacing: 0, wordSpacing: 5,
  variation: 0, ink: '#25304a', ruleSpacing: 30,
  backgroundColor: '#d5dce5', marginLine: false,
};
const glyph: Glyph = {
  id: 'glyph-a', char: 'a', dataUrl: '', baselineY: 238, createdAt: 1,
  strokes: [{
    id: 'stroke-a', tool: 'pen', color: '#25304a', width: 2.4, opacity: 1,
    points: [
      { x: 92, y: 128, pressure: 1, time: 0, tiltX: 0, tiltY: 0 },
      { x: 108, y: 116, pressure: 1, time: 1, tiltX: 0, tiltY: 0 },
      { x: 126, y: 108, pressure: 1, time: 2, tiltX: 0, tiltY: 0 },
    ],
  }],
};

describe('Goodnotes archive writer', () => {
  it('creates a ZIP notebook with an indexed page, PDF background and native stroke records', async () => {
    const blob = await makeGoodnotes('a', 'Writer test', settings, [glyph]);
    const archive = unzipSync(new Uint8Array(await blob.arrayBuffer()));
    const names = Object.keys(archive);
    expect(names).toContain('index.notes.pb');
    expect(names).toContain('index.events.pb');
    expect(names).toContain('index.attachments.pb');
    expect(names).toContain('schema.pb');
    expect(names.some(n => n.startsWith('notes/'))).toBe(true);
    expect(names.some(n => n.startsWith('attachments/'))).toBe(true);
    const pagePath = names.find(n => n.startsWith('notes/'))!;
    expect(archive[pagePath].length).toBeGreaterThan(100);
    const attachmentPath = names.find(n => n.startsWith('attachments/'))!;
    expect(new TextDecoder().decode(archive[attachmentPath].slice(0, 4))).toBe('%PDF');
    expect(new TextDecoder().decode(archive['index.events.pb'].slice(0, 1))).not.toBe('');
  });
});
