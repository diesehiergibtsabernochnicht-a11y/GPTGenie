import { zipSync } from 'fflate';
import { PDFDocument } from 'pdf-lib';
import type { Glyph } from '../storage';
import { composeText, type LayoutPage } from '../engine/layout';
import { drawPaper, type ExportOptions } from '../pdf';

const EVENT_TEMPLATE_B64='wQIKJDAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwM/IBlwIKJDAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMxIgChRHUFRHZW5pZV9IYW5kd3JpdHRlbhIICAEQ2r284AkaMAokMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDA1EggIARCs4MaYAzINCgFQEggIARCA+7mrBTowCiQwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDUSCAgBEN+xxq0CSgVkZV9ERVEAoGs52x56QlokMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDExaMqJ47au3q74KHC6rc7tnjSKAQCSAQCaAQkSBwgBELa5qjKgARjoAQokMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDA2Mr8BCiQwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDYSJDAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwNijyxhUyJDAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwM1EAsGs52x56QlokMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAyYgQIARABcMqJ47au3q74KHi7rc7tnjSAARjgAgokMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDEyErcCCiQwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDMSJDAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAxMiIkMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDA2KAEwATkAAABgVVU9QEIKDataiEQVVfXARFEAAGw52x56QlokMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDEzYhMJAAAAYFVVPUASCAgBELPet/oDagwIARIICAEQrozq1g94yonjtq7ervgogAHArc7tnjSKAQwIARIICAEQkqWXgwGSASYKGAoKDQAAMEIVq6pqQhIKDTHWekQVN0SyRBVWVeNBHauqaj8oAZoBChIICAEQgaCo8weoARj8AQokMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDA4sgPSAQokMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAzEiQwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDgaMAokMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDEyEggIARDqrPWmCyIQCgRLMDAxEggIARDuz6LTDFEAEGw52x56QlokMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDEwaMqJ47au3q74KHDBrc7tnjR4GPYBCiQwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDNSzQEKJDAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMxIkMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDA4Gj1QYWdpbmdWaWV3U2VydmljZVVwZGF0ZXI6MDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDA0UQAgbDnbHnpCWiQwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDFoyonjtq7ervgocMKtzu2eNHgYuQEKJDAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwObIGjwEKJDAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwOVEAMGw52x56QlokMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDA3aMqJ47au3q74KHDDrc7tnjR4GIIBJDAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMw==';
const PLACEHOLDERS = Array.from({ length: 13 }, (_, i) => '00000000-0000-0000-0000-' + String(i + 1).padStart(12, '0'));
type ProtoField = { number: number; wire: number; value: bigint | Uint8Array };
const encoder = new TextEncoder();

