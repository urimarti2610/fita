// Renders public/og.png (1200×630 social preview) and public/apple-touch-icon.png.
// Run with `node scripts/og-image.mjs` after changing the brand; outputs are committed.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const require = createRequire(import.meta.url);
const font = (weight) =>
  readFileSync(
    require.resolve(
      `@fontsource/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-${weight}-normal.woff2`,
    ),
  ).toString("base64");
const brand = readFileSync(new URL("../../../packages/core/src/brand.ts", import.meta.url), "utf8");
const name = brand.match(/name: "([^"]+)"/)?.[1] ?? "fita";
const website = brand.match(/website: "https?:\/\/([^"]+)"/)?.[1] ?? "";

const mark = (size) => `<svg viewBox="0 0 32 32" width="${size}" height="${size}">
  <rect width="32" height="32" rx="7" fill="#1f5f3a"/>
  <rect x="6.4" y="9.6" width="7.7" height="4.5" fill="#f6f7f3"/>
  <rect x="14" y="10.9" width="11.5" height="1.9" fill="#f6f7f3"/>
  <rect x="6.4" y="17.9" width="5.8" height="4.5" fill="#f6f7f3"/>
  <rect x="12" y="19.2" width="9" height="1.9" fill="#f6f7f3"/></svg>`;

const css = `
@font-face { font-family: A; font-weight: 300; src: url(data:font/woff2;base64,${font(300)}) format("woff2"); }
@font-face { font-family: A; font-weight: 800; src: url(data:font/woff2;base64,${font(800)}) format("woff2"); }
html, body { margin: 0; }
body { width: 1200px; height: 630px; background: #f6f7f3; color: #1d2a2e; font-family: A, sans-serif;
  display: flex; flex-direction: column; justify-content: space-between; padding: 72px 88px; box-sizing: border-box; }
.top { display: flex; align-items: center; gap: 20px; font-weight: 800; font-size: 44px; }
h1 { margin: 0; font-weight: 300; font-size: 128px; line-height: 1; letter-spacing: -0.02em; }
b { font-weight: 800; color: #1f5f3a; }
.foot { display: flex; justify-content: space-between; font-size: 30px; color: #56645f; }
`;
// Same emphasis as the site headline; "to read" in a few of the site languages below.
const html = `<!doctype html><html><head><style>${css}</style></head><body>
<div class="top">${mark(64)}<span>${name}</span></div>
<h1><b>Re</b>ad <b>you</b>r <b>wa</b>y</h1>
<div class="foot"><span><b>Le</b>er · <b>Lle</b>gir · <b>Li</b>re · <b>Le</b>sen · <b>Leg</b>gere</span><span>${website}</span></div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.screenshot({ path: fileURLToPath(new URL("../public/og.png", import.meta.url)) });
await page.setViewportSize({ width: 180, height: 180 });
await page.setContent(
  `<body style="margin:0;width:180px;height:180px;display:grid;place-items:center;background:#f6f7f3">${mark(150)}</body>`,
);
await page.screenshot({
  path: fileURLToPath(new URL("../public/apple-touch-icon.png", import.meta.url)),
});
await browser.close();
