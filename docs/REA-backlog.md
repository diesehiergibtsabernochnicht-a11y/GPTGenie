# GPTGenie rebuild backlog

## P0 — architecture and correctness
- [ ] Replace bitmap-only glyphs with editable vector stroke samples (pressure, tilt, timestamps).
- [ ] IndexedDB schema versioning, migrations, transactional autosave and quota handling.
- [ ] Typed scene graph for pages, strokes, glyphs, text, photos, backgrounds and annotations.
- [ ] Deterministic text-to-glyph layout in physical page units.
- [ ] PDF exporter from shared scene graph.
- [ ] Native Goodnotes writer fixture and validation in Goodnotes, including independently erasable strokes.
- [ ] Portable full workspace backup/restore with embedded assets and integrity checks.

## P1 — handwriting capture and composition
- [ ] Language/script registry and 114-character German scan set.
- [ ] Fast Scan, missing-only mode, template overlay, edit saved glyph.
- [ ] Glyph variants, interpolation and seeded per-use variation.
- [ ] Five pen models, pressure/velocity width, smoothing and tilt.
- [ ] 50+ scripts, contextual Arabic, Hebrew final forms, bidi and mixed RTL/LTR.
- [ ] Connected cursive mode and ligatures.
- [ ] Bold/highlight markup and mathematical shorthand.
- [ ] Spacing, baseline jitter, line slope/wave, margins and rule snapping.

## P2 — page editor
- [ ] Multipage editor, page overview, active-page viewport, zoom and pan.
- [ ] Selection/lasso and object inspector.
- [ ] Pen/highlighter/eraser with partial-stroke geometry.
- [ ] Handwritten text insertion, photos, page backgrounds and page insertion.
- [ ] Undo/redo, clipboard, shortcuts, stylus-only mode and touch gestures.
- [ ] Shared scene graph for PDF and native export.

## P3 — export and polish
- [ ] Goodnotes native export.
- [ ] Samsung Notes, OneNote, Notability, Freenotes and Noteful, each independently validated.
- [ ] PWA/offline cache, local fonts, performance mode and accessibility.
- [ ] Mobile/tablet QA and matched-viewport screenshot comparisons.

## Current status
The current code is a prototype: basic React/Vite editor, bitmap glyph capture, IndexedDB, basic PDF and JSON backup. It does not yet satisfy P0/P1. Native Goodnotes writer, full composition engine, full editor, multilingual scripts and runtime QA are not implemented.