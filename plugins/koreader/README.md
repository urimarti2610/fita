# fita for KOReader

A [KOReader](https://koreader.rocks) plugin that adds _anchor points_ to your books: the start of each word is emphasized to guide your eyes. Everything runs on your e-reader; nothing is sent anywhere.

## How it works, honestly

KOReader's rendering engine (crengine) has no way to style "the first letters of each word": CSS cannot select them, and plugins cannot hook into how text is drawn. So the plugin **creates an emphasized copy of the book** and opens it:

- `Book.epub` → `Book.fita.epub`, next to the original. HTML stays HTML; TXT becomes HTML.
- The original is never modified. Delete the copy whenever you like.
- Want another strength or style? Change the settings and create the copy again. It always starts from the original, so emphasis never stacks.
- Your reading position, highlights and notes belong to each file, so the copy starts on its own page. Create the copy before you start a book.

The conversion runs in the background on the device, with a message you can tap to cancel. The emphasis markup is the same as on [fitaread.com](https://fitaread.com) and in the calibre plugin. A book you already converted there can be converted again here: the old emphasis is replaced, never added on top.

## Install

1. Download `fita-koreader-<version>.zip` from the [latest release](https://github.com/urimarti2610/fita/releases).
2. Unzip it into KOReader's `plugins` folder, so that you get `koreader/plugins/fita.koplugin/`. Where that folder is:
   - **Kobo:** `.adds/koreader/plugins/` on the e-reader's storage.
   - **Kindle:** `koreader/plugins/`.
   - **PocketBook:** `applications/koreader/plugins/`.
   - **Android:** `koreader/plugins/` in the device storage.
3. Restart KOReader.

Requires a recent KOReader (2024 or later; it uses KOReader's built-in zip support, `ffi/archiver`).

## Use

- **While reading:** top menu → **Typeset** (the document icon) → **Reading emphasis** → **Create a copy with emphasis**.
- **From the file browser:** long-press an EPUB, HTML or TXT file → **Create a copy with emphasis**.
- **Settings**, in the same menu:
  - **Strength:** how much of each word is emphasized (20–70 %).
  - **Style:** bold (the default), soft underline or colour. Colour shows as grey on e-ink screens.
  - **Emphasize one word in every N.**
  - **Open the copy when it is ready.**

Bold and underline use the `<b>` and `<u>` elements, so they show even with **Style tweaks → Ignore publisher styles** turned on. Colour needs the book's own styles. The web's "faded rest of the word" styles are not offered, because crengine cannot render transparency.

The interface is in English, Spanish and Catalan. It follows KOReader's language.

Books with DRM cannot be converted. The plugin says so and leaves them as they are.

## Develop

`fita.koplugin/fita_emphasis.lua` and `fita_markup.lua` are Lua ports of [`packages/core`](../../packages/core). They are pure Lua 5.1 / LuaJIT and do not depend on KOReader. Lua has no Unicode tables, so `fita_unicode.lua` is generated from the calibre plugin's Python engine. That way both ports classify characters the same way. Both are checked against the TypeScript core on the shared fixtures in [`plugins/fixtures/emphasis.json`](../fixtures/emphasis.json).

```sh
sudo apt-get install luajit                 # or lua5.1
luajit plugins/koreader/spec/run.lua        # tests, with KOReader stubbed out
python3 plugins/koreader/tools/gen_unicode.py   # regenerate fita_unicode.lua (Python 3.12)
python3 plugins/koreader/build.py           # plugins/koreader/dist/fita-koreader-<version>.zip
```

The tests use an in-memory zip in place of KOReader's libarchive, so the `ffi/archiver` backend is only exercised on a device. Before a release, check by hand in KOReader (the desktop emulator works too): convert an EPUB from the reader menu and from the file browser, cancel a conversion, change the style and convert again.
