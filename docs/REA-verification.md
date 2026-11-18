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
| Math formulas | Target changelog says fractions, powers and roots | Inline normalizer and symbol set exist; tests cover numeric fraction, root, powers and Greek operators | partial | Proper stacked fractions, scalable roots, formula metrics and native math glyph workflows |
| Paper templates | Target guide/news | Blank, ruled, squared and dotted options exist | unknown | Preview and PDF alignment need matched screenshot/PDF comparison |
| Settings parity | Target app index exposes four margins, slant, snapping, jitter and presets | Four margins, slope/wave, margin irregularity, snapping and 10-preset cap implemented | partial | Compare exact defaults, units, all ranges and preview behaviour with live target |
| Live preview | Target app index/guide | SVG preview uses the same composeText scene as PDF/Goodnotes; multipage navigation | pass (code and build test) | Visual comparison and browser interaction still pending |
| PDF output | Target guide | pdf-lib composes vector strokes and pages | unknown | No local browser PDF opened/compared in this environment |
| PDF editor | Target app index/guide | No generated-page editor in repo | fail | Implement full object/page editing and undo model |
| Native Goodnotes archive | User samples and public parser research | Repeatable ZIP/protobuf/TPL writer, fresh IDs, page records, separate PDF background; unit tests cover one- and multi-page archive structure | partial (structural tests only) | Import current app-generated file into Goodnotes |
| Goodnotes stroke editability | First-party guide claims individual strokes | TPL stroke records generated, but no current-code destination-app test | unknown | User must verify select, move, recolour, erase, multi-stroke and multi-page |
| Other native exporters | First-party news/guides | No writers present | fail | Implement and validate each target separately |
| IndexedDB persistence | Source inspection | IndexedDB code read | unknown | Reload, quota, migration and atomicity tests |
| Backup/restore | Source inspection | Versioned JSON export/import read | unknown | Schema validation, checksum, malformed/partial restore and round-trip tests |
| Offline PWA | Changelog and product docs | Manifest/service worker inspected | unknown | Current service-worker paths are root-relative and need project-subpath support before Pages |
| Accessibility/responsive | Target supports mobile/tablet/stylus | CSS/source inspection only | unknown | Keyboard, focus, screen reader, phone/tablet/desktop tests |
| Typecheck/tests/build | GitHub Actions | Typecheck, Vitest and production build pass at commit 412687a | pass (CI) | Re-run after latest preview and docs commits |
| GitHub Pages | Vite/GitHub docs | Not configured; Vite base currently / | unknown | Set /GPTGenie/, fix manifest/SW paths, add deploy workflow, enable Pages source in Settings |

## Test execution policy

- A successful TypeScript check/build is a compile gate, not functional QA.
- Every real export format requires import into its destination app.
- Compare same viewport, state, content fixture and page geometry when browser capture becomes available.
- Do not commit user notebooks, their attachments, IDs, thumbnails or extracted content as test fixtures.
