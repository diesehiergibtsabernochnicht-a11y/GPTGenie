# GPTGenie rebuild backlog

## P0 — architecture and correctness
- [x] Store editable vector glyph strokes with x/y, pressure, time and tilt; retain PNG preview as a thumbnail.
- [ ] IndexedDB schema migrations, transactional autosave and quota handling.
- [ ] Complete typed scene graph for pages, strokes, glyphs, text, photos, backgrounds and annotations.
- [x] Deterministic text-to-glyph layout in physical page units, with multipage composition.
- [x] PDF exporter renders composed vector strokes and page backgrounds.
- [ ] Native Goodnotes writer and real-app validation, including independently erasable strokes. Source/round-trip fixture analysis is complete; independent serialization is not.
- [x] Portable JSON workspace backup/restore includes glyph samples, documents, presets and settings.
- [ ] Add backup integrity checks, migration tests and recovery from partial restore failures.

## P1 — handwriting capture and composition
- [x] Seven-script registry and 114-character German scan set.
- [x] Fast Scan, missing-character queue, edit/select saved glyphs and multiple variants.
- [ ] Template overlay and richer per-character management.
- [x] Five pen tool choices and pressure/tilt capture; basic seeded per-use glyph variation.
- [ ] Velocity-aware brush models, interpolation and higher-fidelity pen dynamics.
- [ ] 50+ scripts, contextual Arabic, Hebrew final forms, bidi and mixed RTL/LTR.
- [ ] Connected cursive mode and ligatures.
- [ ] Bold/highlight markup and mathematical shorthand.
- [x] Basic spacing, baseline jitter, margins and line spacing.
- [ ] Advanced line slope/wave, natural margins, rule snapping and per-glyph metrics.

## P2 — page editor
- [ ] Multipage editor, page overview, active-page viewport, zoom and pan.
- [ ] Selection/lasso and object inspector.
- [ ] Pen/highlighter/eraser with partial-stroke geometry.
- [ ] Handwritten text insertion, photos, page backgrounds and page insertion.
- [ ] Undo/redo, clipboard, shortcuts, stylus-only mode and touch gestures.
- [ ] Shared scene graph for PDF and native export.

## P3 — export and polish
- [x] PDF export and local-first PWA shell.
- [ ] Goodnotes native export; archive and stroke-format research is documented, writer not implemented.
- [ ] Samsung Notes, OneNote, Notability, Freenotes and Noteful, each independently validated.
- [ ] Offline cache hardening, local fonts, performance mode and accessibility.
- [ ] Mobile/tablet QA and matched-viewport screenshot comparisons.

## Current status

The repository now has vector handwriting capture, a basic text composition engine, multipage PDF generation, IndexedDB persistence, JSON workspace backup/restore and a PWA shell. It remains a prototype rather than a complete recreation. The two real Goodnotes samples establish that GPTGenie's generated strokes are accepted and mostly survive a Goodnotes round trip, but a standalone native writer has not yet been implemented or validated. The full page editor, broad multilingual catalogue, advanced text formatting, secondary notebook exporters and live runtime QA remain open.
