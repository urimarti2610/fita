# fita for calibre

A [calibre](https://calibre-ebook.com) plugin that adds _anchor points_ to your EPUB books: it gently emphasizes the start of each word to guide your eyes. Everything runs on your computer; nothing is sent anywhere.

It produces the same result as the converter on [fitaread.com](https://fitaread.com): same algorithm, same markup (`<span class="fita-e">`) and the same e-reader-safe stylesheet. Five styles: bold start with the rest faded (default), bold, colour, soft underline, or fading the rest of the word.

## Install

1. Download `fita-calibre-<version>.zip` from the [latest release](https://github.com/urimarti2610/fita/releases) (or build it, see below). Do not unzip it.
2. In calibre: **Preferences → Plugins → Load plugin from file**, choose the zip and confirm.
3. Restart calibre. If the **Reading emphasis** button is not on the toolbar, add it in **Preferences → Toolbars & menus**.

Requires calibre 6 or later. The interface is in English, Spanish and Catalan (it follows calibre's language).

## Use

1. Select one or more books that have an EPUB format (convert other formats to EPUB with calibre first).
2. Click **Reading emphasis** (or open its menu and choose **Add reading emphasis**). The books are converted in the background; follow progress or cancel in calibre's **Jobs** list.
3. Send the book to your e-reader as usual.

- The first time, calibre keeps the untouched book as the `ORIGINAL_EPUB` format, as it does for **Polish books**.
- Converting again (for example with another strength or style) replaces the previous emphasis; it never stacks.
- **Remove reading emphasis** returns the EPUB to plain text. It also removes emphasis added by the fitaread.com converter.
- **Settings…**: strength (20–70 % of each word), style, and emphasizing one word in every N. A live preview shows the result.
- Books with DRM cannot be converted; the plugin tells you which ones and leaves them untouched.

Some e-readers ignore the book's own styles when "publisher styles" are turned off. If you see no emphasis, turn them back on.

## How it works

`plugin/engine/` is a faithful Python port of [`packages/core`](../../packages/core) (`emphasize.ts` and `markup.ts`) with no dependency on calibre, so it can be tested with plain Python. The TypeScript core uses the browser's `Intl.Segmenter`; Python's standard library has no Unicode segmentation and calibre plugins cannot rely on extra modules, so the engine implements the parts of the Unicode rules (UAX #29) it needs with `unicodedata`:

- **Words:** letters and digits join; apostrophes, middle dots (`l·l`) and periods join letters; commas and periods join digits; combining marks and invisible format characters (soft hyphens) stay inside the word.
- **Graphemes:** combining marks, emoji joiners and modifiers, flags, Hangul jamo and Indic conjuncts are never split.

The port is checked against the TypeScript core on shared fixtures (`plugins/fixtures/emphasis.json`, regenerated with `UPDATE_FIXTURES=1 pnpm test:core`).

Known differences with the browser: scripts written without spaces (Chinese, Japanese, Thai, Lao, Khmer, Myanmar) are not split into dictionary words, which does not matter because they are left untouched anyway; Unicode data comes from calibre's Python version.

Speed is about 2 seconds per megabyte of text, one chapter in memory at a time.

## Develop

```sh
python3 -m unittest discover -s plugins/calibre/tests   # tests (no calibre needed)
python3 plugins/calibre/build.py                        # builds plugins/calibre/dist/fita-calibre-<version>.zip
calibre-customize -a plugins/calibre/dist/fita-calibre-*.zip   # install into a local calibre
calibre-debug -g                                        # run calibre with debug output
```

`build.py` uses only the standard library: it compiles `plugin/translations/*.po` to `.mo`, fails if a user-facing string has no translation, and checks that the import name matches `plugin/engine/brand.py`.

To add a language, copy `plugin/translations/es.po` to `<lang>.po` and translate the `msgstr` lines.

Before a release, check by hand in a real calibre: install the zip, convert a book, change settings, convert again, remove emphasis, and open the result in calibre's viewer.
