# GPTGenie — REA feature inventory

Target: https://www.gptgenie.pro/
Evidence date: 2026-11-18. Evidence is based on the public app's indexed frontend UI and first-party product documentation, not an interactive browser capture.
Classification: Observed = exposed in UI or documented by GPTGenie; inferred = implied but not exercised; proposed = our design; unknown = needs runtime validation.

## Workflow and character capture
- Three-step flow: handwriting, text creation, settings/preview.
- Draw glyphs using mouse, touch or stylus; save multiple versions per character.
- Fast Scan sequentially guides through the active script; missing-only mode and faint template are documented.
- German UI shows 114 characters. Missing glyphs are reported before generation; user may draw them or continue.
- Saved glyph variants can be reopened and edited; a sample count appears in the character grid.
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
- Mathematical shorthand for fractions, superscripts and roots.
- Settings: ink colour, character size, character spacing, word spacing, baseline/position irregularity, variation strength, line spacing, optional rule snapping, line slope/wave, left/right/top/bottom margins and left-margin irregularity.
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
- First-party guide documents native Goodnotes export: generated letters become separate editable pen strokes; paper stays a separate background; page count follows source PDF; editor pen/highlighter/photo additions are carried into the Goodnotes file.
- Changelog documents Samsung Notes, OneNote, Notability, Freenotes and Noteful targets.
- Browser-only Goodnotes conversion; no account or server required for generation.
- Offline drawing, text composition and PDF generation; installable PWA and performance mode.
- Original product stores guest data temporarily in browser and account users can persist glyphs. Our rebuild intentionally remains local-only.

## Goodnotes format evidence
Goodnotes officially imports .goodnotes documents and .goodnotes.zip backups. Independent research identifies a ZIP container with page records, protobuf indexes, attachments, Apple-framed LZ4 and TPL stroke geometry. Parser implementations are useful format evidence but are not writer specifications. A valid writer must be tested by opening a generated file in Goodnotes and confirming independent stroke selection/eraser behaviour, backgrounds, attachments and page ordering.

## Architecture proposed for this rebuild
- Browser-only React/TypeScript; no server, accounts, telemetry or remote AI calls.
- IndexedDB with schema migrations, atomic autosave, quota handling and full backup/restore.
- Stroke-native glyph model: point x/y, pressure, tilt, timestamp, brush, colour and width; not just bitmap snapshots.
- Glyph registry by script, language, Unicode code point, contextual form and variant.
- Deterministic seeded layout/variation engine using physical page units (points/mm).
- Shared scene graph for pages, glyph strokes, annotations, images, paper and text; PDF and Goodnotes exporters consume the same graph.
- Versioned single-file JSON backup including images, documents, glyphs, presets and settings, with integrity hashes.
- PWA shell and offline asset cache; all app fonts bundled locally.

## Acceptance criteria
1. Complete German scan set and accurate missing-character report.
2. Multiple glyph variants create natural, reproducible variation.
3. Multiline/multipage layout fits physical margins and paper templates.
4. RTL scripts and contextual glyph forms render correctly.
5. Editor objects support select/move/resize/copy/delete/erase/undo.
6. PDF page count and geometry match preview.
7. Goodnotes file opens in Goodnotes; letters remain independently editable; backgrounds are separate; photos and editor annotations survive.
8. Full workspace backup round-trips every record and embedded asset offline.
9. App works offline after initial install.
10. Desktop, tablet and phone; keyboard, touch and stylus paths tested.

## Unknowns and limitations
- No interactive browser, screenshots, DevTools, source-map or HAR capture was available in this environment.
- No original source code or local app bundle was recovered.
- Exact Goodnotes writer schema remains unverified until a synthetic file is opened in Goodnotes.
- Other notebook targets each need independent format research and sample-based validation.