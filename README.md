# GPTGenie

A local-first handwriting studio. This repository is an active reconstruction of the public GPTGenie product, not a clone of its private source code.

## Product direction

- Build and save a personal glyph library using mouse, touch or stylus.
- Compose text from editable vector stroke samples.
- Export multipage PDF locally.
- Edit pages and export to native notebook formats as the scene graph and format writers mature.
- Store everything locally; one portable backup contains the complete workspace.

## Stack

- React 19 + TypeScript + Vite
- IndexedDB for local persistence
- Canvas Pointer Events for pressure-aware handwriting capture
- Shared vector layout engine
- pdf-lib for PDF generation
- Vite PWA shell and service-worker asset cache

## Run

```bash
npm install
npm run dev
```

Build with `npm run build`; check types with `npm run typecheck`.

## Implemented in this branch

- Three-stage workspace: handwriting, create notes, documents.
- Sample glyph capture as vector point strokes plus PNG preview.
- Character variants and character grid.
- Fast Scan flow and missing-character report for included script sets.
- Included sample character sets: German, English, Russian, Greek, Arabic, Hebrew and Japanese kana. This is not yet the full 50+ language coverage of the reference product.
- Adaptive notebook stock: blank, wide/narrow ruled, squared and dotted paper; paper-line colour, margin guide and grid/rule spacing controls. Handwriting size and baseline spacing adapt to the selected stock.\n- German-friendly maths palette and LaTeX-like normalization for fractions, roots, powers/subscripts, common operators and Greek letters; dedicated math-symbol glyph set and German school-formula starters.
- Shared vector text composition and multipage PDF export.
- IndexedDB persistence and JSON workspace backup/restore.
- PWA manifest and same-origin service-worker cache.

## Not yet implemented / not yet verified

- Full 50+ script catalogue, Arabic shaping, Hebrew bidi/mixed direction, contextual glyph forms and Japanese typesetting.
- Proper stacked fractions, scalable equation layout, connected cursive and rich inline formatting.
- Full multi-page PDF editor with lasso, transform, clipboard, partial eraser, image insertion and undo history.
- Complete native Goodnotes export is not yet integrated into the app. A minimal independently generated .goodnotes candidate (one ruled page and one vector stroke) has been imported by the user without errors; multi-stroke glyphs, selectable/erasable handwriting, paper variations and multipage documents still need validation. The next step is connecting the proven minimal writer to the shared page scene graph. See docs/Goodnotes-format-research.md.
- Samsung Notes, OneNote, Notability, Freenotes and Noteful writers.
- Production browser QA, tablet/stylus QA and full Goodnotes editability/round-trip validation.

## Local data and backups

The app stores glyphs, vector strokes, documents, presets and settings in IndexedDB. Browser storage is tied to the local browser profile and may be cleared by the user or browser. Use **Settings & backup → Export complete backup** to save one JSON file. Restore it in another browser to move the workspace. Keep backups in a safe location.

## Privacy and offline

The application does not require a backend, account, telemetry or AI provider. Its current UI and PDF generation run in the browser. The PWA service worker caches same-origin assets after first load; first installation still requires the app to be served once. No external font CDN is used.

## REA

The REA 2.0 skill and reference files are vendored under `.agents/skills/rea`. Evidence inventory, limitations, acceptance criteria and backlog are in `docs/`.
