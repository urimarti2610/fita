# Roadmap (after v1)

Each item becomes a GitHub issue labelled `roadmap` once the repository exists.

| Issue title | Notes |
| --- | --- |
| Mobile app | Android/iOS reader with the same emphasis engine (`@fita/core`). |
| Calibre plugin | Convert books inside Calibre; can reuse `createMarkupEmphasizer`. |
| KOReader plugin | Lua port of the algorithm or a CSS-based approach. |
| PDF conversion | PDF needs a different strategy (reflow to EPUB/HTML or overlay). |
| Word, LibreOffice and Google Docs add-ons | |
| Reading mode in the extension | Clean article view with `@mozilla/readability` (optional in v1, not built yet). |
| Font variants | Fita Sans ([`fonts/`](../fonts)) ships one strength and only bold; variants for other strengths, Greek/Cyrillic coverage. |

## Done

- **OpenType font with built-in emphasis** (#5): [`fonts/`](../fonts), Fita Sans.
- **Images in Markdown → EPUB** (#10): the converter accepts a folder or a `.zip` with the Markdown and its images.
- **DOCX conversion** (part of #4): Word documents in, emphasized Word documents out.
