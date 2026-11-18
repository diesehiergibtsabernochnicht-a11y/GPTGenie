import { describe, expect, it } from 'vitest';
import { composeText } from './layout';
import type { Glyph } from '../storage';

const settings = {
  paper: 'A4' as const, fontSize: 16, lineSpacing: 1.9, margin: 54,
  letterSpacing: 0, wordSpacing: 5, variation: 0, ink: '#25304a',
  style: 'ruled-wide' as const, ruleSpacing: 30,
};

describe('composeText baseline layout', () => {
  it('aligns glyph baseline metrics to the page writing baseline', () => {
    const glyph: Glyph = {
      id: 'g1', char: 'a', dataUrl: '', baselineY: 238, createdAt: 1,
      strokes: [{ id: 's1', tool: 'pen', color: '#25304a', width: 3, opacity: 1,
        points: [
          { x: 100, y: 150, pressure: 1, time: 0, tiltX: 0, tiltY: 0 },
          { x: 100, y: 238, pressure: 1, time: 1, tiltX: 0, tiltY: 0 },
        ] }],
    };
    const [page] = composeText('a', 'test', settings, [glyph]);
    const stroke = page.strokes[0];
    expect(stroke.points[1].y).toBeCloseTo(settings.margin + settings.fontSize, 4);
  });
});
