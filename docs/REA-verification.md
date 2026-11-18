# REA verification matrix

Last reviewed: 2026-11-18. Results are separated by functional, visual and operational evidence. Unknown is not a pass.

| Criterion | Original evidence | Rebuild check | Result | Gap / next validation |
|---|---|---|---|---|
| Public product scope | First-party app index, FAQ, guide, changelog | Repository and feature inventory inspected | pass (evidence review only) | No private source recovered |
| Character drawing | First-party guide/news | Pointer-event canvas and vector point model inspected | unknown | Browser and tablet/stylus interaction not exercised |
| Baseline alignment | Target guide and troubleshooting docs | New samples record a 70% baseline; layout uses it; legacy samples bottom-align | unknown | Need visual sample with ascenders/descenders and real text |
| Fast Scan | First-party app index/FAQ | Queue builder unit-tested; skip, faint guide, progress and IndexedDB resume implemented | partial | Browser test needed for reload/resume, skip and final-character transitions |
| Unsupported/missing glyphs | Target guide says missing glyphs are listed and can remain blank | Rebuild reports all unsaved text glyphs, offers them in picker; PDF no longer inserts '?' | pass (unit-level logic only) | Browser test custom Unicode, RTL and actual drawing |
| German 114 characters | Target app index and guide | Rebuild slices its own German character array to 114 | pass (count test only) | Verify exact character membership/order against live grid |
| Multiple variants | FAQ/news | Saved-variant list, edit-in-place, save-as-new and delete implemented | partial | Add interpolation and test state persistence/visual consistency |
| Language support | FAQ/languages docs | Seven initial scripts plus maths set | fail (scope gap) | 50+ languages, contextual Arabic, Hebrew bidi, mixed-direction and Japanese shaping absent |
| Math formulas | Target changelog says fractions, powers and roots | Recursive formula AST lays out stacked fractions, radical overbars, superscripts and subscripts as editable glyph strokes; missing-glyph prompts traverse visible formula glyphs; parser, combined layout and Goodnotes export tests pass | partial | Matrices, scalable delimiters, summation limits, formula-aware wrapping and destination-app visual QA |
| Paper templates | Target guide/news | Blank, ruled, squared, dotted and one transformed PNG/JPEG background; PDF/Goodnotes use separate paper attachment | partial | No saved background collection; compare paper rendering/positioning in browser and Goodnotes |
| Settings parity | Target app index exposes four margins, slant, snapping, jitter and presets | Four margins, slope/wave, margin irregularity, snapping and 10-preset cap implemented | partial | Compare exact defaults, units, all ranges and preview behaviour with live target |
| Live preview | Target app index/guide | SVG preview uses the same composeText scene as PDF/Goodnotes; app loads and formula editing/download flow passes Playwright in root and Pages builds | partial | Screenshot comparison, full preview interaction and ascender/descender visual fixtures |
| PDF output | Target guide | pdf-lib composes vector strokes and pages | unknown | No local browser PDF opened/compared in this environment |
| PDF/page editor | Target app index/guide | Pen/marker annotation, selection/move, whole-stroke erase, copy/paste, delete, undo/redo; edits persist and export | partial | No lasso, generated-glyph selection, partial eraser, text/photo insertion, page operations or shortcut parity |
| Native Goodnotes archive | User samples and public parser research | Repeatable ZIP/protobuf/TPL writer, fresh IDs, page records, separate PDF background; Vitest and Playwright download/archive assertions pass, formula and handwriting smoke files generated | partial (archive/flow pass) | Import current app-generated file into Goodnotes |
| Goodnotes stroke editability | First-party guide claims individual strokes | TPL stroke records generated, but no current-code destination-app test | unknown | User must verify select, move, recolour, erase, multi-stroke and multi-page |
| Other native exporters | First-party news/guides | No writers present | fail | Implement and validate each target separately |
| IndexedDB persistence | Source inspection | Atomic six-record workspace transaction; rollback-on-clone-failure tests; Playwright confirms draft autosave survives browser reload on root and Pages builds | partial | Quota, migration, multi-tab and interrupted-write tests |
| Backup/restore | Source inspection | Version 3 SHA-256 checksum, schema validation, atomic IndexedDB restore, unsaved draft and Fast Scan checkpoint; Vitest plus Playwright export/restore round-trip pass | pass (functional smoke) | Browser storage quota, interrupted transaction, cross-browser restore and large workspace tests |
| Offline PWA | Changelog and product docs | Manifest and scoped service worker; Playwright confirms offline reload after initial online load on root and `/GPTGenie/` paths | partial (offline reload pass) | First-install offline, update lifecycle, stale cache recovery and cross-browser behavior |
| Accessibility/responsive | Target supports mobile/tablet/stylus | CSS/source inspection only | unknown | Keyboard, focus, screen reader, phone/tablet/desktop tests |
| Typecheck/tests/build/browser smoke | GitHub Actions | CI run 44288019150 at b84e1fc passed typecheck, Vitest, root build, Pages build, and Playwright formula/missing-glyph/Goodnotes download/backup export+restore/draft persistence/offline reload/mobile layout tests on both root and `/GPTGenie/` hosting | pass (automated smoke) | Visual/accessibility, touch/stylus, first-install offline and full editor tests remain unknown |
| Mobile layout | Playwright at 390×844 | Writing workflow and preview remain visible with no horizontal document overflow on both root and `/GPTGenie/` builds | pass (mobile smoke) | Tablet, small 320px, landscape and real-device touch/stylus checks |\n| GitHub Pages | Vite/GitHub docs | Root and `/GPTGenie/` builds both pass; Playwright runs against Vite preview at `/GPTGenie/`; manifest and service worker are scoped correctly | partial (deployment not configured) | Finish app acceptance, add deploy workflow and enable Pages source in Settings |

## Test execution policy

- A successful TypeScript check/build is a compile gate, not functional QA.
- Every real export format requires import into its destination app.
- Compare same viewport, state, content fixture and page geometry when browser capture becomes available.
- Do not commit user notebooks, their attachments, IDs, thumbnails or extracted content as test fixtures.
