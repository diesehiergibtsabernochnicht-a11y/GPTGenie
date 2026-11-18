# REA reconstruction record

- Target: https://www.gptgenie.pro/
- Evidence date: 2026-11-18
- Rebuild repository: diesehiergibtsabernochnicht-a11y/GPTGenie
- Stack: React 19, TypeScript, Vite, IndexedDB, Canvas Pointer Events, shared vector layout, SVG preview, pdf-lib, fflate and PWA shell.
- Rebuild approach: independent implementation from public UI, first-party guides/changelog, user-supplied export samples and public format research.
- Classification: public UI/docs are observed product evidence; undocumented interactions and internal APIs remain unknown; the local-first data model and app architecture are proposed.

## Scope decisions

- No server, account system, AI provider, telemetry or remote generation dependency.
- The workspace remains local to the browser and is backed up as a portable JSON file.
- Glyph samples retain vector stroke points, PNG thumbnails and a writing-baseline metric.
- Preview, PDF and experimental Goodnotes export share the same text composition engine.
- The experimental Goodnotes writer emits a multi-page ZIP archive with event/index records, a separate PDF background attachment and TPL stroke objects. It is structurally tested in CI but has not yet been imported into Goodnotes from the current app.
- Secondary native exporters are not implemented.
- Do not claim recovered original source code.

## Current implementation status

- Implemented foundation: character capture, vector stroke storage, variants in data model, Fast Scan, initial script sets, baseline metadata, text composition, SVG scene preview with page navigation, multipage PDF, paper templates, IndexedDB, JSON backup/restore and PWA shell.
- Partial: variant editing, missing-character UX, mathematical shorthand, paper alignment, settings and experimental Goodnotes serialization.
- Absent: full page editor, full settings parity, 50+ scripts and shaping, stacked equation layout, destination-app validated native exports and other notebook writers.
- See REA-feature-inventory.md, REA-workflows.md, REA-verification.md and REA-backlog.md for feature-level detail.

## Verification

CI typecheck, unit tests and production build passed at commit 412687a. Later commits must rerun. This is a compile/test gate, not browser QA. Goodnotes import/editability, browser, tablet/stylus, storage, PDF visual comparison, offline and screenshot comparison remain unknown until exercised.

## Material limitations

No interactive browser, DevTools, source-map/HAR capture or REA live capture engine was available in this environment. The public target was inspected through indexed frontend UI and first-party product documentation. User-provided .goodnotes samples were inspected locally, but must not be committed or redistributed.
