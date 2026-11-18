# GPTGenie rebuild backlog

Priorities reflect dependency and correctness, not a promise that the entire reference product is already reproduced.

## P0 — architecture and correctness
- [x] Store editable vector glyph strokes with x/y, pressure, time and tilt; retain PNG preview as a thumbnail.
- [ ] IndexedDB schema migrations, transactional autosave, quota handling and storage error recovery.
- [ ] Complete typed scene graph for pages, strokes, glyphs, text, photos, backgrounds, highlights and annotations.
- [x] Deterministic text-to-glyph layout in physical page units, with multipage composition.
- [x] PDF exporter renders composed vector strokes and page backgrounds.
- [ ] Replace the text-only preview with the exact shared page scene graph used by exporters.
- [ ] Backup integrity hashes, schema migration tests and recovery from partial restore failures.
- [ ] Add unit/integration tests for layout, PDF, persistence and export package structure.

## P1 — handwriting capture and composition
- [x] Seven initial script sets plus a maths symbol set; German grid is constrained to 114 entries.
- [x] Fast Scan queue now has an explicit sequence; missing-only scan includes unsaved script characters and missing text glyphs.
- [x] New glyph samples record a baseline metric; the composer uses it to align new samples.
- [ ] Template overlay, adjustable capture canvas, saved-variant list, edit/delete and richer per-character management.
- [x] Capture pressure/tilt/time and expose five pen choices; actual brush models remain simplified.
- [ ] Velocity-aware brush models, interpolation, shape variation and higher-fidelity pen dynamics.
- [ ] 50+ scripts, contextual Arabic, Hebrew final forms, bidi and mixed RTL/LTR.
- [ ] Connected cursive mode and ligatures.
- [x] Basic LaTeX-like mathematical shorthand normalization and formula palette.
- [ ] Proper stacked fractions, scalable roots, equation layout, formula-aware glyph metrics and native math glyph workflows.
- [ ] Bold/highlight markup and table rendering.
- [x] Basic spacing, baseline jitter, margins and line spacing.
- [ ] Advanced line slope/wave, rule snapping, four independent margins and natural left-margin irregularity.

## P2 — page editor
- [ ] Multipage editor, page overview, active-page viewport, zoom and pan.
- [ ] Selection/lasso, multi-select and object inspector.
- [ ] Pen/highlighter/eraser with partial-stroke geometry.
- [ ] Handwritten text insertion, photos, page backgrounds and page insertion/reorder/delete.
- [ ] Undo/redo, clipboard, shortcuts, stylus-only mode and touch gestures.
- [ ] Shared page scene graph for preview, PDF and native exporters.

## P3 — export and release
- [ ] Implement a clean repeatable Goodnotes writer from the experimentally confirmed package structure. The imported test candidate was fixture-derived and is not an in-app exporter.
- [ ] Verify independent stroke selection, move, recolour and erasure; background separation; multipage; images; highlights; and Goodnotes round-trip.
- [ ] Samsung Notes, OneNote, Notability, Freenotes and Noteful writers, each independently validated.
- [x] PDF export and local-first PWA shell.
- [ ] Offline cache hardening, project-subpath service worker, local fonts, performance mode and accessibility.
- [ ] Mobile/tablet QA and matched-viewport screenshot comparisons.
- [ ] GitHub Pages deployment after parity and release checks.

## Current status

This repository is a working prototype and architecture foundation, not a complete GPTGenie recreation. The original product exposes a full PDF editor, richer settings, more than 50 scripts, several native exporters and polished responsive/stylus workflows. Those are not yet present here. A synthetic one-page Goodnotes archive imported without an error, but the experiment reused structural identifiers and an attachment from the supplied fixture; no clean reusable writer is in the app.
