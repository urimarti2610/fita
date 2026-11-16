# Roadmap (after v1)

Each item becomes a GitHub issue labelled `roadmap` once the repository exists.

| Issue title | Notes |
| --- | --- |
| Mobile app: next steps | The reader (`apps/mobile`, see [mobile.md](mobile.md)) exists. Pending: native Android "Share to", paginated mode, iOS project in CI, store listings. |
| Office add-ins: store listings | Publishing to Google Workspace Marketplace, AppSource and the LibreOffice extensions site is manual. |
| Font variants | Fita Sans ([`fonts/`](../fonts)) ships one strength and only bold; variants for other strengths, Greek/Cyrillic coverage. |

## Done

- **Word, LibreOffice and Google Docs add-ons** (#6): [`addons/`](../addons). The Word add-in loads `office.js` from Microsoft's CDN, as Office requires (accepted exception to the no-CDN rule).
- **Mobile app** (#1): [`apps/mobile`](../apps/mobile), a reader for Android and iOS (Capacitor) that also installs as a web app. See [mobile.md](mobile.md).
- **OpenType font with built-in emphasis** (#5): [`fonts/`](../fonts), Fita Sans.
- **Images in Markdown → EPUB** (#10): the converter accepts a folder or a `.zip` with the Markdown and its images.
- **DOCX and PDF conversion** (#4): Word documents in, emphasized Word documents out; PDFs reflowed into EPUB or HTML (layout not kept).
- **Line ruler / focus line** (#8): extension, "More options" → "Line ruler".
- **Read aloud** (#7): extension popup, on-device voices only.
- **Reading mode in the extension** (#9): extension, "More options" → "Reading mode".
- **Calibre plugin** (#2): [`plugins/calibre`](../plugins/calibre), a Python port of the core that adds emphasis to EPUB books in the library.
- **KOReader plugin** (#3): [`plugins/koreader`](../plugins/koreader), a Lua port of the core that creates an emphasized copy of EPUB, HTML and TXT files on the e-reader.
