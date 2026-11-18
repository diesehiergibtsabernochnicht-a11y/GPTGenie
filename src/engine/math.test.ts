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
  it('maps common Greek letters and operators', () => {
    expect(normalizeMath('\\pi \\cdot x \\le 5')).toBe('π · x ≤ 5');
  });
});
