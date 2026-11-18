# REA workflow and state map

Classification: **Observed** means described or exposed by first-party GPTGenie UI/docs; **inferred** means a likely transition not exercised; **unknown** means no live runtime evidence.

## A. Build a handwriting library

| Initial state | Action | Target result | Evidence / status |
|---|---|---|---|
| App opened | Choose language/script | Character grid and progress for that set | Observed in app index and guide |
| Character selected | Draw with mouse, finger or stylus | Pressure-aware stroke sample | Observed in first-party docs; live input states unknown |
| Character has a sample | Draw another version and save | Multiple variants retained and count shown | Observed in FAQ/news |
| Character saved | Reopen saved variant | Edit or erase portions; replace or add version | Observed in 6 Oct changelog; rebuild currently loads first variant only |
| Script incomplete | Start Fast Scan | Sequential guided drawing with faint template | Observed in docs/news; exact empty/error states unknown |
| Some characters missing | Start missing-only scan | Only missing glyphs queued; progress and resume | Observed in FAQ/guide; rebuild queue recently corrected, browser QA pending |
| Custom symbol needed | Add it under “Sonstiges” | New character can be drawn and used | Observed in 12 Oct changelog; rebuild has no dedicated custom-symbol manager |

## B. Compose and generate a note

| Initial state | Action | Target result | Evidence / status |
|---|---|---|---|
| Text step | Enter text and line breaks | Multiline document | Observed |
| Text contains missing glyphs | Generate | Missing list; user may draw or continue with blank positions | Observed in guide/FAQ |
| Text contains markup | Use **bold**, ==highlight== or ==colour:text== | Bold/marker formatting | Observed in guide; rebuild not implemented |
| Text contains maths | Enter 3/4, x^2, sqrt(x) | Handwritten fraction, superscript and root | Observed in changelog; rebuild currently has inline normalization only |
| Choose paper | Select blank/lined/grid/dotted/colour/custom image | Page background updated | Observed |
| Adjust settings | Change size, spacing, irregularity, margins, slant and snapping | Live preview updates and settings auto-save | Observed |
| Generate | Compose one or more pages | Page count, rendered output and download become available | Observed; rebuild preview is currently a text mock, not the actual page scene |

## C. Edit generated pages

Target UI exposes: Select, Area/Lasso, Text, Pen, Marker, Eraser and Photo. Selection supports move, resize, duplicate, cut, copy, paste and delete; inspector exposes colour and position/size. Page controls include add page, page background, zoom and page navigation. Keyboard shortcuts include V/L/T/B/H/E, undo/redo, clipboard, duplicate, delete, page up/down, zoom and pan.

These are **observed target affordances**, but gesture details, hit testing, z-order, selection rules, undo transactions, error states and persistence transitions are **unknown** until exercised in the live app. The rebuild currently has no generated-page editor.

## D. Export and local data

| Initial state | Action | Target result | Evidence / status |
|---|---|---|---|
| Generated pages ready | Download PDF | Multipage PDF | Observed |
| Generated pages ready | Choose native notebook format | App-native editable ink objects, paper retained separately | Observed in first-party export guides/changelog |
| Exported native file | Import in destination app | Native page accepted and strokes editable | Goodnotes minimal experimental candidate: user-confirmed import without error; object-level editability unknown |
| Guest/local workspace | Save glyphs/settings | Browser-local persistence | Observed in product docs; exact storage schema unknown |
| Workspace | Export/restore backup | Full user data recoverable | Rebuild feature; atomicity/integrity/recovery tests pending |
| App installed and cached | Work offline | Drawing, composition and export work without network | Observed in changelog; rebuild PWA runtime test pending |

## State coverage still required

For each screen and action, test: loading, empty, normal success, validation failure, storage quota failure, malformed backup, unsupported glyph, export failure, denied/unsupported file picker, offline reload, mobile orientation, tablet stylus and permission/device states. Do not mark a state passed without an observation.
