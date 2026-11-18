# REA brief — GPTGenie reconstruction

- Target: https://www.gptgenie.pro/ (public browser application)
- Evidence snapshot: 2026-11-18; latest first-party release note located: 2026-10-26
- Rebuild repository: https://github.com/diesehiergibtsabernochnicht-a11y/GPTGenie
- Goal: recreate publicly observable GPTGenie workflows and user-facing capabilities as an independent, local-first web app.
- Roles/access: public guest-facing web app; no authenticated target session was inspected. Rebuild assumes one local workspace per browser profile.
- Fidelity: functional parity first, then matched visual behaviour and responsive layouts. Do not copy private source, proprietary assets, or branding assets beyond the user-selected project name.
- Target stack: React 19, TypeScript, Vite, IndexedDB, vector stroke scene graph, PDF and native notebook exporters.
- Constraints: no backend, account service, telemetry, remote AI, or upload of handwriting. Preserve offline operation and complete local backup/restore.

## Evidence and access

- First-party indexed app UI, release notes, FAQ, guides and export guides were searched and reviewed.
- The user's original GPTGenie .goodnotes export, its Goodnotes re-export, and a generated experimental candidate were inspected from the Library. The user confirmed the experimental candidate imported without an error.
- The complete repository tree and all current application modules were inspected through the connected GitHub repository.
- No REA capture engine, interactive browser automation, DevTools session, screenshot comparator, HAR/network capture or source-map export was exposed in this environment. Runtime target states, exact request contracts, and matched screenshots therefore remain unknown.
- No private source code for GPTGenie was recovered. The rebuild is an independent implementation from public evidence, not recovered source.

## Required parity criteria

1. Character drawing with mouse, touch and stylus; save multiple variants and reopen/edit/delete a chosen variant.
2. Fast Scan for all characters and missing-only scan; correct queue, progress, skip and resume behaviour.
3. German 114-character set plus documented script families; unsupported characters must be explicitly surfaced, never silently replaced with '?'.
4. Compose paragraphs, line breaks, multi-page output and missing-character warnings.
5. Match target writing controls: size, ink, character/word spacing, irregularity/variation, line spacing/snapping, slant/wave, all four margins and left-margin irregularity.
6. Paper choices: blank, ruled, squared, dotted, coloured and user-provided image backgrounds with transform/save controls.
7. Preview matches actual generated pages; zoom, page navigation and full-screen preview.
8. PDF editor: select/lasso, move, resize, duplicate, cut/copy/paste/delete, text insertion, pen, marker, partial/whole eraser, photo, page operations, undo/redo and keyboard/touch/stylus interactions.
9. Exports: PDF and native editable Goodnotes, Samsung Notes, OneNote, Notability, Freenotes and Noteful formats; each exporter validated in its destination app.
10. Local persistence, complete integrity-checked backup/restore and offline PWA operation.
11. GitHub Actions typecheck, automated tests, production build and GitHub Pages deployment from the project subpath.

## Explicit assumptions

- Account sync and cross-device server persistence are intentionally excluded; local-first single-device storage is the required architecture.
- Exact undocumented internal APIs and binary schemas are not assumed to be recovered. Any reconstructed format contract is labelled as inferred until tested.
- GitHub Pages is a later release stage, after app-path handling, offline storage and exporter validation. A project site requires Vite's /GPTGenie/ base path and a Pages workflow.
