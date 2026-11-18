import { describe, expect, it } from 'vitest';
import { GERMAN_CHARS, getMissing, buildFastScanQueue } from './glyphs';

describe('glyph registry', () => {
  it('keeps the German scan grid at 114 characters', () => {
    expect(GERMAN_CHARS).toHaveLength(114);
  });
  it('reports missing symbols even when they are outside the active script', () => {
    expect(getMissing('aπ√', GERMAN_CHARS, [{ char: 'a' }])).toEqual(['π', '√']);
  });
  it('builds missing-only Fast Scan queues including unsupported text symbols', () => {
    expect(buildFastScanQueue(['a', 'b', ' '], [{ char: 'a' }], ['π', 'π'], true)).toEqual(['b', 'π']);
  });
  it('does not report whitespace as missing', () => {
    expect(getMissing('a b', GERMAN_CHARS, [{ char: 'a' }, { char: 'b' }])).toEqual([]);
  });
});
