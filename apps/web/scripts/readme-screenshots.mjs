// Captures the website screenshots used in the root README (docs/screenshots/).
// Usage: pnpm build:web && node apps/web/scripts/readme-screenshots.mjs
import { readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import JSZip from "jszip";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const out = fileURLToPath(new URL("../../../docs/screenshots/", import.meta.url));
const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".svg": "image/svg+xml",
  ".xml": "application/xml",
  ".txt": "text/plain",
};

const server = createServer((req, res) => {
  let path = join(dist, decodeURIComponent(new URL(req.url, "http://x").pathname));
  try {
    if (statSync(path).isDirectory()) path = join(path, "index.html");
    res.writeHead(200, { "content-type": TYPES[extname(path)] ?? "application/octet-stream" });
    res.end(readFileSync(path));
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}`;

/** A small EPUB to show the converter's first-page preview. */
async function sampleBook() {
  const md = readFileSync(new URL("../src/worksheet/texts/en/README.md", import.meta.url), "utf8");
  const [, ...sections] = md.split(/^## /m);
  const [title, ...rest] = (sections[3] ?? "").split("\n");
  const body = rest
    .join("\n")
    .replace(/^- [^\n]*\n/, "")
    .trim()
    .split(/\n\s*\n/)
    .map((p) => `<p>${p}</p>`)
    .join("");
  const zip = new JSZip();
  zip.file("mimetype", "application/epub+zip", { compression: "STORE" });
  zip.file(
    "META-INF/container.xml",
    '<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/book.opf" media-type="application/oebps-package+xml"/></rootfiles></container>',
  );
  zip.file(
    "OEBPS/book.opf",
    `<?xml version="1.0"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="id">x</dc:identifier><dc:title>Stories for the night</dc:title><dc:language>en</dc:language></metadata><manifest><item id="c1" href="c1.xhtml" media-type="application/xhtml+xml"/></manifest><spine><itemref idref="c1"/></spine></package>`,
  );
  zip.file(
    "OEBPS/c1.xhtml",
    `<?xml version="1.0" encoding="utf-8"?><html xmlns="http://www.w3.org/1999/xhtml" lang="en"><head><title>${title}</title></head><body><h1>${title}</h1>${body}</body></html>`,
  );
  const path = join(tmpdir(), "stories-for-the-night.epub");
  (await import("node:fs")).writeFileSync(path, await zip.generateAsync({ type: "nodebuffer" }));
  return path;
}

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
});
const shoot = async (name, url, prepare) => {
  await page.goto(`${base}${url}`);
  await prepare?.();
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(out, `${name}.png`) });
};

await shoot("web-home", "/en/");
await shoot("web-demo", "/en/", () => page.locator("#demo-title").scrollIntoViewIfNeeded());
await shoot("web-worksheets", "/en/worksheets/", async () => {
  await page.getByRole("tab", { name: "Layout" }).click();
  await page.getByRole("radio", { name: "Cars and trucks" }).check();
  await page.locator(".worksheet").scrollIntoViewIfNeeded();
});
const book = await sampleBook();
await shoot("web-converter", "/en/convert/", async () => {
  await page.getByLabel(/Choose a file/).setInputFiles(book);
  await page.locator("#cv-preview p").first().waitFor();
  await page.locator(".converter-layout").scrollIntoViewIfNeeded();
});
await shoot("web-who-its-for", "/en/who-its-for/#speech-therapy", () =>
  page.locator(".picker").scrollIntoViewIfNeeded(),
);
await browser.close();
server.close();
console.log(`README screenshots written to ${out}`);
