import { describe, expect, it } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import { unzipSync } from 'fflate';
import { PDFDocument } from 'pdf-lib';
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
const annotation = {
  id: 'annotation-1', tool: 'pen' as const, color: '#cc3344', width: 2.8, opacity: 1,
  points: [
    { x: 160, y: 190, pressure: .7, time: 3, tiltX: 0, tiltY: 0 },
    { x: 180, y: 200, pressure: .8, time: 4, tiltX: 0, tiltY: 0 },
  ],
};
function readVarint(data: Uint8Array, start: number) {
  let value = 0, shift = 0, pos = start;
  while (pos < data.length) { const b = data[pos++]; value |= (b & 127) << shift; if (b < 128) return { value, next: pos }; shift += 7; }
  throw new Error('invalid varint');
}
function delimited(data: Uint8Array) {
  const out: Uint8Array[] = []; let pos = 0;
  while (pos < data.length) { const n = readVarint(data, pos); pos = n.next; out.push(data.slice(pos, pos + n.value)); pos += n.value; }
  return out;
}
function fields(data: Uint8Array) {
  const out: { number: number; wire: number; value: Uint8Array | number }[] = []; let pos = 0;
  while (pos < data.length) {
    const k = readVarint(data, pos); pos = k.next; const number = k.value >> 3, wire = k.value & 7;
    if (wire === 0) { const v = readVarint(data, pos); pos = v.next; out.push({ number, wire, value: v.value }); }
    else if (wire === 2) { const n = readVarint(data, pos); pos = n.next; out.push({ number, wire, value: data.slice(pos, pos + n.value) }); pos += n.value; }
    else throw new Error('unexpected wire type in test fixture');
  }
  return out;
}

describe('Goodnotes archive writer', () => {
  it('writes indexed pages, background PDF and a native TPL stroke object', async () => {
    const blob = await makeGoodnotes('a', 'Writer test', settings, [glyph], [[annotation]]);
    if (process.env.GITHUB_ACTIONS === 'true') { mkdirSync('artifacts', { recursive: true }); writeFileSync('artifacts/GPTGenie-current-writer-smoke-test.goodnotes', Buffer.from(await blob.arrayBuffer())); }
    const archive = unzipSync(new Uint8Array(await blob.arrayBuffer()));
    const names = Object.keys(archive);
    expect(names).toContain('index.notes.pb');
    expect(names).toContain('index.events.pb');
    expect(names).toContain('index.attachments.pb');
    expect(names).toContain('schema.pb');
    expect(archive['thumbnail.jpg'][0]).toBe(0xff);
    expect(archive['thumbnail.jpg'][1]).toBe(0xd8);
    expect(archive['thumbnail.jpg'][archive['thumbnail.jpg'].length-2]).toBe(0xff);
    expect(archive['thumbnail.jpg'][archive['thumbnail.jpg'].length-1]).toBe(0xd9);
    const pagePath = names.find(n => n.startsWith('notes/'))!;
    const pageRecords = delimited(archive[pagePath]);
    expect(pageRecords).toHaveLength(4);
    const body = fields(pageRecords[1]).find(f => f.number === 7)!.value as Uint8Array;
    const strokePayload = fields(body);
    const frame = strokePayload.find(f => f.number === 2)!.value as Uint8Array;
    expect(new TextDecoder().decode(frame.slice(0, 4))).toBe('bv41');
    expect(new TextDecoder().decode(frame.slice(-4))).toBe('bv4$');
    const rawSize = new DataView(frame.buffer, frame.byteOffset + 4, 4).getUint32(0, true);
    expect(rawSize).toBeGreaterThan(100);
    const secondBody = fields(pageRecords[3]).find(f => f.number === 7)!.value as Uint8Array;
    expect(new TextDecoder().decode((fields(secondBody).find(f => f.number === 2)!.value as Uint8Array).slice(0, 4))).toBe('bv41');
    const events = delimited(archive['index.events.pb']);
    expect(events).toHaveLength(6);
    const attachmentPath = names.find(n => n.startsWith('attachments/'))!;
    expect(new TextDecoder().decode(archive[attachmentPath].slice(0, 4))).toBe('%PDF');
  });

  it('keeps a custom image as part of the separate Goodnotes paper PDF', async () => {
    const withPhoto = { ...settings, backgroundImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFklEQVR4nGN89uEXAwMDEwMDAwMDAwAh1gLU+YtJ5wAAAABJRU5ErkJggg==', backgroundImageScale: 120, backgroundImageRotation: 8, backgroundImageX: 4, backgroundImageY: -3 };
    const blob = await makeGoodnotes('a', 'Goodnotes photo paper', withPhoto, [glyph]);
    const archive = unzipSync(new Uint8Array(await blob.arrayBuffer()));
    const attachmentPath = Object.keys(archive).find(n => n.startsWith('attachments/'))!;
    const pdf = await PDFDocument.load(archive[attachmentPath]);
    expect(pdf.getPageCount()).toBe(1);
  });

  it('emits a page-event group and note file for each composed page', async () => {
    const blob = await makeGoodnotes('x '.repeat(900), 'Two page test', settings, []);
    const archive = unzipSync(new Uint8Array(await blob.arrayBuffer()));
    const noteFiles = Object.keys(archive).filter(n => n.startsWith('notes/'));
    expect(noteFiles.length).toBeGreaterThan(1);
    expect(delimited(archive['index.events.pb']).length).toBe(2 + noteFiles.length * 4);
  });
});
