import { randomBytes } from "node:crypto";
import { mkdtempSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import JSZip from "jszip";
import { CHAPTER, makeEpub } from "../test/fixtures.js";

const dir = mkdtempSync(join(tmpdir(), "fita-e2e-"));

async function save(name: string, blob: Blob) {
  const path = join(dir, name);
  writeFileSync(path, Buffer.from(await blob.arrayBuffer()));
  return path;
}

test("converts an EPUB step by step, with a live first-page preview", async ({ page }) => {
  const path = await save("Llibre.epub", await makeEpub());
  await page.goto("/ca/convertir/");
  await expect(page.getByRole("button", { name: "Convertir" })).toBeDisabled();
  await page.getByLabel(/Tria un fitxer/).setInputFiles(path);
  await expect(page.getByText("Llibre.epub")).toBeVisible();

  // Preview: the book title and its first text, with emphasis, follow the controls.
  const preview = page.locator("#cv-preview");
  await expect(page.locator("#cv-book-title")).toHaveText("Llibre");
  await expect(preview.locator("h3")).toContainText("Primer capítol");
  await expect(preview).not.toContainText("codi"); // <pre> is not reading text
  const first = preview.locator(".fita-e").first();
  await expect(first).toHaveText("Pri");
  await page.locator("#convert-strength").fill("0.2");
  await expect(first).toHaveText("P");
  await page.getByRole("button", { name: "Convertir" }).click();
  const link = page.getByRole("link", { name: /Descarregar Llibre\.fita\.epub/ });
  await expect(link).toBeVisible();
  await expect(link).toBeFocused();
  const [download] = await Promise.all([page.waitForEvent("download"), link.click()]);
  const zip = await JSZip.loadAsync(readFileSync(await download.path()));
  expect(Object.keys(zip.files)[0]).toBe("mimetype");
  expect(await zip.file("OPS/Text/capítol-0.xhtml")?.async("string")).toContain("fita-e");
});

test("explains DRM kindly", async ({ page }) => {
  const path = await save(
    "drm.epub",
    await makeEpub({ extra: { "META-INF/rights.xml": "<rights/>" } }),
  );
  await page.goto("/es/convertir/");
  await page.getByLabel(/Elige un archivo/).setInputFiles(path);
  // Detected as soon as the file is chosen, before converting.
  await expect(page.getByRole("alert")).toContainText("DRM");
  await expect(page.getByRole("button", { name: "Convertir" })).toBeDisabled();
});

test("rejects unsupported formats before converting", async ({ page }) => {
  const path = join(dir, "doc.pdf");
  writeFileSync(path, "%PDF");
  await page.goto("/en/convert/");
  await page.getByLabel(/Choose a file/).setInputFiles(path);
  await expect(page.getByRole("alert")).toContainText("can't be converted");
  await expect(page.getByRole("button", { name: "Convert" })).toBeDisabled();
});

test("Markdown can be exported as EPUB", async ({ page }) => {
  const path = join(dir, "notes.md");
  writeFileSync(path, "# Chapter\n\nSome *notes* here.\n");
  await page.goto("/en/convert/");
  await page.getByLabel(/Choose a file/).setInputFiles(path);
  await page.getByLabel("Output format").selectOption("epub");
  await page.getByRole("button", { name: "Convert" }).click();
  await expect(page.getByRole("link", { name: /notes\.fita\.epub/ })).toBeVisible();
});

test("a 50+ MB EPUB converts without freezing the tab, and can be cancelled", async ({ page }) => {
  test.setTimeout(300_000);
  // 300 chapters of real prose (~25 MB of XHTML) plus 55 MB of incompressible images.
  const paragraph =
    "<p>L'àvia llegia cada vespre una història diferent, i la casa s'omplia de veus. </p>";
  const chapters = Array.from({ length: 300 }, () => CHAPTER(paragraph.repeat(1000)));
  const images: Record<string, Uint8Array> = {};
  for (let i = 0; i < 55; i++) images[`OPS/img/photo-${i}.jpg`] = randomBytes(1024 * 1024);
  const path = await save("big.epub", await makeEpub({ chapters, extra: images }));
  expect(statSync(path).size).toBeGreaterThan(50 * 1024 * 1024);

  await page.goto("/en/convert/");
  await page.getByLabel(/Choose a file/).setInputFiles(path);

  // Cancel works mid-way.
  await page.getByRole("button", { name: "Convert" }).click();
  await expect(page.locator("progress")).toBeVisible();
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByText("Conversion cancelled")).toBeVisible();

  // Then a full run while measuring main-thread responsiveness.
  await page.evaluate(() => {
    const w = window as unknown as { maxGap: number };
    w.maxGap = 0;
    let last = performance.now();
    const tick = () => {
      const now = performance.now();
      w.maxGap = Math.max(w.maxGap, now - last);
      last = now;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await page.getByRole("button", { name: "Convert" }).click();
  const link = page.getByRole("link", { name: /big\.fita\.epub/ });
  await expect(link).toBeVisible({ timeout: 240_000 });
  const maxGap = await page.evaluate(() => (window as unknown as { maxGap: number }).maxGap);
  expect(maxGap).toBeLessThan(200);

  const [download] = await Promise.all([page.waitForEvent("download"), link.click()]);
  const out = readFileSync(await download.path());
  expect(out.length).toBeGreaterThan(50 * 1024 * 1024);
  const zip = await JSZip.loadAsync(out);
  expect(await zip.file("OPS/Text/capítol-299.xhtml")?.async("string")).toContain("fita-e");
  writeFileSync(join(dir, "big.fita.epub"), out);
});
