import { describe, expect, it } from 'vitest';
import { normalizeMath } from './math';

describe('normalizeMath', () => {
  it('normalizes powers and subscripts', () => {
    expect(normalizeMath('x^2 + a_1')).toBe('x² + a₁');
  });
  it('normalizes LaTeX-style fractions and roots', () => {
    expect(normalizeMath('\\frac{a}{b} + \\sqrt{x}')).toBe('(a)⁄(b) + √(x)');
  });
  it('supports the target shorthand examples', () => {
    expect(normalizeMath('3/4 + x^2 + sqrt(x)')).toBe('3⁄4 + x² + √(x)');
  });
  it('parses editable stacked fractions and square roots', async () => {
    const { parseMath } = await import('./math');
    expect(parseMath('\\frac{a+b}{c}')).toEqual([{
      type: 'fraction',
      numerator: [{ type: 'glyph', value: 'a' }, { type: 'glyph', value: '+' }, { type: 'glyph', value: 'b' }],
      denominator: [{ type: 'glyph', value: 'c' }],
    }]);
    expect(parseMath('\\sqrt{x+1}')).toEqual([{
      type: 'root',
      body: [{ type: 'glyph', value: 'x' }, { type: 'glyph', value: '+' }, { type: 'glyph', value: '1' }],
    }]);
  });

  it('attaches superscripts and subscripts to the preceding symbol', async () => {
    const { parseMath } = await import('./math');
    expect(parseMath('x^{n+1}_2')[0]).toEqual({
      type: 'script',
      base: { type: 'glyph', value: 'x' },
      superscript: [{ type: 'glyph', value: 'n' }, { type: 'glyph', value: '+' }, { type: 'glyph', value: '1' }],
      subscript: [{ type: 'glyph', value: '2' }],
    });
  });

  it('maps common Greek letters and operators', () => {
    expect(normalizeMath('\\pi \\cdot x \\le 5')).toBe('π · x ≤ 5');
  });
});
