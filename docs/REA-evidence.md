# REA evidence ledger

Evidence date: 2026-11-18. Claims are classified as observed, source candidate, inferred, proposed or unknown. The REA capture engine was not exposed, so no REA evidence IDs, subject digests, screenshots or capture hashes are fabricated.

| ID | Evidence locator | Finding | Classification | Coverage / limitation |
|---|---|---|---|---|
| E01 | https://www.gptgenie.pro/ — indexed app UI, searched 2026-11-18 | Three-step product, 114-character German set, Fast Scan, text input, settings, live preview, PDF editor, export, keyboard shortcuts and editor controls | Observed | Search-indexed frontend representation, not live interaction |
| E02 | https://www.gptgenie.pro/neuigkeiten — updated 2026-10-26 | Oct 22: new design, Freenotes/Noteful export, light mode, German cursive, rich-text marker and five brush types. Oct 12: Goodnotes/Samsung/OneNote/Notability export, variant interpolation, slanted lines, custom symbols and Fast Scan template. Sep 29: offline mode, 50+ languages, maths, PDF editor, custom backgrounds, PWA, performance mode and paper controls | Observed | First-party changelog; details are product claims, not independently exercised |
| E03 | https://www.gptgenie.pro/anleitung — updated 2026-10-20 | Workflow for glyph capture, text, paper, missing characters, bold/highlighter markup, settings and PDF editing | Observed | First-party guide; gesture details unknown |
| E04 | https://www.gptgenie.pro/faq | Glyph drawing, multiple variants, missing-only scan, 50+ languages and local guest storage | Observed | First-party FAQ |
| E05 | https://www.gptgenie.pro/aboutus and /probleme | Mouse/finger/stylus, language support, paper controls, PDF editor and baseline troubleshooting | Observed | First-party product/help descriptions |
| E06 | https://www.gptgenie.pro/goodnotes, /samsung-notes, /onenote, /notability, /freenotes, /noteful | Native exporters claim editable pen strokes, separate paper/backgrounds, and editor annotations/photos carried through | Observed | First-party export guides; destination-app behaviour must still be tested |
| E07 | https://support.goodnotes.com/hc/en-us/articles/7353717816463-Import-files-into-Goodnotes and /7353742824975-Export-documents-or-pages | Goodnotes accepts .goodnotes documents; its native document export is app-specific and distinct from PDF | Observed | Official Goodnotes support |
| E08 | https://github.com/Kaih1825/parser-for-goodnotes and https://pypi.org/project/goodparse/ | ZIP, protobuf page records, Apple framed LZ4, TPL stroke geometry, object kinds and attachment structure | Source candidate | Parser projects are not official schemas or validated writers; MIT license inspected for parser-for-goodnotes |
| E09 | User Library samples: original GPTGenie export and Goodnotes re-export of its final page | Previously inspected sample pair showed page-record and drawing-payload continuity through Goodnotes import/export | Observed | User-supplied files; no raw content or IDs copied into repo |
| E10 | User Library file GPTGenie-Goodnotes-experimental.goodnotes | One page stream, one object-header record and one stroke-body record; page attachment PDF, event log and schema member. Stroke uses TPL format vuA(v)A(S(uu))A(S(uuuu))vA(f), with float32 coordinate bit patterns | Observed | Experimental candidate adapted structure/identifiers/background from supplied fixture; not a clean independent writer |
| E11 | User confirmation in conversation | Experimental candidate imported into Goodnotes without an error | Observed | Import acceptance only; selectable/movable/recolourable/erasable behaviour not confirmed |
| E12 | GitHub repository main branch | React/Vite app has glyph capture, IndexedDB records, basic text composition, PDF output, backup/restore and PWA shell | Observed | Direct source inspection; no browser runtime test |
| E13 | GitHub Actions CI workflow | Typecheck/build passed at commits 0471780 and 88bf876; a later PDF edit failed on a missing brace and was corrected in c4565b8 | Observed | Latest HEAD still needs a fresh successful run |
| E14 | Available tool inventory in this execution | No REA capture engine, browser automation, DevTools, screenshot comparison, HAR/network capture or source-map export action exposed | Observed | Reduces runtime reverse-engineering coverage; does not prove the target lacks these capabilities |
| E15 | Original frontend internals and backend | No original source map, JS bundle, network trace or backend contract inspected | Unknown | Do not claim source recovery or exact API reconstruction |

## Evidence handling

- User-provided notebooks and extracted page data remain outside this public repository.
- No synthetic REA evidence IDs or screenshot hashes are claimed.
- Source URLs, repository paths, commit hashes and local test observations are resolvable evidence locators.
- Search-indexed UI and first-party documentation establish feature claims, not that every interactive state was tested.
