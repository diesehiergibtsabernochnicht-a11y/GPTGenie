# GPTGenie — REA feature inventory

Target: https://www.gptgenie.pro/
Evidence date: 2026-11-18. Evidence is based on indexed public frontend UI, first-party documentation and the user's Goodnotes test samples, not interactive browser capture.
Classification: Observed = exposed in UI or documented by GPTGenie; inferred = implied but not exercised; proposed = our design; unknown = needs runtime validation.

## Workflow and character capture
- Three-step flow: handwriting, text creation, settings/preview.
- Draw glyphs using mouse, touch or stylus; save multiple versions per character.
- Fast Scan sequentially guides through the active script; missing-only mode and faint template are documented.
- German UI shows 114 characters. Missing glyphs are reported before generation; user may draw them or continue.
- Saved glyph variants can be reopened, edited in place, saved as new versions and deleted; a sample count appears in the character grid. Custom Unicode symbols can be added.
- Five pen styles: felt-tip, ballpoint, fountain, brush, pencil. Pressure affects stylus strokes; speed can influence mouse/finger strokes.
- Character shape variation can select/interpolate versions per occurrence; setting ranges from off to strong.
- Connected German cursive is supported.

## Scripts and language
- 50+ languages/scripts: Latin family, Cyrillic, Greek, Armenian, Georgian, Japanese Hiragana/Katakana, Arabic, Persian, Urdu and Hebrew.
- RTL rendering for Arabic/Hebrew; Arabic contextual forms and lam-alif ligature; Hebrew final forms are separate glyphs.
- Mixed Latin digits/words inside RTL text preserve their reading direction.
- Japanese kana and punctuation are included; Kanji are explicitly excluded.

## Text composition and layout
- Multiline text, paragraphs, line breaks and multipage generation.
- Bold markup with **text**; coloured marker markup such as ==text== and ==green:text==.
- Mathematical shorthand for fractions, superscripts and roots. The rebuild now parses LaTeX-like fractions, roots, superscripts and subscripts into a formula tree and lays them out as editable vector glyphs with fraction bars and radical overbars. It remains a partial math engine: matrices, scalable delimiters, summation limits, formula-aware wrapping and advanced equation alignment are absent. Missing-character prompts now use the formula AST, so synthetic fraction bars and parentheses are not incorrectly requested as glyphs.
- Settings: ink colour, character size, character spacing, word spacing, baseline/position irregularity, variation strength, line spacing, optional rule snapping, line slope/wave, left/right/top/bottom margins and left-margin irregularity. The rebuild now has four margins, slope/wave, rule snapping, margin jitter and a 10-preset cap.
- Up to 10 saved settings presets, live preview and reset/defaults.

## Paper, preview and editor
- Blank, lined, grid, dotted and coloured paper; custom image background with move/zoom/rotate and saved background collection.
- Full-screen preview, zoom, page navigation, vertical multipage canvas and active-page tracking.
- Editor tools: select, area/lasso, text, pen, highlighter, eraser, photo.
- Selection supports move, resize, duplicate, cut, copy, paste and delete; inspector exposes ink colour, X/Y, width and height.
- Pen tools include five brush models, width, pressure, colour and straight-line modifier.
- Highlighter includes five colours, width and opacity. Eraser supports partial-stroke and whole-stroke modes, with optional text/photo erasure.
- Add pages with blank, A4, same-as-current, preset paper or custom photo background.
- Undo/redo and keyboard shortcuts; stylus-only drawing; touch pinch zoom and pan.

## Export, offline and storage
- PDF generation and editing.
- First-party guides claim native Goodnotes, Samsung Notes, OneNote, Notability, Freenotes and Noteful exports. Generated letters become editable native pen strokes; paper stays separate; editor additions/photos are retained.
- Browser-only conversion; no account or server required for native export.
- Offline drawing, text composition and PDF generation; installable PWA and performance mode.
- Original product stores guest data temporarily in browser and account users can persist glyphs. Our rebuild intentionally remains local-only.

## Goodnotes format evidence
Goodnotes officially imports .goodnotes documents and .goodnotes.zip backups. The inspected user samples and public parser research support a ZIP container with page records, protobuf indexes, attachments, Apple-framed LZ4 and TPL stroke geometry. The one-page experimental candidate imported without error, but it reused page/attachment identifiers and the background PDF from the supplied fixture. The app now contains an experimental repeatable writer that creates fresh IDs, per-page notes streams, page-event records and a separate PDF background attachment. It is structurally tested in CI but has not yet been imported into Goodnotes from the current app code; editability and cross-version compatibility remain unknown.

## Rebuild status snapshot
- Implemented foundation: vector glyph capture, multiple-sample selection/edit/delete, custom Unicode symbols, resumable Fast Scan, initial script sets, baseline-aware text composition, SVG page preview, multipage PDF, paper templates and settings, IndexedDB and JSON backup/restore.
- Partial: saved-variant editing, missing glyph UX, maths, paper alignment and settings.
- Absent: full PDF editor, full settings parity, 50+ scripts/shaping, full equation layout, Goodnotes destination-app validation/brush fidelity and secondary native exporters. The vector preview and experimental Goodnotes writer are now present.
- Exact acceptance criteria and pass/fail/unknown results are maintained in docs/REA-verification.md.

## Architecture proposed for this rebuild
- Browser-only React/TypeScript; no server, accounts, telemetry or remote AI calls.
- IndexedDB with schema migrations, atomic autosave, quota handling and full backup/restore.
- Stroke-native glyph model: point x/y, pressure, tilt, timestamp, brush, colour and width.
- Glyph registry by script, language, Unicode code point, contextual form and variant.
- Deterministic seeded layout/variation engine using physical page units (points/mm), with per-glyph baseline metrics.
- Shared scene graph for pages, glyph strokes, annotations, images, paper and text; PDF and Goodnotes exporters consume the same graph.
- Versioned single-file JSON backup including documents, editable page annotations, unsaved draft, Fast Scan checkpoint, glyphs, presets and settings, with SHA-256 integrity hashes and atomic restore.
- PWA shell and offline asset cache; all app fonts bundled locally.

## Unknowns and limitations
- No interactive browser, screenshots, DevTools, source-map or HAR capture was available in this environment.
- No original source code or local app bundle was recovered.
- Native writer editability and destination-app behaviour remain unverified beyond one Goodnotes import without an error.
