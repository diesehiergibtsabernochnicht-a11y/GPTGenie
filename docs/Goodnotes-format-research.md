# Goodnotes native export — technical research

## What the target does

GPTGenie's first-party Goodnotes guide states that its browser-side exporter converts each generated glyph into native pen strokes, stores paper separately as the page background, and writes a .goodnotes file. Its guide says every letter remains independently erasable/movable/recolourable, and editor-added pen marks, highlighters and photos are retained. It also says the conversion is local, without a server upload.

This is first-party product documentation, not a recovered implementation.

## Confirmed package structure

Official Goodnotes documentation accepts .goodnotes documents and .goodnotes.zip backups. The .goodnotes document is an app-specific format.

The inspected files confirm that .goodnotes is a ZIP archive. Observed members include:
- index.notes.pb: page member list;
- notes/<UUID>: page object/event stream;
- index.events.pb: document/page event log;
- index.attachments.pb and attachments/<UUID>: attached PDF/media;
- index.search.pb and search/<UUID>: search data, present in the Goodnotes re-export sample;
- thumbnail.jpg and schema.pb;
- document.info.pb, present in the Goodnotes re-export sample.

The page stream is a sequence of varint-length-prefixed protobuf records. In the inspected pages, object metadata records are paired with body records. The handwriting/stroke body is represented by protobuf field 7. The index uses repeated field 10 for page records and field 11 for attachment records.

The experimental one-page archive has eight ZIP members. Its event log has six length-prefixed records: document metadata (field 30), attachment metadata (field 6), page/document association (field 2), page order (field 54), page view update (field 10), and page record (field 102). The exact event semantics are inferred from the fields and sample comparison, not an official schema.

## Stroke geometry encoding

The sample's stroke geometry field begins with Apple's framed LZ4 markers (bv41 or stored-block bv4-), terminated by bv4$. Decompressing the block yields a TPL memory image beginning tpl\0, with an embedded size and format string.

One common format observed in the experimental stroke is:

    vuA(v)A(S(uu))A(S(uuuu))vA(f)

Observed values in the synthetic line sample:
- leading v value: 2;
- following u: float32 bit pattern for a nominal width of about 2.4;
- A(v): pen-up/down flags [0,1,1,...];
- A(S(uu)): one initial point pair;
- A(S(uuuu)): a sequence of four-value segment pairs, decoded as consecutive point pairs by the public parser;
- trailing v: 1;
- A(f): empty in this sample.

The stroke object's protobuf field 4 contains RGBA colour as four fixed32 float values. Field 5 is used by the inspected parser as a highlighter flag. This schema is one observed ink type, not a complete semantic specification for every brush, pressure model or Goodnotes version.

Independent parser research documents the same ZIP → protobuf → Apple framed LZ4 → TPL structure and describes stroke payload fields and path arrays. That project is a parser, not an official schema or validated authoring library. Its MIT licence was inspected; no third-party parser source has been copied into this writer.

## Real before/after round-trip evidence

Three user Library files were inspected locally and were not copied into this repository:
- an original two-page .goodnotes file exported by GPTGenie;
- a one-page .goodnotes file exported by Goodnotes after importing that original, containing its final page;
- a GPTGenie experimental one-page archive containing one synthetic stroke.

The original/re-export comparison established:
- The original package has two page records in index.notes.pb. Their page streams contain 2,552 and 620 length-prefixed records respectively.
- The Goodnotes re-export contains one page stream with 620 records. Its 310 field-7 drawing payloads align with the 310 drawing payloads in the source document's second page.
- 302 of those 310 drawing payloads are byte-for-byte identical between source and re-export.
- Eight payloads were rewritten by Goodnotes. Their record structure and object IDs differ; the re-export includes an additional field 14 on those rewritten records.
- The attachment PDF is byte-for-byte identical in both packages.
- Goodnotes creates/updates package metadata and search members, and the page UUID changes during the one-page export.

The user confirmed that the experimental one-page archive imported into Goodnotes without an error. Important qualification: that candidate was assembled by adapting the supplied fixture's event/page identifiers and background attachment. It proves that a minimally altered sample package can be imported, not that a clean serializer works from scratch.

## Rebuild writer now in the repository

The experimental serializer is implemented in src/export/goodnotes.ts and exposed as “Goodnotes · experimental” in the export row.

It:
1. uses a sanitized event-record template derived from the one-page experimental archive;
2. generates fresh document, attachment, page, event and stroke UUIDs;
3. writes a separate background PDF attachment containing the composed pages;
4. creates page index entries and one notes/<UUID> object stream per composed page;
5. serializes each placed ink stroke as a protobuf object with Apple-framed LZ4 and a TPL path;
6. writes RGBA colour metadata, a page thumbnail in the browser, schema metadata and a ZIP container;
7. repeats the page-event group and PDF page ordering key for each composed page.

This is a repeatable implementation, but it is still experimental. Current limitations:
- The observed TPL writer uses a simple 4-tuple path schema. It does not preserve per-point pressure/tilt or reproduce the five target brush engines.
- Marker metadata is represented, but the full target highlighter model is not.
- Photos, text boxes, lasso transformations, partial erasure and arbitrary editor objects are not represented because the rebuild editor is not implemented.
- The event template is based on one observed document/page event sequence. It is not an official Goodnotes schema and may vary across app versions.
- The browser-generated file has not yet been imported into Goodnotes from the current repository code. CI only checks the archive structure, page events, PDF attachment and TPL framing.
- The prior user import test was for the fixture-derived experimental candidate, not this new app-integrated serializer.

## Required real-app acceptance

Before calling the exporter compatible:
1. Download a file produced by the current app.
2. Import it into Goodnotes on the target device.
3. Confirm every character/pen path is visible and in the correct location.
4. Select one stroke, move it, recolour it and erase it independently.
5. Confirm paper remains as a separate page background.
6. Import a multi-page document and verify order, page size and backgrounds.
7. Round-trip export from Goodnotes and compare page count, object count, geometry and attachments.
8. Repeat with marker strokes and each supported pen type.
9. Repeat on the Goodnotes version(s) the user intends to use.

## Rebuild strategy

1. Preserve original captured points in our glyph model: x/y, pressure, time, tilt, brush, colour, width and opacity.
2. Compose every character occurrence into placed stroke objects.
3. Use one shared page scene graph for preview, PDF and Goodnotes.
4. Keep page backgrounds as PDF attachments and ink as native page objects.
5. Add brush-specific TPL variants only after a real-app fixture confirms each schema.
6. Keep the exporter labelled experimental until all acceptance tests pass.

## References

- GPTGenie Goodnotes guide: https://www.gptgenie.pro/goodnotes
- GPTGenie export release notes: https://www.gptgenie.pro/neuigkeiten
- Goodnotes import support: https://support.goodnotes.com/hc/en-us/articles/7353717816463-Import-files-into-Goodnotes
- Goodnotes export support: https://support.goodnotes.com/hc/en-us/articles/7353742824975-Export-documents-or-pages
- Public parser source candidate: https://github.com/Kaih1825/parser-for-goodnotes
- Public archive notes: https://pypi.org/project/goodparse/
