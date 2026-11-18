# GPTGenie

A local-first handwriting studio for turning text into personalised handwritten PDFs, with Goodnotes-friendly export.

## Principles

- No backend, accounts, telemetry, or API keys.
- Documents, settings, and handwriting samples are stored in browser IndexedDB.
- Export a portable JSON workspace backup and restore it on another device.
- Generate PDF locally; import the resulting PDF into Goodnotes, Notability, or another PDF notebook.
- Works offline after the app's assets have loaded (PWA/offline caching is a planned enhancement).

## Stack

- React + TypeScript + Vite
- IndexedDB for local persistence
- pdf-lib for client-side PDF creation
- Canvas Pointer Events for mouse, touch, and stylus handwriting capture

## Run

```bash
pnpm install
pnpm dev
```

Build with `pnpm build`.

## Current scope

The editor, local document library, character sample capture, PDF page templates (A4/Letter/A5, lined/blank/grid/dotted), and JSON backup/restore are implemented. Saved character samples are composited into PDF exports where a matching character is available; untrained characters use a standard fallback font.

## Data portability

Use **Settings & backup → Export complete backup** to download one JSON file containing settings, documents, and handwriting PNG samples. Restore it in another browser using the same panel. Browser storage is local to the browser profile and can be cleared by browser settings; keep backups for safekeeping.

## Goodnotes

The app exports standards-based PDF documents, not a proprietary Goodnotes package. Import the PDF into Goodnotes to annotate it with native Goodnotes tools. PDF exports preserve layout and rasterised custom glyphs; PDF text is not a fully editable Goodnotes text object.

## Privacy

All workspace content and PDF generation remain in the browser. The Google Fonts import is optional visual styling and may contact Google's font CDN; system font fallbacks are provided. For a strict network-free deployment, replace the font import with locally bundled fonts.
