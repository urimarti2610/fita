# fita

**Free, open-source reading aids for people with ADHD and dyslexia.** Website: [fitaread.com](https://fitaread.com)

fita adds _anchor points_ to text: it gently emphasizes the beginning of each word to guide your eyes. It works where you already read — on the web and in your ebooks — and everything runs on your device.

> We don't promise faster reading. Research does not show an average speed gain. We aim for reading that is **more comfortable, your way**.

## What's in this repository

| Path                               | What it is                                                                                       |
| ---------------------------------- | ------------------------------------------------------------------------------------------------ |
| [`packages/core`](packages/core)   | TypeScript library that decides which part of each word to emphasize, and applies it to the DOM. |
| [`apps/extension`](apps/extension) | Browser extension (Chrome, Edge, Firefox — including Firefox for Android).                       |
| [`apps/web`](apps/web)             | Static website ([fitaread.com](https://fitaread.com)) in 27 languages: live demo, reading worksheets and an in-browser ebook converter. |

## Languages

The website, the extension and the reading worksheets are available in 27 languages: Basque, Bulgarian, Catalan, Croatian, Czech, Danish, Dutch, English, Estonian, Finnish, French, Galician, German, Greek, Hungarian, Irish, Italian, Latvian, Lithuanian, Maltese, Polish, Portuguese, Romanian, Slovak, Slovenian, Spanish and Swedish. Emphasis itself works on text in any language with spaces between words.

Many translations were drafted with AI help and still need a native speaker's review (Irish and Maltese especially). Corrections are very welcome: open an issue or a pull request.

To add or fix a language, edit:

- `apps/web/src/locales/<lang>.ts`: website text and page URLs (the shape is defined by `es.ts`);
- `apps/web/src/worksheet/texts/<lang>/README.md`: children's reading texts for the worksheets;
- `apps/extension/src/locales/<lang>.json`: extension text (same keys as `en.json`);

then register the code in `apps/web/src/i18n.ts` and `apps/extension/src/build-data.ts`.

## Principles

- **Everything on the client.** No servers, accounts or APIs. Your files never leave your device.
- **No limits.** No word, size or usage caps, no paid features. Only your device's memory.
- **Total privacy.** No analytics, cookies or telemetry. See [PRIVACY.md](PRIVACY.md).
- **Several emphasis styles**: bold start with the rest faded (default), bold, colour, soft underline, or fading the rest of the word.
- **Accessible**: screen readers read the text exactly as before; keyboard-only use; dark mode.

## Development

Requires Node 22 and pnpm 10.

```sh
pnpm install
pnpm lint        # Biome
pnpm typecheck
pnpm test        # Vitest
pnpm build
pnpm e2e         # Playwright
```

Per package: `pnpm dev:web` (local website at http://localhost:4321), `pnpm preview:web`, `pnpm build:extension` (outputs `apps/extension/dist/`), and `test:*`, `build:*`, `e2e:*` for `core`, `extension` and `web`.

Brand images (social preview, favicon, extension icons) are rendered from the wordmark with `node apps/web/scripts/og-image.mjs`; the outputs are committed.

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[Mozilla Public License 2.0](LICENSE).

---

## En español

**fita** ([fitaread.com](https://fitaread.com)) son ayudas de lectura libres y gratuitas para personas con TDAH y dislexia. Destaca suavemente el inicio de cada palabra (puntos de anclaje) para guiar la vista, en la web y en tus ebooks. Todo funciona en tu dispositivo: sin cuentas, sin límites y sin recoger ningún dato. Disponible en 27 idiomas europeos. No prometemos leer más rápido, sino leer más cómodo, a tu manera.

## En català

**fita** ([fitaread.com](https://fitaread.com)) són ajudes de lectura lliures i gratuïtes per a persones amb TDAH i dislèxia. Destaca suaument l'inici de cada paraula (punts d'ancoratge) per guiar la vista, al web i als teus llibres electrònics. Tot funciona al teu dispositiu: sense comptes, sense límits i sense recollir cap dada. Disponible en 27 llengües europees. No prometem llegir més ràpid, sinó llegir més còmode, a la teva manera.