function concat(parts: Uint8Array[]): Uint8Array {
  const size = parts.reduce((n, p) => n + p.length, 0), out = new Uint8Array(size);
  let offset = 0; for (const part of parts) { out.set(part, offset); offset += part.length; } return out;
}
function u32(value: number): Uint8Array { const b = new Uint8Array(4); new DataView(b.buffer).setUint32(0, value >>> 0, true); return b; }
function u16(value: number): Uint8Array { const b = new Uint8Array(2); new DataView(b.buffer).setUint16(0, value & 0xffff, true); return b; }
function floatBits(value: number): number { const b = new ArrayBuffer(4); new DataView(b).setFloat32(0, value, true); return new DataView(b).getUint32(0, true); }
function varint(value: bigint | number): Uint8Array {
  let n = BigInt(value); if (n < 0n) throw new Error('Negative protobuf varint');
  const out: number[] = []; while (n >= 0x80n) { out.push(Number((n & 0x7fn) | 0x80n)); n >>= 7n; } out.push(Number(n)); return Uint8Array.from(out);
}
function readVarint(data: Uint8Array, start: number): { value: bigint; next: number } {
  let value = 0n, shift = 0n, pos = start;
  while (pos < data.length && shift < 70n) { const b = data[pos++]; value |= BigInt(b & 0x7f) << shift; if (b < 0x80) return { value, next: pos }; shift += 7n; }
  throw new Error('Malformed protobuf varint');
}
function fieldVarint(number: number, value: bigint | number): Uint8Array { return concat([varint((number << 3) | 0), varint(value)]); }
function fieldBytes(number: number, value: Uint8Array): Uint8Array { return concat([varint((number << 3) | 2), varint(value.length), value]); }
function delimited(message: Uint8Array): Uint8Array { return concat([varint(message.length), message]); }
function parseMessage(data: Uint8Array): ProtoField[] {
  const fields: ProtoField[] = []; let pos = 0;
  while (pos < data.length) {
    const key = readVarint(data, pos); pos = key.next;
    const number = Number(key.value >> 3n), wire = Number(key.value & 7n);
    if (wire === 0) { const v = readVarint(data, pos); fields.push({ number, wire, value: v.value }); pos = v.next; }
    else if (wire === 1 || wire === 5) { const size = wire === 1 ? 8 : 4; if (pos + size > data.length) throw new Error('Truncated protobuf fixed field'); fields.push({ number, wire, value: data.slice(pos, pos + size) }); pos += size; }
    else if (wire === 2) { const n = readVarint(data, pos); pos = n.next; const end = pos + Number(n.value); if (end > data.length) throw new Error('Truncated protobuf bytes field'); fields.push({ number, wire, value: data.slice(pos, end) }); pos = end; }
    else throw new Error('Unsupported protobuf wire type ' + wire);
  }
  return fields;
}
function encodeMessage(fields: ProtoField[]): Uint8Array {
  return concat(fields.map(f => f.wire === 0 ? fieldVarint(f.number, f.value as bigint) : f.wire === 2 ? fieldBytes(f.number, f.value as Uint8Array) : concat([varint((f.number << 3) | f.wire), f.value as Uint8Array])));
}
function setBytes(fields: ProtoField[], number: number, value: Uint8Array): void { const f = fields.find(x => x.number === number); if (!f || f.wire !== 2) throw new Error('Missing protobuf bytes field ' + number); f.value = value; }
function setVarint(fields: ProtoField[], number: number, value: bigint | number): void { const f = fields.find(x => x.number === number); if (!f || f.wire !== 0) throw new Error('Missing protobuf varint field ' + number); f.value = BigInt(value); }
function splitDelimited(data: Uint8Array): Uint8Array[] {
  const out: Uint8Array[] = []; let pos = 0;
  while (pos < data.length) { const n = readVarint(data, pos); pos = n.next; const end = pos + Number(n.value); if (end > data.length) throw new Error('Truncated event record'); out.push(data.slice(pos, end)); pos = end; }
  return out;
}
function replaceBytes(source: Uint8Array, search: Uint8Array, replacement: Uint8Array): Uint8Array {
  if (search.length !== replacement.length) throw new Error('UUID replacement must preserve byte length');
  const out = source.slice();
  for (let i = 0; i <= out.length - search.length; i++) { let match = true; for (let j = 0; j < search.length; j++) if (out[i + j] !== search[j]) { match = false; break; } if (match) { out.set(replacement, i); i += search.length - 1; } }
  return out;
}
function randomUuid(): string { return crypto.randomUUID().toUpperCase(); }
function fromBase64(s: string): Uint8Array { const raw = atob(s); return Uint8Array.from(raw, c => c.charCodeAt(0)); }
function replaceIds(record: Uint8Array, ids: Map<string, string>): Uint8Array {
  let out = record; for (const [placeholder, actual] of ids) out = replaceBytes(out, encoder.encode(placeholder), encoder.encode(actual)); return out;
}
function makeEventRecords(pdfSize: number, title: string, attachmentId: string, docId: string, pageIds: string[]): Uint8Array {
  const templates = splitDelimited(fromBase64(EVENT_TEMPLATE_B64));
  if (templates.length !== 6) throw new Error('Goodnotes event template is incomplete');
  const shared = new Map<string, string>([
    [PLACEHOLDERS[1], randomUuid()], [PLACEHOLDERS[2], docId],
    [PLACEHOLDERS[4], randomUuid()], [PLACEHOLDERS[5], attachmentId],
    [PLACEHOLDERS[10], randomUuid()],
  ]);
  const docFields = parseMessage(replaceIds(templates[0], shared));
  const docMeta = parseMessage(docFields.find(f => f.number === 30)!.value as Uint8Array);
  const titleFields = parseMessage(docMeta.find(f => f.number === 2)!.value as Uint8Array);
  setBytes(titleFields, 1, encoder.encode(title.slice(0, 120)));
  setBytes(docMeta, 2, encodeMessage(titleFields)); setBytes(docFields, 30, encodeMessage(docMeta));
  const attachmentFields = parseMessage(replaceIds(templates[1], shared));
  const attachmentMeta = parseMessage(attachmentFields.find(f => f.number === 6)!.value as Uint8Array);
  setVarint(attachmentMeta, 5, pdfSize); setBytes(attachmentFields, 6, encodeMessage(attachmentMeta));
  const output: Uint8Array[] = [delimited(encodeMessage(docFields)), delimited(encodeMessage(attachmentFields))];
  pageIds.forEach((pageId, index) => {
    const ids = new Map(shared);
    ids.set(PLACEHOLDERS[0], randomUuid()); ids.set(PLACEHOLDERS[3], randomUuid());
    ids.set(PLACEHOLDERS[6], randomUuid()); ids.set(PLACEHOLDERS[7], randomUuid());
    ids.set(PLACEHOLDERS[8], pageId); ids.set(PLACEHOLDERS[9], randomUuid());
    ids.set(PLACEHOLDERS[11], randomUuid()); ids.set(PLACEHOLDERS[12], randomUuid());
    for (let j = 2; j < 6; j++) {
      let record = replaceIds(templates[j], ids);
      if (j === 3) {
        const eventFields = parseMessage(record), pageEvent = parseMessage(eventFields.find(f => f.number === 54)!.value as Uint8Array);
        const orderFields = parseMessage(pageEvent.find(f => f.number === 4)!.value as Uint8Array);
        setBytes(orderFields, 1, encoder.encode('K' + String(index).padStart(3, '0')));
        setBytes(pageEvent, 4, encodeMessage(orderFields)); setBytes(eventFields, 54, encodeMessage(pageEvent)); record = encodeMessage(eventFields);
      }
      output.push(delimited(record));
    }
  });
  return concat(output);
}
function writeTpl(stroke: LayoutPage['strokes'][number]): Uint8Array {
  let points = stroke.points.filter(p => Number.isFinite(p.x) && Number.isFinite(p.y));
  if (points.length < 2) return new Uint8Array();
  if (points.length > 2000) points = points.filter((_, i) => i === 0 || i === points.length - 1 || i % Math.ceil(points.length / 2000) === 0);
  const format = encoder.encode('vuA(v)A(S(uu))A(S(uuuu))vA(f)\0');
  const flags = [0, ...Array(Math.max(0, points.length - 1)).fill(1)];
  const parts: Uint8Array[] = [u16(2), u32(floatBits(stroke.width)), u32(flags.length), ...flags.map(u16),
    u32(1), u32(floatBits(points[0].x)), u32(floatBits(points[0].y)), u32(points.length - 1)];
  for (let i = 1; i < points.length; i++) parts.push(u32(floatBits(points[i - 1].x)), u32(floatBits(points[i - 1].y)), u32(floatBits(points[i].x)), u32(floatBits(points[i].y)));
  parts.push(u16(1), u32(0));
  const body = concat(parts), size = 8 + format.length + body.length;
  const tpl = concat([encoder.encode('tpl\0'), u32(size), format, body]);
  const block: number[] = [Math.min(tpl.length, 15) << 4];
  if (tpl.length >= 15) { let remaining = tpl.length - 15; while (remaining >= 255) { block.push(255); remaining -= 255; } block.push(remaining); }
  const lz4 = concat([Uint8Array.from(block), tpl]);
  return concat([encoder.encode('bv41'), u32(tpl.length), u32(lz4.length), lz4, encoder.encode('bv4$')]);
}
function colorMessage(color: string, alpha: number): Uint8Array {
  const hex = color.replace('#', '').padEnd(6, '0');
  const values = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).concat(Math.max(0, Math.min(1, alpha)));
  return concat(values.map((v, i) => concat([varint((i + 1) * 8 + 5), u32(floatBits(v))])));
}
function writeStrokeObject(stroke: LayoutPage['strokes'][number], index: number): Uint8Array {
  const uuid = randomUuid(), stamp = 1047254487n, metadata = concat([fieldVarint(1, 1), fieldVarint(2, stamp)]);
  const header = concat([fieldBytes(1, encoder.encode(uuid)), fieldBytes(2, metadata), fieldVarint(8, 2950063308345492682n), fieldVarint(9, index + 1), fieldVarint(14, 5381), fieldVarint(16, 24)]);
  const tpl = writeTpl(stroke); if (!tpl.length) return new Uint8Array();
  const payload = [
    fieldBytes(1, encoder.encode(uuid)), fieldBytes(2, tpl), fieldBytes(4, colorMessage(stroke.color, stroke.opacity)),
    fieldBytes(6, new Uint8Array()), fieldBytes(7, fieldBytes(1, metadata)), fieldBytes(9, new Uint8Array()),
    fieldBytes(15, metadata), fieldBytes(20, new Uint8Array()),
  ];
  if (stroke.tool === 'marker') payload.push(fieldVarint(5, 1));
  payload.push(fieldVarint(21, 24));
  return concat([delimited(header), delimited(fieldBytes(7, concat(payload)))]);
}
function writePage(page: LayoutPage): Uint8Array {
  return concat(page.strokes.map((stroke, index) => writeStrokeObject(stroke, index)).filter(x => x.length > 0));
}
function makeIndexEntry(field: number, uuid: string, path: string): Uint8Array {
  return fieldBytes(field, concat([fieldBytes(1, encoder.encode(uuid)), fieldBytes(2, encoder.encode(path))]));
}

