# REA reconstruction record

- Target: https://gptgenie.pro/
- Target source inspected: public website page available to the browser search at capture time.
- Rebuild goal: local-first handwriting studio with Goodnotes-friendly PDF export.
- Source repo: diesehiergibtsabernochnicht-a11y/GPTGenie
- Stack: React, TypeScript, Vite, IndexedDB, Canvas Pointer Events, pdf-lib.
- Classification: target features described by public page content are observed; app workflows and internal implementation are unknown where not inspectable. Product architecture and local-first storage are proposed.

## Scope decisions

- No server, account system, AI provider, or remote generation dependency.
- User workspace is persisted in IndexedDB and exported as a single versioned JSON file.
- Custom glyph samples are drawn locally and embedded in exported PDFs when a matching character exists.
- Goodnotes compatibility is via standards-based PDF import, not reverse-engineering a proprietary package.

## Verification matrix

| Criterion | Rebuild check | Status |
|---|---|---|
| Local persistence | Inspect IndexedDB read/write paths | Unknown until browser runtime test |
| Workspace backup/restore | Validate versioned JSON schema and restore | Implemented; runtime test pending |
| Handwriting capture | Canvas pointer event path | Implemented; device test pending |
| PDF generation | pdf-lib page and glyph embedding | Implemented; runtime test pending |
| Goodnotes import | PDF compatibility | Unknown until import tested in Goodnotes |
| Offline operation | No app backend; font CDN remains optional external request | Partial |

## Limitations

The public site did not expose a source repository for the original application. The current rebuild is an original implementation from observable product positioning and requirements, not recovered source. A local browser QA environment was not available in this GitHub-only execution context.
