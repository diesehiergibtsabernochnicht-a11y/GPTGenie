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

The page stream is a sequence of varint-length-prefixed protobuf records. In the inspected pages, object metadata records are paired with body records. The handwriting/stroke body is represented by a protobuf field-7 payload. This agrees with independent reverse-engineering documentation, which describes field 7 as a stroke/shape object and field 2 of that object as its geometry container.

## Stroke geometry encoding

The sample's stroke geometry field begins with Apple's framed LZ4 markers (bv41 or stored-block bv4-, terminated by bv4$). Decompressing the block yields a TPL memory image beginning tpl\0, with an embedded size and format string. One common format observed in these samples is:

    vuA(v)A(S(uu))A(S(uuuu))vA(f)

The format contains typed arrays and structs for path data. The sample's parsed representation includes a visibility/segment-flag array, an initial coordinate pair, and a sequence of four-value path segments. This is a format observation, not a complete semantic specification for every brush or Goodnotes version.

Independent parser research documents the same ZIP → protobuf → Apple framed LZ4 → TPL structure and describes the stroke payload fields and path arrays. That project is a parser/exporter, not a validated .goodnotes authoring library. Do not assume that decoding support implies writing support.

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

This is strong evidence that the GPTGenie-generated page representation is accepted by Goodnotes and that the majority of the page's drawing payloads survive an import/export round trip unchanged. In a subsequent test, an independently generated one-page experimental .goodnotes file containing a ruled page and one simple vector stroke was also imported by the user into Goodnotes without an error. This validates the minimal package writer's import path, but not yet rich page composition, selectable/erasable stroke behavior, or every Goodnotes version.

## Rebuild strategy

1. Preserve original captured points in our glyph model: x/y, pressure, time, tilt, brush, colour, width and opacity.
2. Compose every character occurrence into independent placed stroke objects.
3. Build one page scene graph containing background, image attachments, handwriting strokes, highlights and editor annotations.
4. Implement a separate serializer that writes the ZIP archive, indexes, page records, attachment data and encoded stroke payloads.
5. Implement and test the binary layers independently: protobuf wire encoding, TPL path encoding, Apple framed LZ4 block encoding, and ZIP packaging.
6. Use the inspected GPTGenie page records as a known-good reference for record framing, metadata, and drawing payloads.
7. Start with a minimal synthetic notebook: one page, white background, one simple ballpoint stroke. Generate it by reusing only the structural patterns proven by the sample; do not guess required fields.
8. Open that generated file in Goodnotes and verify it is accepted.
9. Add glyph strokes and confirm each character is independently selectable and erasable.
10. Add multipage, background PDF, photos, highlighter and other tools incrementally.
11. Round-trip generated documents through Goodnotes export and compare archive members, record IDs, payloads and page geometry.
12. Keep the native writer experimental until it passes the real-app acceptance suite.

## Critical limitation

We now have a first independently generated candidate that the user successfully imported into Goodnotes without an error. This validates minimal package acceptance, not the full writer: multi-stroke glyphs, page backgrounds, multi-page documents and editability operations still need real-app verification. Do not describe the complete exporter as finished until those acceptance tests pass.

The supplied notebooks were used only for local analysis. Do not commit user notebooks, private document content, page IDs, attachments or extracted content to this public repository.

## Legal and licensing caution

Goodnotes is a trademark of its owner and this project is independent. Third-party format research is not official documentation. Review the applicable Goodnotes terms and the licenses of any code before incorporating format logic.