function renderThumbnail(page: LayoutPage, options: ExportOptions): Uint8Array {
  if (typeof document === 'undefined') return new Uint8Array();
  const canvas = document.createElement('canvas'), scale = 420 / page.width;
  canvas.width = 420; canvas.height = Math.round(page.height * scale);
  const ctx = canvas.getContext('2d'); if (!ctx) return new Uint8Array();
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  const gap = (options.ruleSpacing ?? options.fontSize * options.lineSpacing) * scale, style = options.style ?? 'plain', left=(options.marginLeft??options.margin)*scale,right=(options.marginRight??options.margin)*scale,top=(options.marginTop??options.margin)*scale,bottom=(options.marginBottom??options.margin)*scale;
  ctx.strokeStyle = options.backgroundColor ?? '#d5dce5'; ctx.fillStyle = ctx.strokeStyle; ctx.lineWidth = .6;
  if (style !== 'plain') for (let y = top; y < canvas.height - bottom; y += gap) {
    if (style.startsWith('dotted') || style === 'dotted') for (let x = left; x < canvas.width - right; x += gap) { ctx.beginPath(); ctx.arc(x, y, .8, 0, Math.PI * 2); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(canvas.width - right, y); ctx.stroke(); }
  }
  if (style.startsWith('squared') || style === 'grid') for (let x = options.margin * scale; x < canvas.width - options.margin * scale; x += gap) { ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, canvas.height - bottom); ctx.stroke(); }
  if (options.marginLine) { ctx.strokeStyle = '#dfaaaa'; ctx.beginPath(); ctx.moveTo(((options.marginLeft??options.margin) - 12) * scale, 0); ctx.lineTo(((options.marginLeft??options.margin) - 12) * scale, canvas.height); ctx.stroke(); }
  for (const s of page.strokes) {
    if (!s.points.length) continue; ctx.strokeStyle = s.color; ctx.globalAlpha = s.opacity; ctx.lineWidth = Math.max(.4, s.width * scale); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(s.points[0].x * scale, s.points[0].y * scale);
    for (let i = 1; i < s.points.length; i++) ctx.lineTo(s.points[i].x * scale, s.points[i].y * scale);
    ctx.stroke(); ctx.globalAlpha = 1;
  }
  return fromBase64(canvas.toDataURL('image/jpeg', .82).split(',')[1]);
}
export async function makeGoodnotes(text: string, title: string, options: ExportOptions, glyphs: Glyph[] = []): Promise<Blob> {
  const pages = composeText(text, title, options, glyphs);
  const pdf = await PDFDocument.create(); pdf.setTitle(title); pdf.setCreator('GPTGenie');
  for (const model of pages) { const page = pdf.addPage([model.width, model.height]); drawPaper(page, model.width, model.height, options); }
  const pdfBytes = await pdf.save(), docId = randomUuid(), attachmentId = randomUuid(), pageIds = pages.map(() => randomUuid());
  const files: Record<string, Uint8Array> = {
    'index.search.pb': new Uint8Array(),
    'index.notes.pb': concat(pageIds.map(id => makeIndexEntry(10, id, 'notes/' + id))),
    'index.attachments.pb': makeIndexEntry(11, attachmentId, 'attachments/' + attachmentId),
    'index.events.pb': makeEventRecords(pdfBytes.length, title, attachmentId, docId, pageIds),
    'schema.pb': Uint8Array.of(8, 24),
    'thumbnail.jpg': renderThumbnail(pages[0], options),
    ['attachments/' + attachmentId]: new Uint8Array(pdfBytes),
  };
  pages.forEach((page, index) => { files['notes/' + pageIds[index]] = writePage(page); });
  const zip = zipSync(files, { level: 6 });
  const buffer = zip.buffer.slice(zip.byteOffset, zip.byteOffset + zip.byteLength) as ArrayBuffer;
  return new Blob([buffer], { type: 'application/octet-stream' });
}
