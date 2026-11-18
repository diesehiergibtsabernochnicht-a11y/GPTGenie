# Goodnotes native export — technical research

## What the target does

GPTGenie's first-party Goodnotes guide states that its browser-side exporter converts each generated glyph into native pen strokes, stores paper separately as the page background, and writes a .goodnotes file. Its guide says every letter remains independently erasable/movable/recolourable, and editor-added pen marks, highlighters and photos are retained. It also says the conversion is local, without a server upload.

This is direct first-party product documentation, not a recovered implementation.

## Confirmed package structure

Official Goodnotes documentation accepts .goodnotes documents and .goodnotes.zip backups. The .goodnotes document is an app-specific format.

The inspected real files confirm that .goodnotes is a ZIP archive. The package can contain:
- index.notes.pb: page member list;
- notes/<UUID>: page object/event stream;
- index.events.pb: document/page event log;
- index.attachments.pb and attachments/<UUID>: attached PDF/media;
- index.search.pb and search/<UUID>: search data, present in the Goodnotes re-export sample;
- thumbnail.jpg and schema.pb;
- document.info.pb, present in the Goodnotes re-export sample.

The page stream is a sequence of varint-length-prefixed protobuf records. In the inspected pages, records alternate between object metadata records and field-7 payload records. The payloads contain structured drawing data, including TPL-related data. This is an empirical observation from actual app-generated files, not a complete formal schema.

## Real before/after round-trip evidence

Two user-supplied files were inspected locally and were not copied into this repository:
- an original two-page .goodnotes file exported by GPTGenie;
- a one-page .goodnotes file exported by Goodnotes after importing that original, containing its final page.

The comparison establishes:
- The GPTGenie source package has two page records in index.notes.pb. Their page streams contain 2,552 and 620 length-prefixed records respectively.
- The Goodnotes re-export contains one page stream with 620 records. Its 310 field-7 drawing payloads align with the 310 drawing payloads in the source document's second page.
- 302 of those 310 drawing payloads are byte-for-byte identical between source and re-export.
- Eight payloads were rewritten by Goodnotes. Their record structure and object IDs differ; the re-export includes an additional field 14 on those rewritten records.
- The attachment PDF is byte-for-byte identical in both packages.
- Goodnotes creates/updates package metadata and search members, and the page UUID changes during the one-page export.

This is strong evidence that the GPTGenie-generated page representation is accepted by Goodnotes and that the majority of the page's drawing payloads survive an import/export round trip unchanged. It does not yet prove that a new independent writer can create a valid package: the original GPTGenie export is the known-good seed, and the eight rewritten records plus document-level metadata still need to be understood.

## Rebuild strategy

1. Preserve original captured points in our glyph model: x/y, pressure, time, tilt, brush, colour, width and opacity.
2. Compose every character occurrence into independent placed stroke objects.
3. Build one page scene graph containing background, image attachments, handwriting strokes, highlights and editor annotations.
4. Implement a separate serializer that writes the ZIP archive, indexes, page records, attachment data and encoded stroke payloads.
5. Use the inspected GPTGenie page records as a known-good reference for record framing, metadata, and drawing payloads.
6. Start with a minimal synthetic notebook: one page, white background, one simple ballpoint stroke. Generate it by reusing only the structural patterns proven by the sample; do not guess required fields.
7. Open that generated file in Goodnotes and verify it is accepted.
8. Add glyph strokes and confirm each character is independently selectable and erasable.
9. Add multipage, background PDF, photos, highlighter and other tools incrementally.
10. Round-trip generated documents through Goodnotes export and compare archive members, record IDs, payloads and page geometry.
11. Keep the native writer experimental until it passes the real-app acceptance suite.

## Critical limitation

We now have strong real-app evidence for the GPTGenie-to-Goodnotes import path, but we do not yet have a validated independent Goodnotes writer. Parser observations and a successful import of the source file do not guarantee that a newly generated archive will be accepted by current Goodnotes versions. No newly generated file should be labelled Goodnotes-compatible until opened and tested in Goodnotes itself.

The supplied notebooks were used only for local analysis. Do not commit user notebooks, private document content, page IDs, attachments or extracted content to this public repository.

## Legal and licensing caution

Goodnotes is a trademark of its owner and this project is independent. Third-party format research is not official documentation. Review the applicable Goodnotes terms and the licenses of any code before incorporating format logic.
