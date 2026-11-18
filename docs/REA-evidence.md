# REA evidence ledger

No REA capture engine or interactive browser automation was exposed. No synthetic evidence IDs or screenshot hashes are claimed.

| ID | Evidence | Finding | Classification | Limitation |
|---|---|---|---|---|
| E01 | Public app UI search result | 114 German characters, Fast Scan, text, settings, PDF editor | Observed | Indexed UI text, not live interaction |
| E02 | GPTGenie FAQ | Draw glyphs, variants, missing glyphs, Fast Scan, 50+ languages | Observed | First-party product description |
| E03 | GPTGenie news, 26 Oct 2026 | Native notebook exports, offline, variation, five pens, PWA, theme | Observed | First-party changelog |
| E04 | GPTGenie Goodnotes guide | Browser-side .goodnotes generation, independent strokes, page backgrounds, editor objects | Observed | Writer implementation not public |
| E05 | Goodnotes official help | .goodnotes import and native-only document export | Observed | Official support docs |
| E06 | parser-for-goodnotes source/wiki | ZIP, length-delimited protobuf, Apple framed LZ4, TPL stroke geometry | Source candidate | Parser supports reading/export, not native archive authoring |
| E07 | Current repository source | React/Vite app, vector glyph capture, IndexedDB, text composition, PDF and JSON backup | Observed | Direct source inspection; runtime build still unverified |
| E08 | Runtime interaction, screenshots, storage and network traces | Loading/error/gesture details | Unknown | Interactive browser unavailable |
| E09 | User-supplied GPTGenie .goodnotes export and Goodnotes re-export of its final page | 620 page records in both versions; 302/310 drawing payloads identical; 8 rewritten by Goodnotes; background PDF identical | Observed | Two-file sample only; no independently generated writer tested |

