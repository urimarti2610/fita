# Roadmap (after v1)

Each item becomes a GitHub issue labelled `roadmap` once the repository exists.

| Issue title | Notes |
| --- | --- |
| Mobile app | Android/iOS reader with the same emphasis engine (`@fita/core`). |
| Calibre plugin | Convert books inside Calibre; can reuse `createMarkupEmphasizer`. |
| KOReader plugin | Lua port of the algorithm or a CSS-based approach. |
| DOCX and PDF conversion | DOCX is XML in a zip, close to EPUB. PDF needs a different strategy (reflow or overlay). |
| OpenType font with built-in emphasis | Contextual alternates to emphasize word starts without changing the text. |
| Word, LibreOffice and Google Docs add-ons | |
| Read aloud | Text-to-speech with the browser's own voices (no servers). |
| Line ruler / focus line | Highlight the current line while reading. |
| Reading mode in the extension | Clean article view with `@mozilla/readability` (optional in v1, not built yet). |
| Images in Markdown → EPUB | Relative images cannot be bundled from a single `.md` file; accept a folder or zip. |
