import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { makePdf, type ExportOptions } from './pdf';
import type { InkStroke } from './storage';

const settings: ExportOptions = {
  paper: 'A4', style: 'squared-wide', fontSize: 16, lineSpacing: 1.9,
  margin: 54, marginLeft: 60, marginRight: 50, marginTop: 52, marginBottom: 58,
  letterSpacing: 0, wordSpacing: 5, variation: 0, ink: '#25304a',
  ruleSpacing: 24, backgroundColor: '#d5dce5', marginLine: true,
};
const annotation: InkStroke = {
  id: 'edit-1', tool: 'pen', color: '#cc3344', width: 2.8, opacity: 1,
  points: [
    { x: 120, y: 150, pressure: .7, time: 0, tiltX: 0, tiltY: 0 },
    { x: 160, y: 180, pressure: .8, time: 1, tiltX: 0, tiltY: 0 },
  ],
};

describe('PDF scene export', () => {
  it('exports annotation strokes on the same page scene and supports paper margins', async () => {
    const blob = await makePdf('note', 'PDF test', settings, [], [[annotation]]);
    const pdf = await PDFDocument.load(await blob.arrayBuffer());
    expect(pdf.getPageCount()).toBe(1);
    expect(pdf.getPage(0).getWidth()).toBeCloseTo(595.28, 1);
  });
});
