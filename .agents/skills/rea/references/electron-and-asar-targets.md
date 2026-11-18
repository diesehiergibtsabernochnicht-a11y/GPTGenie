# Electron and asar targets

Depth for the shipped-app steps: how a shipped Electron app is laid out, how to reach its payload, and
how to tell readable code from ciphertext.

## Layout of an installed app

```
<App>/
  <App>.exe              launcher stub: imports node.dll, a few hundred functions
  *.pak, icudtl.dat      Chromium resources
  resources/
    app.asar / app.asarx         Electron bootstrap + preload/bridge code
    resources.asar / .asarx      the actual product (UI windows, main logic, assets)
    app.unpacked/<module>/*.node native addons, loaded only if listed
  utils/, config/         vendor data: rule DBs, engines, settings
  config.ini              endpoints, auto-run flags, update channel
```

`.asarx` is a rename, not a format. Copy it to `*.asar` and extract:

```bash
npx --yes @electron/asar extract app.asar app_out
find app_out -maxdepth 2 -type d | sort
```

A successful extract proves nothing about readability — check the files next.

## Readable or encrypted?

Sample the first ~400 bytes of every code file and count printable bytes:

```python
printable = sum(1 for c in head if 32 <= c < 127 or c in (9, 10, 13))
readable = printable / max(1, len(head)) > 0.9
```

Typical outcome on a protected build: every `.js/.html/.json` fails and only `.css`, `.png` and fonts
pass. That is deliberate payload encryption, not corruption — CSS and images stay clear because the
renderer needs them as files.

Do not attempt to "un-minify" ciphertext, and do not accept a plan that depends on reading those
bundles. Pivot to the non-code evidence.

## What the file names still tell you

Window and script names survive because the loader needs them as paths:

| Name | Usually means |
|---|---|
| `index.html`, `rightDetail`, `rightSetting` | main window plus secondary panels |
| `background/scan.js`, `bgmanager.js` | scanner and background scheduler |
| `UninstallApp/` | installed-software list and uninstaller |
| `talkPop`, `OwnPop`, `lockscreen.js` | promotional popups / takeover screens — adware signal |
| `time.html`, `speed.html` | countdown or results-gauge screens |
| `utils/*Pri*.dll`, `*WX*.dll` | privacy and messaging-app cleaning variants |

Asset directories (`assets-Index`, `assets-rightDetail`, …) mirror the window list, so the window
inventory doubles as a screen inventory.

## Signals that decide the recommendation

Collect these before proposing a rebuild; each one changes what you advise:

- **Signing certificate subject** — who ships it and from where, and whether it is signed at all.
- **PDB path in the image** (`D:\Jenkins\...\<project>.pdb`) — build system and project name.
- **`app.unpacked` native modules** — `iohook` is a global keyboard hook; `ffi-napi` with
  `ref-napi` means arbitrary Win32 calls; `7zip-bin` means archive handling.
- **`config.ini` endpoints** — a CDN path ending in an opaque extension plus `auto_run=1` means the
  app fetches and executes code you cannot see.
- **Cached icon folders** — a populated `iconCache` proves the installed-program inventory is built
  and displayed.
- **`*_setup.log`** — the shipped file list in install order, including modules you would not
  otherwise look for.

## Rebuild checklist

- [ ] Feature map written with `replicate: yes|no` and the evidence behind each row
- [ ] Ad / remote-code / input-capture / region-locked features excluded, with reasons
- [ ] Divergence list numbered (what the rebuild does differently and why)
- [ ] Acceptance criteria each paired with a verification method that can run here
- [ ] Unknowns section: what the encryption hides and what would resolve it
- [ ] Original implementation, original assets or licensed ones only
