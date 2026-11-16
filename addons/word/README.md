# Word add-in

An Office add-in (task pane) for Microsoft Word that gently emphasizes the start of each word, with the same engine as the browser extension (`@fita/core`, bundled in).

- **Emphasize document**, **Emphasize selection**, **Remove emphasis**.
- Strength slider and style (bold, colour, underline).
- Interface in English, Spanish and Catalan, following Office's display language.
- Needs WordApi 1.5: Word 2021 or later, Microsoft 365 (Windows, Mac) or Word on the web.

## Decision needed: `office.js` from Microsoft's CDN

The project's rules say: no scripts from external CDNs, everything bundled. **Office add-ins cannot follow that rule.** Microsoft requires every add-in to load the Office host API from its own CDN:

```html
<script src="https://appsforoffice.microsoft.com/lib/1/hosted/office.js"></script>
```

`office.js` is not analytics or tracking: it is the bridge between the task pane and Word, and Office will not run an add-in with a bundled copy (AppSource validation rejects it too). It does mean that opening the task pane makes a request to a Microsoft server, from inside Word, which is a Microsoft product anyway. The add-in's own code (`taskpane.js`, CSS, icons) is served from the project's website and makes no other requests.

This add-in is therefore kept in its own pull request, **not merged**, until the project owner decides whether to accept this platform requirement.

## How it works

- Emphasis is a **character style** ("fita emphasis"). The start of each word gets the style; the text and the author's formatting are not changed, so screen readers read the document as before.
- Word's API has no character offsets, so each word range is found with `getTextRanges([" "])` and its emphasized start with `range.search()` (the n-th match, computed in [`src/plan.ts`](src/plan.ts)).
- **Remove emphasis** deletes the style: Word returns its text to the default character formatting.
- Paragraphs are processed in batches of 100 per round trip, with progress shown in the pane, so long documents don't exhaust memory. There are no limits in the add-in.
- Settings (strength, style) are kept in the task pane's `localStorage` on this device. No cookies, no analytics.

## Hosting

The task pane is static files, served from the project's GitHub Pages site at `https://fitaread.com/addins/word/` (the website build copies `dist/` there). `manifest.xml` points Word to `taskpane.html` at that address.

## Build and test

```sh
pnpm --filter @fita/word-addin test    # unit tests (search plan, manifest, i18n, Word API logic with fakes)
pnpm --filter @fita/word-addin build   # dist/: taskpane.html/js/css, icons, manifest.xml
```

## Try it (sideloading)

- **Word on the web:** open a document, **Home → Add-ins → More add-ins → My add-ins → Upload my add-in**, and choose `dist/manifest.xml`.
- **Word on Windows / Mac:** see Microsoft's guide "Sideload Office Add-ins for testing" (shared folder catalog on Windows, the `wef` folder on Mac).

Until the task pane is deployed to the website, sideloading needs it served over HTTPS from somewhere you control.

## Publishing

Publishing on Microsoft AppSource is a manual step for the project owner (Partner Center account and Microsoft's validation). Nothing in CI publishes it.
