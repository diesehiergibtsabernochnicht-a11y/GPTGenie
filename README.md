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
- Vitest unit tests and Playwright browser smoke tests
- Vite PWA shell and service-worker asset cache

## Run

    npm install
    npm run dev

Checks:

    npm run typecheck
    npm test
    npm run build
    npm run test:e2e
    npm run test:e2e:pages

## Implemented in this branch

- Three-stage workspace: handwriting, create notes, documents.
- Sample glyph capture as vector point strokes plus PNG preview; new samples record a writing baseline.
- Character variants with a saved-variant selector, edit-in-place, save-as-new and delete.
- Add custom Unicode symbols directly to the glyph library.
- Fast Scan with an explicit queue, missing-only mode, skip, faint template, progress and local resume after reload.
- Missing-glyph detection now includes symbols outside the selected script and exposes them in the character picker.
- Included sample character sets: German, English, Russian, Greek, Arabic, Hebrew, Japanese kana and a maths set. This is not yet the full 50+ language coverage of the reference product.
- Adaptive notebook stock: blank, wide/narrow ruled, squared and dotted paper; paper-line colour, margin guide, independent left/right/top/bottom margins, grid spacing, line slope/wave, margin irregularity, optional rule snapping and one local PNG/JPEG paper image with zoom, rotation and position controls. Up to 10 presets.
- Formula-aware maths: recursive formula parsing, stacked fractions with editable bars, square roots with overbars, superscripts, subscripts, Greek/operator symbols and German example presets. Matrices and advanced equation alignment are not implemented.
- Vector text composition, actual SVG handwriting preview and multipage preview navigation.
- Experimental page annotation editor: pen, marker, select/move, whole-stroke erase, copy/paste, delete and undo/redo. Added strokes are saved with documents and included in PDF/Goodnotes exports.
- Multipage PDF export from the same composition engine.
- Experimental native Goodnotes archive writer: ZIP package, event/index records, PDF paper attachment and native TPL stroke objects. It is not yet validated in Goodnotes from the current app code; pressure/brush fidelity and editor objects remain limited.
- Atomic IndexedDB autosave across the complete workspace, visible save/error state, transactional restore, and JSON backup with SHA-256 integrity validation, unsaved draft and Fast Scan checkpoint.
- PWA manifest and scoped same-origin service-worker cache; Vite builds are verified for both root hosting and the future `/GPTGenie/` GitHub Pages project path.

## Not yet implemented / not yet verified

- Full 50+ script catalogue, Arabic shaping, Hebrew bidi/mixed direction, contextual glyph forms and Japanese typesetting.
- Advanced equation layout (matrices, scalable delimiters, summation limits), connected cursive and rich inline formatting.
- Full multi-page PDF editor parity is not complete: lasso, selecting/translating generated glyphs, partial eraser, text/photo insertion, page operations and keyboard shortcuts remain.
- Goodnotes current-app import/editability/round-trip acceptance; other native exporters for Samsung Notes, OneNote, Notability, Freenotes and Noteful.
- Full visual/accessibility browser QA, tablet/stylus QA, first-install/offline-update QA, Goodnotes destination-app acceptance and GitHub Pages deployment. Core Chromium smoke tests now pass against both root hosting and the `/GPTGenie/` Pages path in GitHub Actions.

## Local data and backups

The app stores glyphs, vector strokes, documents, presets and settings in IndexedDB. Browser storage is tied to the local browser profile and may be cleared by the user or browser. Use **Settings & backup → Export complete backup** to save one JSON file. Restore it in another browser to move the workspace. Keep backups in a safe location.

## Privacy and offline

The application does not require a backend, account, telemetry or AI provider. Its UI, PDF generation and experimental Goodnotes package writing run in the browser. The service worker caches same-origin assets after first load; Playwright verifies offline reload on both root and `/GPTGenie/` paths. First installation still requires the app to be served once. No external font CDN is used.

## REA

The REA-based investigation and reconstruction records are maintained in docs/ (evidence ledger, workflow map, feature inventory, verification matrix, backlog and resume checkpoint). The reusable REA skill itself is not copied into this repository.
