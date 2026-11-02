// Generates Chrome Web Store images in store/chrome/: 1280×800 screenshots per
// language (the real extension, loaded in Chromium), promo tiles and the store icon.
// Usage: node scripts/build.mjs --e2e && node scripts/store-assets.mjs
import { mkdirSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const root = fileURLToPath(new URL("..", import.meta.url));
/** Brand colours (teal accent, highlighter yellow), as on the website. */
const ACCENT = "#1d6a72";
const MARKER = "#f6d55c";
const out = join(root, "store/chrome");
const extension = join(root, "dist-e2e/chrome");
const require = createRequire(import.meta.url);
const font = (w) =>
  readFileSync(
    require.resolve(
      `@fontsource/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-${w}-normal.woff2`,
      { paths: [join(root, "../web")] },
    ),
  ).toString("base64");
const FONTS = `@font-face{font-family:A;font-weight:300;src:url(data:font/woff2;base64,${font(300)})}
@font-face{font-family:A;font-weight:400;src:url(data:font/woff2;base64,${font(400)})}
@font-face{font-family:A;font-weight:800;src:url(data:font/woff2;base64,${font(800)})}`;

/** Captions on the screenshots: store material, one set per listing language. */
const CAPTIONS = {
  es: [
    "Destaca el inicio de cada palabra en cualquier web",
    "Elige intensidad y estilo, y déjala activa en tus sitios",
    "También en modo oscuro. Se activa y desactiva con Alt+B",
  ],
  ca: [
    "Destaca l'inici de cada paraula a qualsevol web",
    "Tria intensitat i estil, i deixa-la activa als teus llocs",
    "També en mode fosc. S'activa i es desactiva amb Alt+B",
  ],
  en: [
    "Emphasizes the start of every word, on any website",
    "Choose strength and style, and keep it on for your sites",
    "Dark mode too. Turn it on and off with Alt+B",
  ],
};

/** A neutral sample article (no real site is imitated), from the worksheet texts. */
function article(lang) {
  const md = readFileSync(join(root, `../web/src/worksheet/texts/${lang}/README.md`), "utf8");
  const sections = md.split(/^## /m).slice(1);
  const section = sections[6] ?? sections[0];
  const [title, ...rest] = section.split("\n");
  const paragraphs = rest
    .join("\n")
    .replace(/^- [^\n]*\n/, "")
    .trim()
    .split(/\n\s*\n/);
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>${title}</title><style>
  :root { color-scheme: light dark; }
  body { margin: 0; font: 21px/1.7 Georgia, serif; background: #fdfcf9; color: #222; }
  @media (prefers-color-scheme: dark) { body { background: #17191c; color: #e6e6e6; } header { border-color: #333 !important; } }
  header { padding: 18px 48px; border-bottom: 1px solid #e5e2da; font: 700 18px system-ui, sans-serif; letter-spacing: .02em; }
  main { max-width: 680px; margin: 48px auto; padding: 0 32px; }
  h1 { font-size: 44px; line-height: 1.15; margin: 0 0 28px; }
  </style></head><body><header>Magazine</header><main><h1>${title}</h1>${paragraphs
    .map((p) => `<p>${p}</p>`)
    .join("")}</main></body></html>`;
}

function serve(lang) {
  const server = createServer((_req, res) => {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(article(lang));
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

const png = (buffer) => `data:image/png;base64,${buffer.toString("base64")}`;

/** Frames a capture under a caption, at the store's 1280×800. */
async function compose(page, file, caption, shot, popup) {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.setContent(`<!doctype html><html><head><style>${FONTS}
  body{margin:0;width:1280px;height:800px;background:${ACCENT};font-family:A,sans-serif;overflow:hidden;position:relative}
  h1{margin:0;padding:40px 64px 0;color:#fff;font-weight:800;font-size:40px;letter-spacing:-.01em}
  .shot{position:absolute;left:64px;top:128px;width:1152px;border-radius:14px 14px 0 0;box-shadow:0 20px 50px rgb(0 0 0/.35)}
  .popup{position:absolute;right:96px;top:150px;width:330px;border-radius:12px;box-shadow:0 18px 44px rgb(0 0 0/.4)}
  </style></head><body><h1>${caption}</h1><img class="shot" src="${png(shot)}">${
    popup ? `<img class="popup" src="${png(popup)}">` : ""
  }</body></html>`);
  await page.waitForTimeout(100);
  await page.screenshot({ path: join(out, file) });
}

async function screenshots(lang) {
  const server = await serve(lang);
  const url = `http://127.0.0.1:${server.address().port}/`;
  const context = await chromium.launchPersistentContext("", {
    channel: "chromium",
    args: [
      `--disable-extensions-except=${extension}`,
      `--load-extension=${extension}`,
      `--lang=${lang}`,
    ],
    locale: lang,
    viewport: { width: 1152, height: 720 },
  });
  const worker = context.serviceWorkers()[0] ?? (await context.waitForEvent("serviceworker"));
  const id = new URL(worker.url()).host;
  const page = await context.newPage();

  const capture = async (settings, scheme) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto(url);
    await worker.evaluate(async (s) => {
      await chrome.storage.sync.clear();
      await chrome.storage.sync.set({ settings: s });
    }, settings);
    await worker.evaluate(async () => {
      const [tab] = await chrome.tabs.query({ url: "http://127.0.0.1/*" });
      await globalThis.fitaTest.setTab(tab.id, true);
    });
    await page.locator("fita-e").first().waitFor();
    await page.waitForTimeout(300);
    return page.screenshot();
  };

  const light = await capture({}, "light");
  const styled = await capture({ style: "underline", strength: 0.5, lineHeight: 1.8 }, "light");

  // The popup, opened as a page, cannot see the article tab: show that tab's real
  // state (on), with the settings just applied to it.
  const popupPage = await context.newPage();
  await popupPage.setViewportSize({ width: 340, height: 640 });
  await popupPage.goto(`chrome-extension://${id}/popup.html`);
  // The popup finishes initialising when the shortcut hint is filled in.
  await popupPage.waitForFunction(() => document.getElementById("shortcuts")?.textContent?.trim());
  // On macOS Chromium ignores --lang: translate the popup with the same messages
  // file the extension ships for this language, exactly as the popup does itself.
  await popupPage.evaluate(async (language) => {
    const messages = await (await fetch(`/_locales/${language}/messages.json`)).json();
    const t = (key) => messages[key]?.message ?? "";
    document.documentElement.lang = language;
    for (const el of document.querySelectorAll("[data-i18n]")) el.textContent = t(el.dataset.i18n);
    document.getElementById("toggle")?.setAttribute("aria-checked", "true");
    const status = document.getElementById("status");
    if (status) status.textContent = t("statusOn");
    const shortcut = document.getElementById("shortcuts");
    if (shortcut) shortcut.textContent = t("shortcutHint").replace("$SHORTCUT$", "Alt+B");
  }, lang);
  await popupPage.waitForTimeout(400); // let the switch finish its transition
  const popup = await popupPage.screenshot({ fullPage: true });
  await popupPage.close();

  const dark = await capture({}, "dark");

  const composer = await context.newPage();
  const [c1, c2, c3] = CAPTIONS[lang];
  await compose(composer, `screenshot-${lang}-1.png`, c1, light);
  await compose(composer, `screenshot-${lang}-2.png`, c2, styled, popup);
  await compose(composer, `screenshot-${lang}-3.png`, c3, dark);
  await context.close();
  server.close();
}

async function tiles() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const mark = (size) => `<svg viewBox="0 0 32 32" width="${size}" height="${size}">
    <rect width="32" height="32" rx="7" fill="${ACCENT}"/>
    <rect x="6.4" y="9.6" width="7.7" height="4.5" fill="#fbfaf7"/><rect x="14" y="10.9" width="11.5" height="1.9" fill="#fbfaf7"/>
    <rect x="6.4" y="17.9" width="5.8" height="4.5" fill="#fbfaf7"/><rect x="12" y="19.2" width="9" height="1.9" fill="#fbfaf7"/></svg>`;
  const tile = async (w, h, file, inner) => {
    await page.setViewportSize({ width: w, height: h });
    await page.setContent(`<!doctype html><html><head><style>${FONTS}
    body{margin:0;width:${w}px;height:${h}px;background:#f6f7f3;color:#1d2a2e;font-family:A,sans-serif;display:flex;flex-direction:column;justify-content:center;padding:0 ${Math.round(w * 0.08)}px;box-sizing:border-box;gap:${Math.round(h * 0.06)}px}
    .brand{display:flex;align-items:center;gap:14px}
    .wm{font-weight:300;letter-spacing:-.01em} .wm i{font-style:normal;font-weight:800;color:${ACCENT};
      background:linear-gradient(transparent 52%, ${MARKER} 52% 88%, transparent 88%);padding:0 .04em}
    h1{margin:0;font-weight:300;line-height:1;letter-spacing:-.02em} b{font-weight:800;color:${ACCENT}}
    </style></head><body>${inner}</body></html>`);
    await page.waitForTimeout(100);
    await page.screenshot({ path: join(out, file), omitBackground: false });
  };
  await tile(
    440,
    280,
    "promo-small-440x280.png",
    `<div class="brand" style="font-size:34px"><span class="wm"><i>fi</i>ta</span></div><h1 style="font-size:52px"><b>Re</b>ad <b>you</b>r <b>wa</b>y</h1>`,
  );
  await tile(
    1400,
    560,
    "promo-marquee-1400x560.png",
    `<div class="brand" style="font-size:64px"><span class="wm"><i>fi</i>ta</span></div><h1 style="font-size:140px"><b>Re</b>ad <b>you</b>r <b>wa</b>y</h1>`,
  );
  // Store icon: 96×96 artwork centred in a transparent 128×128 canvas, per store guidelines.
  await page.setViewportSize({ width: 128, height: 128 });
  await page.setContent(
    `<body style="margin:0;width:128px;height:128px;display:grid;place-items:center;background:transparent">${mark(96)}</body>`,
  );
  await page.screenshot({ path: join(out, "store-icon-128.png"), omitBackground: true });
  await browser.close();
}

mkdirSync(out, { recursive: true });
for (const lang of Object.keys(CAPTIONS)) await screenshots(lang);
await tiles();
console.log(`Store assets written to ${out}`);
