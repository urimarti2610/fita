# Google Docs add-on

An Editor add-on for Google Docs that gently emphasizes the start of each word, with the same engine as the browser extension (`@fita/core`, bundled in).

- **Extensions → (add-on) → Emphasize document / Emphasize selection / Remove emphasis.**
- **Settings…** opens a sidebar with strength and style (bold, colour or underline).
- Interface in English, Spanish and Catalan, picked from your Google account language.

## How it works

- The add-on only changes character formatting (bold, foreground colour or underline) on the start of each word. The text itself is never changed, so screen readers read it exactly as before.
- It only adds formatting where there was none, and remembers what it changed with a named range. **Remove emphasis** undoes exactly that: your own bold, colours and underlines stay. Named ranges follow the text as you edit, and are invisible.
- Running **Emphasize document** again first removes the previous emphasis, so you can change strength or style at any time.
- Only the document body is processed (not headers, footers or footnotes).

## Privacy and permissions

Everything runs inside Google Docs, in Google's Apps Script runtime. The add-on makes no network requests, stores no data outside your Google account and has no analytics. It asks for the minimum OAuth scopes ([`appsscript.json`](appsscript.json)):

| Scope | Why |
| --- | --- |
| `documents.currentonly` | Read and format the open document only, never your other files. |
| `script.container.ui` | Show the menu and the sidebar. |

Your chosen strength and style are saved in your Apps Script user properties (part of your Google account).

## `Intl.Segmenter` in Apps Script

The core splits text into words and letters with `Intl.Segmenter`. Apps Script's V8 runtime is a recent V8, which includes it, but Google does not document which `Intl` features the runtime enables, and it cannot be checked from CI. So the add-on installs a small fallback ([`src/segmenter-fallback.ts`](src/segmenter-fallback.ts)) **only if** `Intl.Segmenter` is missing. The tests check that the fallback finds the same words, letters and emphasis as the real `Intl.Segmenter` on Spanish, Catalan, Polish, Russian, Greek, Arabic, Hebrew, numbers and emojis.

## Limits

There are no limits in the add-on itself. Google limits each Apps Script run to 6 minutes; very long documents (hundreds of pages) may hit that. In that case, emphasize the document in parts with **Emphasize selection**.

## Build and test

```sh
pnpm --filter @fita/google-docs-addon test    # unit tests, plus the built script run in a sandbox
pnpm --filter @fita/google-docs-addon build   # writes dist/Code.js and dist/appsscript.json
```

`dist/Code.js` is a single script: Apps Script has no modules, so the build bundles everything and declares the entry points (`onOpen`, `emphasizeDocument`, …) as top-level functions.

## Try it on your own documents (with clasp)

[clasp](https://github.com/google/clasp) is Google's command-line tool for Apps Script. It is not a dependency of this repository; install it only if you want to deploy.

1. Turn on the Apps Script API at <https://script.google.com/home/usersettings>.
2. Build: `pnpm --filter @fita/google-docs-addon build`.
3. In `addons/google-docs/`:

   ```sh
   npx @google/clasp login
   npx @google/clasp create --type standalone --title "fita" --rootDir dist
   # or copy .clasp.json.example to .clasp.json and paste an existing script ID
   npx @google/clasp push
   ```

   `clasp create` may write `.clasp.json` into `dist/`; move it next to this README and keep `"rootDir": "dist"` (`.clasp.json` is git-ignored).
4. Open the project (`npx @google/clasp open`), choose **Deploy → Test deployments → Editor add-on → Google Docs**, pick a test document and run it.

Without clasp you can also create a project at <https://script.google.com>, paste `dist/Code.js` into `Code.gs`, and replace the manifest with `dist/appsscript.json` (Project settings → "Show appsscript.json").

## Publishing

Publishing to the Google Workspace Marketplace is a manual step for the project owner (it needs a Google Cloud project, an OAuth consent screen and Google's review). Nothing in CI publishes it.
