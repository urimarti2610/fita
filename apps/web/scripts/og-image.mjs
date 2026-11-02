// Renders every brand image from the wordmark: the name's start in heavy teal over a
// yellow highlighter stroke, the rest light (the same mark as the site header).
//   apps/web/public/og.png                 1200×630 social preview
//   apps/web/public/favicon.png            32×32
//   apps/web/public/apple-touch-icon.png   180×180
//   apps/extension/static/icons/icon-N.png 16, 32, 48, 128
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

// Same split as the header wordmark (emphasize() with strength 0.5 on a plain word).
const chars = [...name];
const cut = Math.min(chars.length - 1, Math.max(1, Math.round(chars.length * 0.5)));
const lead = chars.slice(0, cut).join("");
const rest = chars.slice(cut).join("");

const C = {
  paper: "#f6f7f3",
  ink: "#1d2a2e",
  muted: "#56645f",
  brand: "#1d6a72",
  marker: "#f6d55c",
};

// Highlighter stroke, as in Base.astro.
const SWASH =
  "M6 9 C 30 6, 66 4, 95 6.5 C 99 7, 99.5 12, 98 20 C 97 27, 96 31, 92 32 C 62 31, 32 33, 7 35 C 2 35, 0.5 31, 1.5 24 C 2.5 15, 3 9.5, 6 9 Z";
const marked = (text) =>
  `<span class="lead"><svg class="swash" viewBox="0 0 100 40" preserveAspectRatio="none"><path d="${SWASH}"/></svg><span>${text}</span></span>`;

const css = `
@font-face { font-family: A; font-weight: 300; src: url(data:font/woff2;base64,${font(300)}) format("woff2"); }
@font-face { font-family: A; font-weight: 800; src: url(data:font/woff2;base64,${font(800)}) format("woff2"); }
html, body { margin: 0; }
body { background: ${C.paper}; color: ${C.ink}; font-family: A, sans-serif; }
.lead { position: relative; font-weight: 800; color: ${C.brand}; }
.lead > span { position: relative; }
.swash { position: absolute; left: -0.06em; bottom: 0.04em; width: calc(100% + 0.16em); height: 0.56em;
  fill: ${C.marker}; transform: rotate(-3deg); }
.light { font-weight: 300; }
`;

// Social preview: wordmark, the site headline set with emphasis, languages and address.
const og = `<!doctype html><html><head><style>${css}
body { width: 1200px; height: 630px; display: flex; flex-direction: column; justify-content: space-between;
  padding: 72px 88px; box-sizing: border-box; }
.mark { font-size: 64px; line-height: 1; letter-spacing: -0.02em; }
h1 { margin: 0; font-weight: 300; font-size: 132px; line-height: 1; letter-spacing: -0.02em; }
h1 b { font-weight: 800; color: ${C.brand}; }
.foot { display: flex; justify-content: space-between; font-size: 30px; color: ${C.muted}; }
.foot b { font-weight: 800; color: ${C.ink}; }
</style></head><body>
<div class="mark">${marked(lead)}<span class="light">${rest}</span></div>
<h1><b>Re</b>ad <b>you</b>r <b>wa</b>y</h1>
<div class="foot"><span><b>Le</b>er · <b>Lle</b>gir · <b>Li</b>re · <b>Le</b>sen · <b>Leg</b>gere · <b>Czy</b>tać</span><span>${website}</span></div>
</body></html>`;

// Square icon: the emphasized start of the name on paper, over the highlighter stroke.
// Small sizes drop the stroke's tilt and grow the letters so they stay crisp.
const icon = (size) => `<!doctype html><html><head><style>${css}
body { width: ${size}px; height: ${size}px; display: grid; place-items: center; background: transparent; }
.tile { width: ${size}px; height: ${size}px; border-radius: ${Math.round(size * 0.22)}px; background: ${C.paper};
  display: grid; place-items: center; box-shadow: inset 0 0 0 ${Math.max(1, Math.round(size / 40))}px rgb(29 42 46 / 0.12); }
.tile .lead { font-size: ${Math.round(size * (size <= 32 ? 0.74 : 0.62))}px; line-height: 1; letter-spacing: -0.03em; }
${size <= 32 ? ".swash { transform: none; height: 0.5em; }" : ""}
</style></head><body><div class="tile">${marked(lead)}</div></body></html>`;

const out = (path) => fileURLToPath(new URL(path, import.meta.url));
const browser = await chromium.launch();
const page = await browser.newPage();

await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(og);
await page.screenshot({ path: out("../public/og.png") });

const icons = [
  [32, "../public/favicon.png"],
  [180, "../public/apple-touch-icon.png"],
  ...[16, 32, 48, 128].map((s) => [s, `../../extension/static/icons/icon-${s}.png`]),
];
for (const [size, path] of icons) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(icon(size));
  // iOS draws its own rounded corners and wants an opaque icon.
  const opaque = path.endsWith("apple-touch-icon.png");
  if (opaque)
    await page.addStyleTag({
      content: `body { background: ${C.paper}; } .tile { border-radius: 0; box-shadow: none; }`,
    });
  await page.screenshot({ path: out(path), omitBackground: !opaque });
}
await browser.close();
