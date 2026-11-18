# GPTGenie

A local-first handwriting studio. This repository is an active reconstruction of the public GPTGenie product, not a clone of its private source code.

## Product direction

- Build and save a personal glyph library using mouse, touch or stylus.
- Compose text from editable vector stroke samples.
- Preview and export multipage PDF locally from the same vector layout engine.
- Export an experimental native Goodnotes notebook with separate PDF paper and protobuf/TPL ink objects.
- Store everything locally; one portable backup contains the complete workspace.

## Stack

- React 19 + TypeScript + Vite
- IndexedDB for local persistence
- Canvas Pointer Events for pressure-aware handwriting capture
- Shared vector layout engine and SVG live preview
- pdf-lib for PDF and Goodnotes background PDF generation
- fflate for browser-side ZIP writing
- Vitest unit tests
- Vite PWA shell and service-worker asset cache

## Run

    npm install
    npm run dev

Checks:

    npm run typecheck
    npm test
    npm run build

## Implemented in this branch

- Three-stage workspace: handwriting, create notes, documents.
- Sample glyph capture as vector point strokes plus PNG preview; new samples record a writing baseline.
- Character variants with a saved-variant selector, edit-in-place, save-as-new and delete.
- Add custom Unicode symbols directly to the glyph library.
- Fast Scan with an explicit queue, missing-only mode, skip, faint template, progress and local resume after reload.
- Missing-glyph detection now includes symbols outside the selected script and exposes them in the character picker.
- Included sample character sets: German, English, Russian, Greek, Arabic, Hebrew, Japanese kana and a maths set. This is not yet the full 50+ language coverage of the reference product.
- Adaptive notebook stock: blank, wide/narrow ruled, squared and dotted paper; paper-line colour, margin guide, independent left/right/top/bottom margins, grid spacing, line slope/wave, margin irregularity and optional rule snapping. Up to 10 presets.
- German-friendly maths palette and LaTeX-like normalization for numeric fractions, roots, powers/subscripts, common operators and Greek letters. Stacked equation layout is not implemented.
- Vector text composition, actual SVG handwriting preview and multipage preview navigation.
- Multipage PDF export from the same composition engine.
- Experimental native Goodnotes archive writer: ZIP package, event/index records, PDF paper attachment and native TPL stroke objects. It is not yet validated in Goodnotes from the current app code; pressure/brush fidelity and editor objects remain limited.
- IndexedDB persistence and JSON workspace backup/restore.
- PWA manifest and same-origin service-worker cache.

## Not yet implemented / not yet verified

- Full 50+ script catalogue, Arabic shaping, Hebrew bidi/mixed direction, contextual glyph forms and Japanese typesetting.
- Proper stacked fractions, scalable equation layout, connected cursive and rich inline formatting.
- Full multi-page PDF editor with lasso, transform, clipboard, partial eraser, image insertion and undo history.
- Goodnotes current-app import/editability/round-trip acceptance; other native exporters for Samsung Notes, OneNote, Notability, Freenotes and Noteful.
- Production browser QA, tablet/stylus QA, offline QA and GitHub Pages deployment.

## Local data and backups

The app stores glyphs, vector strokes, documents, presets and settings in IndexedDB. Browser storage is tied to the local browser profile and may be cleared by the user or browser. Use **Settings & backup → Export complete backup** to save one JSON file. Restore it in another browser to move the workspace. Keep backups in a safe location.

## Privacy and offline

The application does not require a backend, account, telemetry or AI provider. Its current UI, PDF generation and experimental Goodnotes package writing run in the browser. The PWA service worker caches same-origin assets after first load; first installation still requires the app to be served once. No external font CDN is used.

## REA

The REA 2.0 skill and reference files are vendored under .agents/skills/rea. Evidence inventory, workflow maps, limitations, acceptance criteria and backlog are in docs/.
