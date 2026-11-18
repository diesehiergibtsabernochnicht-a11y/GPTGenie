# GPTGenie rebuild backlog

Priorities reflect dependency and correctness, not a promise that the entire reference product is already reproduced.

## P0 — architecture and correctness
- [x] Store editable vector glyph strokes with x/y, pressure, time and tilt; retain PNG preview as a thumbnail.
- [x] Atomic multi-record IndexedDB autosave with visible saving/saved/error state and rollback on failed clone.
- [ ] IndexedDB schema migrations, quota handling and storage recovery/export prompts.
- [ ] Complete typed scene graph for pages, strokes, glyphs, text, photos, backgrounds, highlights and annotations.
- [x] Deterministic text-to-glyph layout in physical page units, with multipage composition.
- [x] PDF exporter renders composed vector strokes and page backgrounds.
- [x] Live SVG preview uses the same composition engine as PDF and Goodnotes.
- [x] SHA-256 integrity checks, versioned schema validation and atomic workspace restore, including unsaved draft and Fast Scan checkpoint.
- [ ] Schema migration tests and recovery from storage quota failures.
- [x] Unit tests for formula AST, missing glyphs, baseline alignment, atomic IndexedDB writes and Goodnotes archive structure.
- [x] Playwright smoke tests for formula editing, missing-glyph prompts, Goodnotes download/archive shape, SHA-256 backup export/restore, draft persistence and offline reload on root and Pages paths.
- [x] 390px mobile viewport check on both hosting paths; fixed a 55px horizontal overflow.
- [ ] Expand tests for IndexedDB migrations, quota/interrupted restore failures, Fast Scan workflows, 320px/tablet/landscape layout, touch/stylus and visual comparisons.

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
- [x] Recursive formula AST, missing-glyph traversal and vector layout for fractions, roots, superscripts and subscripts; formula palette and German example presets.
- [ ] Full equation layout: scalable delimiters, matrices, summation limits, formula-aware line wrapping and editor controls.
- [ ] Bold/highlight markup and table rendering.
- [x] Basic spacing, baseline jitter, margins and line spacing.
- [x] Four independent margins, line slope/wave, rule snapping, margin irregularity and up to 10 presets.
- [x] One local PNG/JPEG paper background with zoom, rotation and X/Y positioning, included in PDF/Goodnotes background.
- [ ] Saved background collection and richer background crop/fit controls.
- [ ] More natural left-margin shaping and additional layout controls.

## P2 — page editor
- [x] Multipage page preview with page navigation and an annotation layer.
- [x] Basic annotation tools: pen, marker, select/move, whole-stroke eraser, copy/paste, delete and undo/redo.
- [ ] Full multipage editor viewport, zoom/pan and page overview.
- [ ] Lasso/multi-select and object inspector; current selection only moves manually added ink, not generated glyphs.
- [x] Pen, marker and whole-stroke eraser for manually added ink.
- [ ] Partial-stroke eraser, highlighter opacity/brush model and generated-glyph editing.
- [ ] Handwritten text insertion, photos, page backgrounds and page insertion/reorder/delete.
- [x] Undo/redo and copy/paste for page annotations.
- [ ] Keyboard shortcuts, stylus-only mode and richer touch gestures.
- [ ] Extend the shared scene graph to editor objects and annotations.

## P3 — export and release
- [x] Experimental repeatable Goodnotes ZIP/protobuf/TPL writer with fresh IDs, separate PDF background attachment and per-page event/index records.
- [ ] Import the current app-generated file into Goodnotes; verify independent stroke selection, move, recolour and erasure; background separation; multipage; and round-trip.
- [ ] Improve Goodnotes pressure and brush-specific TPL schemas; add photos, text boxes, highlighters and editor object support.
- [ ] Samsung Notes, OneNote, Notability, Freenotes and Noteful writers, each independently validated.
- [x] PDF export and local-first PWA shell.
- [x] Project-subpath-aware Vite base, manifest and service-worker registration; scoped offline cache and navigation-only app-shell fallback.
- [x] Offline app-shell reload after one successful online load on root and Pages paths.
- [ ] First-install offline, update lifecycle, local fonts, performance mode and accessibility.
- [ ] Mobile/tablet QA and matched-viewport screenshot comparisons.
- [ ] GitHub Pages deployment after parity and release checks.

## Current status

This repository is a working prototype and architecture foundation, not a complete GPTGenie recreation. The original product exposes a full PDF editor, richer settings, more than 50 scripts, several native exporters and polished responsive/stylus workflows. Those are not yet present here. The current Goodnotes writer is structurally tested in CI but has not yet been imported into Goodnotes from the app; the earlier user-confirmed import was for a fixture-derived test candidate.

## Improvement backlog (REA decision record)

| Priority | Observed problem | Proposed change | Expected benefit | Acceptance criterion | Dependency / effort |
|---|---|---|---|---|---|
| P0 | Preview, PDF and Goodnotes must remain geometrically identical | Keep one scene graph and shared physical-unit layout; add golden geometry tests | Prevents export/preview drift | Same fixture yields same page count, bounds and stroke coordinates in every renderer | Scene graph tests; medium |
| P0 | Native Goodnotes schema is reconstructed from one sample and one page-event template | Validate current writer in Goodnotes; capture new fixtures for each brush and page operation | Avoids shipping an import-only or lossy exporter | Current app file imports; strokes independently select/move/recolour/erase; multipage round-trip matches | User Goodnotes test and additional fixtures; high |
| P1 | Fast Scan and glyph variant state are not yet covered by E2E | Test queue completion, skip, reload resume, variant edit/delete and quota failures | Prevents data loss in core capture workflow | Browser suite covers empty/full/missing queues and persisted variants | Playwright now available in CI; medium |
| P1 | Math engine lacks advanced equation structures | Add matrices, scalable delimiters, summation limits and equation alignment | More complete school mathematics | Advanced formula fixtures render with editable strokes and stable wrapping | Scene graph extension; high |
| P1 | RTL and non-Latin writing need shaping, not only Unicode glyph lookup | Add script-aware shaping and bidi pipeline | Correct reading order and contextual glyphs | Arabic/Hebrew mixed-direction fixtures render correctly | Unicode shaping dependency and extensive tests; high |
| P2 | The target includes a full PDF editor; rebuild has no editor | Add selectable scene objects, transforms, lasso, tools, undo and page operations | Closes largest functional parity gap | Each editor tool has keyboard, pointer and touch acceptance tests | Shared scene graph; very high |
| P2 | GitHub Pages project URLs and PWA root paths are not yet aligned | Configure Vite base, manifest, service worker scope and Pages deployment workflow | Stable public hosting and offline reload | Pages URL loads assets, refresh works, PWA installs and offline reload stays in project scope | Do only after app acceptance; medium |

