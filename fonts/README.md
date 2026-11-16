# Fita Sans: a font with built-in word-start emphasis

Fita Sans is a reading font that draws the first letters of each word in bold, by itself.
Install it, pick it in your app or e-reader, and any text gets the same kind of emphasis
anchors that the fita extension adds to web pages, with no extension, conversion or internet
connection.

The text itself never changes. The font uses an OpenType feature (`calt`, contextual
alternates) to swap the glyphs while it draws them: copying, searching, spell-checking and
screen readers see exactly the same characters as before.

It is a modified version of [Atkinson Hyperlegible Next](https://github.com/googlefonts/atkinson-hyperlegible-next)
(Regular and Bold), designed by Applied Design Works and Letters from Sweden for the Braille
Institute to keep every letter easy to tell apart. As the licence requires, the modified font
has its own name.

> Like the rest of fita, it is a reading aid, not a promise to read faster: it is meant to
> make reading more comfortable, your way. If it does not help you, simply use another font.

## Download

- **Releases:** each [GitHub release](https://github.com/urimarti2610/fita/releases) includes
  `fita-sans-<version>.zip` with `FitaSans-Regular.ttf` (desktop and e-readers),
  `FitaSans-Regular.woff2` (websites) and the licence.
- **Build it yourself:** see [Building](#building).

## Where it works

The emphasis appears only where the app applies OpenType contextual alternates. Most modern
text engines (HarfBuzz, Core Text, DirectWrite) do so by default.

| Where | Works? | Notes |
| --- | --- | --- |
| Browsers (Chrome, Edge, Firefox, Safari) | Yes | On by default. Use it with `@font-face` or as your browser's default font. |
| LibreOffice | Yes | On by default. |
| Apple apps (Pages, TextEdit, Books on Mac) | Yes | On by default. |
| Microsoft Word | After a setting | *Font › Advanced › OpenType Features › Use Contextual Alternates*. |
| KOReader | After a setting | Set *Font › Font kerning* to *best (HarfBuzz)*. |
| Kobo, Kindle, PocketBook built-in readers | Not verified | Their rendering engines may ignore OpenType features. If you see no bold starts, use KOReader or the [book converter](https://fitaread.com/en/). |
| Google Docs | No | It cannot use fonts installed on your computer. |

We have tested the font with HarfBuzz, the engine used by Chrome, Firefox, LibreOffice and
KOReader. Reports from other apps and devices are very welcome: please
[open an issue](https://github.com/urimarti2610/fita/issues/new/choose).

## Install

### Computer

- **Windows:** right-click `FitaSans-Regular.ttf` › *Install* (or *Install for all users*).
- **macOS:** double-click the file and click *Install* in Font Book.
- **Linux:** copy it to `~/.local/share/fonts/` and run `fc-cache -f`.

Then choose **Fita Sans** in your app's font menu.

### E-readers (side-loading)

Connect the e-reader to your computer by USB and copy `FitaSans-Regular.ttf`:

- **KOReader** (on Kobo, PocketBook, Kindle or Android): into the `fonts/` folder of KOReader
  (on Kobo: `.adds/koreader/fonts/`). Then open a book, choose *Font › Fita Sans*, and set
  *Font kerning* to *best (HarfBuzz)*.
- **Kobo** (built-in reader): into a folder named `fonts` at the root of the device. Eject it,
  open a book and pick the font in *Aa › Font face*.
- **Kindle** (recent firmware): into the `fonts` folder that appears when you connect it.
  Pick the font in *Aa › Font › Font family*.
- **PocketBook:** into `system/fonts/`.

If the built-in reader shows the font without bold starts, it does not support the feature;
KOReader does, and the web converter at [fitaread.com](https://fitaread.com/en/) works with
any reader because it changes the book instead of the font.

### Websites

```css
@font-face {
  font-family: "Fita Sans";
  src: url("FitaSans-Regular.woff2") format("woff2");
  font-display: swap;
}
body { font-family: "Fita Sans", system-ui, sans-serif; }
/* Optional: turn the emphasis off for a part of the page. */
.no-emphasis { font-feature-settings: "calt" 0; }
```

Serve the file from your own site; the licence allows it (see [Licence](#licence)).

## How close is it to the fita extension?

A font cannot run code, so the emphasis is written as a fixed list of OpenType rules. They
follow the same algorithm as [`packages/core`](../packages/core/src/emphasize.ts) with its
default settings (strength 0.45, short words get one letter), and the tests check it word
length by word length:

| Word length | 1–3 | 4–5 | 6–7 | 8–9 | 10–12 | 13–14 | 15–16 | … | 30+ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Bold letters | 1 | 2 | 3 | 4 | 5 | 6 | 7 | ≈45 % | 14 |

Also like the extension:

- a word is a run of letters; apostrophes and the Catalan middle dot inside a word keep it
  together (*don't*, *col·lecció*); spaces, hyphens and other punctuation separate words;
- after a short elided article the emphasis goes on the main word (*l'**àv**ia*, *d'**u**na*);
- words with digits stay plain (*3rd*, *mp3*, *1984*);
- accented letters count as one letter, whether precomposed or written with combining marks.

Where it differs:

- **Fixed settings.** Strength, "1 of every N words" and the emphasis style (always bold) cannot
  be changed. A future version could ship variants.
- **Very long words.** Words longer than 30 letters get 14 bold letters.
- **No context.** URLs, e-mail addresses, file paths and code are emphasized like ordinary
  words; the extension leaves them alone.
- **Closing apostrophes** right after a word count as part of it (*readers'*), so such a word may
  get one extra bold letter.
- **Scripts.** The base font covers Latin (with its accents and extensions for Western,
  Central and Eastern European languages, Turkish, Vietnamese and more). It has no Greek or
  Cyrillic letters, so those texts fall back to another font, without emphasis.
- **Unhinted.** The bold letters come from another font, so the build drops TrueType hinting.
  Modern screens render it smoothly; very old Windows setups without font smoothing may show
  it less crisp at small sizes.

## Building

Requires Python 3.10 or newer.

```sh
python -m venv .venv && . .venv/bin/activate
pip install -r fonts/requirements.txt
python fonts/build.py            # writes fonts/dist/FitaSans-Regular.{ttf,woff2,fea}
python -m unittest discover -s fonts/tests
```

Open [`demo.html`](demo.html) in a browser after building to try it, with a switch to compare
with the plain font.

How the build works (`build.py`):

1. Copies every letter of the Bold font into the Regular font as `<letter>.emph`, with its
   outline, width, accent anchors and kerning classes.
2. Generates the `calt` rules (saved as `dist/FitaSans-Regular.fea` for reading) and compiles
   them with fontTools.
3. Renames the font after the central brand name in
   [`packages/core/src/brand.ts`](../packages/core/src/brand.ts) and writes TTF and WOFF2.

The source fonts are vendored in [`src/`](src) (Atkinson Hyperlegible Next 2.001, from
[googlefonts/atkinson-hyperlegible-next](https://github.com/googlefonts/atkinson-hyperlegible-next)
at commit `7925f50`), so the build needs no network:

| File | SHA-256 |
| --- | --- |
| `AtkinsonHyperlegibleNext-Regular.ttf` | `88ed5c31a71584c7772963b02d04bef1eb7e3d2e9c8b9cb204339b1f82cf432c` |
| `AtkinsonHyperlegibleNext-Bold.ttf` | `994414047df66bb4998d01c1cb1eeb4a2ddc4622d1aa56bbb8adbeca7645b041` |

## Licence

The font (both the vendored originals and Fita Sans) is licensed under the
[SIL Open Font License 1.1](OFL.txt): free to use, study, modify and redistribute, including
embedding it in websites, documents and apps. It cannot be sold on its own, and modified
versions must use a different name. The build script and tests are under the repository's
[Apache 2.0](../LICENSE) licence.

## Legal note

There is a French patent, FR 3 052 587, about this kind of word emphasis. Whether it affects
distributing this font in France is an open question that the project has not yet resolved
with legal advice (the same question is open for the rest of fita). The font is provided as
is, without warranty, as the licence states.
