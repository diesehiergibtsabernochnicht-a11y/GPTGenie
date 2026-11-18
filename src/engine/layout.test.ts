import { describe, expect, it } from 'vitest';
import { composeText } from './layout';
import type { Glyph } from '../storage';

const settings = {
  paper: 'A4' as const, fontSize: 16, lineSpacing: 1.9, margin: 54,
  letterSpacing: 0, wordSpacing: 5, variation: 0, ink: '#25304a',
  style: 'ruled-wide' as const, ruleSpacing: 30,
};

function mathGlyph(char: string): Glyph {
  return {
    id: 'math-' + char, char, dataUrl: '', baselineY: 10, createdAt: 1,
    strokes: [{ id: 'stroke-' + char, tool: 'pen', color: '#25304a', width: 1.5, opacity: 1,
      points: [
        { x: 0, y: 0, pressure: 1, time: 0, tiltX: 0, tiltY: 0 },
        { x: 10, y: 10, pressure: 1, time: 1, tiltX: 0, tiltY: 0 },
      ] }],
  };
}

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

  it('places fraction numerator and denominator on separate baselines with an editable bar', () => {
    const [page] = composeText('\\frac{1}{2}', 'fraction', settings, [mathGlyph('1'), mathGlyph('2')]);
    expect(page.strokes).toHaveLength(3);
    const top = page.strokes[0].points[1].y;
    const bottom = page.strokes[1].points[1].y;
    expect(top).toBeLessThan(settings.margin + settings.fontSize);
    expect(bottom).toBeGreaterThan(settings.margin + settings.fontSize);
    expect(page.strokes[2].points[0].y).toBeGreaterThan(top);
    expect(page.strokes[2].points[0].y).toBeLessThan(bottom);
  });

  it('draws a radical sign and overbar around a square-root expression', () => {
    const [page] = composeText('\\sqrt{x+1}', 'root', settings, ['√', 'x', '+', '1'].map(mathGlyph));
    expect(page.strokes).toHaveLength(5);
    expect(page.strokes.some(stroke => stroke.points.length === 2 && stroke.points[0].y === stroke.points[1].y)).toBe(true);
  });

  it('places superscript glyphs above and subscript glyphs below the base', () => {
    const [page] = composeText('x^{2}_{1}', 'scripts', settings, ['x', '2', '1'].map(mathGlyph));
    expect(page.strokes).toHaveLength(3);
    const ys = page.strokes.map(stroke => stroke.points[1].y);
    expect(ys[1]).toBeLessThan(ys[0]);
    expect(ys[2]).toBeGreaterThan(ys[0]);
  });

});
