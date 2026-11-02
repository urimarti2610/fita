# Chrome Web Store submission

Everything needed to publish the extension on the [Chrome Web Store](https://chrome.google.com/webstore/devconsole). The same package and texts also work for [Edge Add-ons](https://partner.microsoft.com/dashboard/microsoftedge).

## 1. Build the package

```sh
pnpm build:extension
# → apps/extension/dist/fita-chrome-<version>.zip
```

Bump `version` in `apps/extension/package.json` for every new upload: the store rejects a version it has already seen.

## 2. Create the developer account (once)

1. Open the [Developer Dashboard](https://chrome.google.com/webstore/devconsole) with the Google account that will own the extension.
2. Pay the one-time registration fee (US$5) and verify the contact email.
3. Set the publisher name (for example "fita") in **Account**.

## 3. Upload and fill in the listing

**Items → New item → upload the zip.** Then:

### Store listing tab

| Field | Value |
| --- | --- |
| Description, summary | [`listing.md`](listing.md): one block per language. Add the language under **Store listing → Language**, then paste. |
| Category | Accessibility |
| Language | Spanish (default), plus Catalan and English |
| Store icon | `store-icon-128.png` |
| Screenshots | `screenshot-<lang>-1.png` … `-3.png` (1280×800) for each language |
| Small promo tile | `promo-small-440x280.png` |
| Marquee promo tile | `promo-marquee-1400x560.png` (optional) |
| Official URL / Homepage | https://fitaread.com |
| Support URL | https://github.com/urimarti2610/fita/issues |

### Privacy tab

Copy the answers from [`privacy.md`](privacy.md): single purpose, one justification per permission, data usage (none) and remote code (none).

Privacy policy URL: `https://fitaread.com/en/privacy/`. Until the domain resolves, use `https://github.com/urimarti2610/fita/blob/main/PRIVACY.md`.

### Distribution tab

- Visibility: **Public**.
- Regions: all regions.
- Pricing: free (there is no other option for this extension).

## 4. Submit for review

Press **Submit for review**. Reviews usually take a few days; extensions that request host permissions can take longer. Ours asks for host access only as an *optional* permission, which keeps the review simpler.

After approval:

1. Copy the listing URL (`https://chromewebstore.google.com/detail/<id>`).
2. Put it in `chromeStore` in `apps/web/brand.ts`: the website's install button switches from GitHub to the store.

## Regenerating the images

The screenshots show the real extension, loaded in Chromium:

```sh
cd apps/extension
node scripts/build.mjs --e2e && node scripts/store-assets.mjs
```

Captions live in `scripts/store-assets.mjs` (`CAPTIONS`). Regenerate after visual changes to the popup or the emphasis styles.
