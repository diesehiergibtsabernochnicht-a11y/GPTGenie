# REA reconstruction record

- Target: https://www.gptgenie.pro/
- Evidence date: 2026-11-18
- Rebuild repository: diesehiergibtsabernochnicht-a11y/GPTGenie
- Stack: React 19, TypeScript, Vite, IndexedDB, Canvas Pointer Events, vector layout engine, pdf-lib and PWA shell.
- Rebuild approach: independent implementation from public UI, first-party guides/changelog, user-supplied export samples and public format research.
- Classification: public UI/docs are observed product evidence; undocumented interactions and internal APIs remain unknown; the local-first data model and app architecture are proposed.

## Scope decisions

- No server, account system, AI provider, telemetry or remote generation dependency.
- The workspace remains local to the browser and is backed up as a portable JSON file.
- Glyph samples retain vector stroke points and PNG thumbnails.
- PDF output is generated locally from vector glyphs and page templates.
- Native Goodnotes export is a required parity feature, not yet integrated in the repository. A one-page experimental archive imported without an error, but it was constructed by adapting the supplied fixture's package structure and identifiers. It is not evidence of a reusable clean writer.
- Secondary native exporters are also not implemented.
- Do not claim recovered original source code.

## Current implementation status

- Implemented foundation: character capture, vector stroke storage, variants in data model, basic Fast Scan, initial script sets, baseline metadata for new samples, text composition, multipage PDF, paper templates, IndexedDB, JSON backup/restore and PWA shell.
- Partial: variant editing, missing-character handling, mathematical shorthand, paper alignment and settings.
- Absent: full page editor, actual vector preview, full settings parity, 50+ scripts and shaping, stacked equation layout, reusable Goodnotes serializer and all secondary native exporters.
- See REA-feature-inventory.md and REA-backlog.md for feature-level detail.

## Verification

See REA-verification.md. CI typecheck/build success is a compile gate only. Browser, tablet/stylus, storage, PDF, Goodnotes editability, offline and screenshot comparison remain unknown until exercised.

## Material limitations

No interactive browser, DevTools, source-map/HAR capture or REA live capture engine was available in this environment. The public target was inspected through indexed frontend UI and first-party product documentation. User-provided .goodnotes samples were inspected locally, but must not be committed or redistributed.
