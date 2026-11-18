# Goodnotes native export — technical research

## What the target does

GPTGenie's first-party Goodnotes guide states that its browser-side exporter converts each generated glyph into native pen strokes, stores paper separately as the page background, and writes a .goodnotes file. Its guide says every letter remains independently erasable/movable/recolourable, and editor-added pen marks, highlighters and photos are retained. It also says the conversion is local, without a server upload.

This is direct first-party product documentation, not a recovered implementation.

## Goodnotes format observations

Official Goodnotes documentation accepts .goodnotes documents and .goodnotes.zip backups. The .goodnotes document is an app-specific format.

Independent community research describes .goodnotes as a ZIP archive containing:
- index.events.pb: page/document event log and page ordering;
- index.notes.pb: page member list;
- notes/<UUID>: page object log, protobuf records;
- attachments/<UUID>: PDF paper, photos, stickers and other media;
- stroke geometry in protobuf field records, with Apple-framed LZ4 data and a TPL memory image.

The public projects discovered are primarily parsers/converters. They demonstrate that a file can be read and its stroke geometry recovered; they do not establish a complete authoring schema.

## Rebuild strategy

1. Preserve original captured points in our glyph model: x/y, pressure, time, tilt, brush, colour, width and opacity.
2. Compose every character occurrence into independent placed stroke objects.
3. Build one page scene graph containing background, image attachments, handwriting strokes, highlights and editor annotations.
4. Implement a separate serializer that writes the ZIP archive, indexes, page records, attachment data and encoded stroke payloads.
5. Start with a minimal synthetic notebook: one page, white background, one simple ballpoint stroke.
6. Open that generated file in Goodnotes and verify it is accepted.
7. Add glyph strokes and confirm each character is independently selectable and erasable.
8. Add multipage, background PDF, photos, highlighter and other tools incrementally.
9. Round-trip generated documents through Goodnotes export and compare archive member structure and page geometry.
10. Keep the native writer experimental until it passes the real-app acceptance suite.

## Critical limitation

We do not yet have a validated Goodnotes writer. Reverse-engineered parser observations do not guarantee that a generated archive is accepted by current Goodnotes versions. No file should be labelled Goodnotes-compatible until opened and tested in Goodnotes itself.

A user-provided, personally generated GPTGenie .goodnotes example is valuable as a structural reference, but it may contain private text or images. It should be a small synthetic document created solely for this analysis, with no personal content.

## Legal and licensing caution

Goodnotes is a trademark of its owner and this project is independent. Third-party format research is not official documentation. Review the applicable Goodnotes terms and the licenses of any code before incorporating format logic. Do not commit user notebooks, private documents, sample attachments or extracted content to this public repository.
