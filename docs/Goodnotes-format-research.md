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

The stroke geometry field is an Apple-framed LZ4 stream (bv41 or stored-block bv4-, terminated by bv4$). Its decompressed payload starts with tpl\0, an embedded size and a self-describing type signature. One common uniform-ink signature in all three inspected files is:

    vuA(v)A(S(uu))A(S(uuuu))vA(f)

For this signature, the inspected values contain a version, one uniform width, node flags, move-point pairs, quadratic segment tuples, a trailing version value and an empty float array. Flags use 0 for a move node and 1 for a quadratic segment. The stroke object's protobuf field 4 contains RGBA colour as float32 sub-fields 1–4. The inspected samples use object class code 24; no field-5 highlighter flag or per-point pressure/tilt array was present in these samples.

**Coordinate and width calibration matters.** The attached PDF page is A4 (595.28 × 841.89 PDF points), while the Goodnotes page canvas is approximately 1091 × 1543 canvas units. Public format notes document a uniform canvas-to-PDF scale of 6/11, so the writer must convert PDF page coordinates to Goodnotes canvas coordinates by 11/6. The same notes document uniform ink as 0.5 PDF points per stored width unit, so a desired PDF-point width is encoded as twice that value.

Independent measurements of the original and Goodnotes-re-exported user samples support the quadratic node mapping used by the writer: each segment's control point is the midpoint of the previous endpoint and current endpoint, and the segment endpoint is the current sample. Across 131,946 segments, the midpoint residual had a median of 0.0156 and a 95th percentile of 0.0221 canvas units (consistent with the stored coordinate precision). The rebuild now emits a move node followed by these quadratic segments, converts coordinates by 11/6 and scales uniform width by 2. This is covered by a golden TPL geometry test.

The inspected original and re-exported samples all use this uniform signature. This does not establish the format for every Goodnotes pen, pencil, marker, highlighter, shape, image or Goodnotes version. The rebuild still preserves pressure/tilt in its own vector model, but the current native writer uses the observed uniform-width form and does not yet serialize per-point pressure or pencil tilt.


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

The user confirmed that the fixture-derived experimental one-page archive imported into Goodnotes without an error. Important qualification: that candidate adapted the supplied fixture's event/page identifiers and background attachment. It proves minimal package acceptance, not that the current clean serializer works from scratch.

## Rebuild writer now in the repository

The experimental serializer is implemented in src/export/goodnotes.ts and exposed as “Goodnotes · experimental” in the export row.

It:
1. uses a sanitized event-record template derived from the one-page experimental archive;
2. generates fresh document, attachment, page, event and stroke UUIDs;
3. writes a separate background PDF attachment containing the composed pages;
4. creates page index entries and one notes/<UUID> object stream per composed page;
5. serializes each placed ink stroke as a protobuf object with Apple-framed LZ4 and a TPL path, including the measured canvas scale, uniform-width mapping and quadratic segment nodes;
6. writes RGBA colour metadata, a page thumbnail in the browser, schema metadata and a ZIP container;
7. repeats the page-event group and PDF page ordering key for each composed page.

This is a repeatable implementation, but it is still experimental. Current limitations:
- The current writer supports only the observed uniform-width TPL form. It does not preserve per-point pressure/tilt or reproduce the target's distinct pen/pencil/marker/highlighter engines.
- Marker/highlighter semantics and brush metadata remain unverified; the inspected user samples did not contain a highlighter-specific record.
- Photos, text boxes, lasso transformations, partial erasure and arbitrary editor objects are not represented because the rebuild editor is not implemented.
- The event template is based on one observed document/page event sequence. It is not an official Goodnotes schema and may vary across app versions.
- The browser-generated file has not yet been imported into Goodnotes from the current repository code. CI checks archive structure, page events, PDF attachment, thumbnail, TPL framing, canvas scaling and quadratic geometry; a short-lived CI smoke-test artifact is generated for the real-app import test.
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
- Public parser documentation and format notes: https://pypi.org/project/goodparse/
- Independent parser source candidate: https://github.com/Kaih1825/parser-for-goodnotes
