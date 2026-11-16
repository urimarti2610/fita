# LibreOffice Writer extension

A LibreOffice extension (`.oxt`) that gently emphasizes the start of each word in Writer documents. Pure Python (Python-UNO), no dependencies beyond the Python that ships with LibreOffice 7.0 or later.

A new menu appears in Writer's menu bar with:

- **Emphasize document**, **Emphasize selection**, **Remove emphasis**;
- **Style: bold / colour / underline**;
- **Strength: lighter / medium / stronger**.

Menus and messages are in English, Spanish and Catalan, following LibreOffice's interface language. Every action is one step in Writer's undo history (Ctrl+Z).

## How it works

- Emphasis is a **character style** called "fita emphasis" (the name comes from the project's brand configuration). Only the start of each word gets that style; the text and your own formatting never change, so screen readers read it exactly as before.
- **Remove emphasis** resets exactly those characters and deletes the style. Text that already had another character style is left alone.
- **Style** changes the character style itself, so all emphasis in the document switches at once. You can also edit "fita emphasis" yourself in the Styles sidebar (F11) to pick your own colour or weight.
- Paragraphs in the body and in tables are processed. Words are measured across formatting changes and bookmarks inside them; fields and footnote anchors are skipped.
- Settings (strength and style) are saved in a small JSON file in your LibreOffice user profile. Nothing is sent anywhere: the extension makes no network requests.

## The algorithm in Python

[`extension/pythonpath/wordanchor/emphasis.py`](extension/pythonpath/wordanchor/emphasis.py) is a port of [`packages/core/src/emphasize.ts`](../../packages/core/src/emphasize.ts). LibreOffice's Python has no ICU bindings, so word and grapheme boundaries are approximated with `unicodedata` (see the module docstring). Parity is checked automatically:

- [`tests/cases.json`](tests/cases.json) holds the TypeScript core's output for ~55 inputs (Spanish, Catalan, English, Russian, Polish, Greek, Arabic, Hebrew, Chinese, Japanese, Thai, emojis, numbers, URLs, code…);
- `tests/parity.test.ts` (Vitest) fails if the core's output no longer matches the file;
- `tests/test_emphasis.py` (unittest) fails if the Python port differs from it.

After changing the core on purpose: `UPDATE_CASES=1 pnpm --filter @fita/libreoffice-extension test`, then fix the port until the Python tests pass.

## Build and test

Requires Python 3.8+ (standard library only) and, for the parity check, Node with the workspace installed.

```sh
pnpm --filter @fita/libreoffice-extension test    # Vitest parity check + Python unittest
pnpm --filter @fita/libreoffice-extension build   # dist/fita-libreoffice-<version>.oxt
# or, Python only:
python3 -m unittest discover -s tests
python3 scripts/build.py
```

The build generates `description.xml`, `Addons.xcu` (menus, with every translation from [`wordanchor/i18n.py`](extension/pythonpath/wordanchor/i18n.py)), `META-INF/manifest.xml` and `wordanchor/brand.py` (from `packages/core/src/brand.ts`), and adds `LICENSE`, `NOTICE` and the icon. The archive is reproducible: the same sources give the same bytes.

## Install

**Tools → Extension Manager → Add…**, choose the `.oxt`, then restart LibreOffice. Or from a terminal: `unopkg add dist/fita-libreoffice-<version>.oxt`.

The `.oxt` is attached to each GitHub release. Publishing on extensions.libreoffice.org is a manual step for the project owner.

## To add a language

Copy the `"en"` block in [`wordanchor/i18n.py`](extension/pythonpath/wordanchor/i18n.py), translate it under the new language code and rebuild.
