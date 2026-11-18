# GPTGenie rebuild backlog

Priorities reflect dependency and correctness, not a promise that the entire reference product is already reproduced.

## P0 — architecture and correctness
- [x] Store editable vector glyph strokes with x/y, pressure, time and tilt; retain PNG preview as a thumbnail.
- [ ] IndexedDB schema migrations, transactional autosave, quota handling and storage error recovery.
- [ ] Complete typed scene graph for pages, strokes, glyphs, text, photos, backgrounds, highlights and annotations.
- [x] Deterministic text-to-glyph layout in physical page units, with multipage composition.
- [x] PDF exporter renders composed vector strokes and page backgrounds.
- [x] Live SVG preview uses the same composition engine as PDF and Goodnotes.
- [ ] Backup integrity hashes, schema migration tests and recovery from partial restore failures.
- [x] Unit tests for math normalization, missing glyphs, baseline alignment and Goodnotes archive structure.
- [ ] Expand tests for IndexedDB migrations, restore failures, layout edge cases and browser runtime.

## P1 — handwriting capture and composition
- [x] Seven initial script sets plus a maths symbol set; German grid is constrained to 114 entries.
- [x] Fast Scan queue, missing-only mode, skip, faint template, progress and IndexedDB resume state.
- [x] New glyph samples record a baseline metric; the composer uses it to align new samples.
- [x] Saved-variant list, select, edit-in-place, save-as-new and delete; custom Unicode symbol capture.
- [ ] Adjustable capture canvas, reusable trace templates and variant interpolation.
- [x] Capture pressure/tilt/time and expose five pen choices; actual brush models remain simplified.
- [ ] Velocity-aware brush models, interpolation, shape variation and higher-fidelity pen dynamics.
- [ ] 50+ scripts, contextual Arabic, Hebrew final forms, bidi and mixed RTL/LTR.
- [ ] Connected cursive mode and ligatures.
- [x] Basic LaTeX-like mathematical shorthand normalization and formula palette.
- [ ] Proper stacked fractions, scalable roots, equation layout, formula-aware glyph metrics and native math glyph workflows.
- [ ] Bold/highlight markup and table rendering.
- [x] Basic spacing, baseline jitter, margins and line spacing.
- [x] Four independent margins, line slope/wave, rule snapping, margin irregularity and up to 10 presets.
- [ ] More natural left-margin shaping and additional layout controls.

## P2 — page editor
- [ ] Multipage editor, page overview, active-page viewport, zoom and pan.
- [ ] Selection/lasso, multi-select and object inspector.
- [ ] Pen/highlighter/eraser with partial-stroke geometry.
- [ ] Handwritten text insertion, photos, page backgrounds and page insertion/reorder/delete.
- [ ] Undo/redo, clipboard, shortcuts, stylus-only mode and touch gestures.
- [ ] Extend the shared scene graph to editor objects and annotations.

## P3 — export and release
- [x] Experimental repeatable Goodnotes ZIP/protobuf/TPL writer with fresh IDs, separate PDF background attachment and per-page event/index records.
- [ ] Import the current app-generated file into Goodnotes; verify independent stroke selection, move, recolour and erasure; background separation; multipage; and round-trip.
- [ ] Improve Goodnotes pressure and brush-specific TPL schemas; add photos, text boxes, highlighters and editor object support.
- [ ] Samsung Notes, OneNote, Notability, Freenotes and Noteful writers, each independently validated.
- [x] PDF export and local-first PWA shell.
- [ ] Offline cache hardening, project-subpath service worker, local fonts, performance mode and accessibility.
- [ ] Mobile/tablet QA and matched-viewport screenshot comparisons.
- [ ] GitHub Pages deployment after parity and release checks.

## Current status

This repository is a working prototype and architecture foundation, not a complete GPTGenie recreation. The original product exposes a full PDF editor, richer settings, more than 50 scripts, several native exporters and polished responsive/stylus workflows. Those are not yet present here. The current Goodnotes writer is structurally tested in CI but has not yet been imported into Goodnotes from the app; the earlier user-confirmed import was for a fixture-derived test candidate.

## Improvement backlog (REA decision record)

| Priority | Observed problem | Proposed change | Expected benefit | Acceptance criterion | Dependency / effort |
|---|---|---|---|---|---|
| P0 | Preview, PDF and Goodnotes must remain geometrically identical | Keep one scene graph and shared physical-unit layout; add golden geometry tests | Prevents export/preview drift | Same fixture yields same page count, bounds and stroke coordinates in every renderer | Scene graph tests; medium |
| P0 | Native Goodnotes schema is reconstructed from one sample and one page-event template | Validate current writer in Goodnotes; capture new fixtures for each brush and page operation | Avoids shipping an import-only or lossy exporter | Current app file imports; strokes independently select/move/recolour/erase; multipage round-trip matches | User Goodnotes test and additional fixtures; high |
| P1 | Fast Scan and glyph variant state are not yet exercised in a browser | Test queue completion, skip, reload resume, variant edit/delete and quota failures | Prevents data loss in core capture workflow | Browser test suite covers empty/full/missing queues and persisted variants | Browser automation unavailable here; medium |
| P1 | Maths normalization is inline and loses equation structure | Introduce formula AST and stacked fraction/root scene nodes | More natural school mathematics | Fractions, roots, superscripts and Greek symbols retain layout and remain editable | Scene graph extension; high |
| P1 | RTL and non-Latin writing need shaping, not only Unicode glyph lookup | Add script-aware shaping and bidi pipeline | Correct reading order and contextual glyphs | Arabic/Hebrew mixed-direction fixtures render correctly | Unicode shaping dependency and extensive tests; high |
| P2 | The target includes a full PDF editor; rebuild has no editor | Add selectable scene objects, transforms, lasso, tools, undo and page operations | Closes largest functional parity gap | Each editor tool has keyboard, pointer and touch acceptance tests | Shared scene graph; very high |
| P2 | GitHub Pages project URLs and PWA root paths are not yet aligned | Configure Vite base, manifest, service worker scope and Pages deployment workflow | Stable public hosting and offline reload | Pages URL loads assets, refresh works, PWA installs and offline reload stays in project scope | Do only after app acceptance; medium |

