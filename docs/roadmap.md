# Roadmap (after v1)

Each item becomes a GitHub issue labelled `roadmap` once the repository exists.

| Issue title | Notes |
| --- | --- |
| Mobile app | Android/iOS reader with the same emphasis engine (`@fita/core`). |
| KOReader plugin | Lua port of the algorithm or a CSS-based approach. |
| PDF conversion | PDF needs a different strategy (reflow to EPUB/HTML or overlay). |
| Word, LibreOffice and Google Docs add-ons | Google Docs add-on and LibreOffice Writer extension: built in [`addons/`](../addons). Word add-in: separate pull request, waiting for a decision on loading `office.js` from Microsoft's CDN (required by Office). Store publishing (Google Workspace Marketplace, LibreOffice extensions site) is manual. |
| Font variants | Fita Sans ([`fonts/`](../fonts)) ships one strength and only bold; variants for other strengths, Greek/Cyrillic coverage. |

## Done

- **OpenType font with built-in emphasis** (#5): [`fonts/`](../fonts), Fita Sans.
- **Images in Markdown → EPUB** (#10): the converter accepts a folder or a `.zip` with the Markdown and its images.
- **DOCX conversion** (part of #4): Word documents in, emphasized Word documents out.
- **Line ruler / focus line** (#8): extension, "More options" → "Line ruler".
- **Read aloud** (#7): extension popup, on-device voices only.
- **Reading mode in the extension** (#9): extension, "More options" → "Reading mode".
- **Calibre plugin** (#2): [`plugins/calibre`](../plugins/calibre), a Python port of the core that adds emphasis to EPUB books in the library.
