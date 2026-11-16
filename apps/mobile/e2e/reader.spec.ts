import { expect, test } from "@playwright/test";

// Smoke test of the reader's web layer (the same files the native shells load).
test.use({ locale: "en-GB" });

const TEXT =
  "Reading should feel comfortable.\n\nMarking the start of each word gives your eyes an anchor.";

test("paste a text, read it with emphasis and find it again in the library", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (r) => requests.push(r.url()));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.getByRole("button", { name: "Paste a text" }).click();
  await page.getByLabel("Text", { exact: true }).fill(TEXT);
  await page.getByLabel("Title (optional)").fill("My text");
  await page.getByRole("button", { name: "Read" }).click();

  const article = page.locator("article.page");
  await expect(article.locator("fita-e").first()).toBeAttached();
  // Screen readers get exactly the same text.
  expect((await article.textContent())?.replace(/\s+/g, " ").trim()).toBe(
    TEXT.replace(/\s+/g, " "),
  );

  // Emphasis can be switched off and on from the settings sheet.
  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByRole("switch", { name: "Emphasis" }).uncheck();
  await expect(article.locator("fita-e")).toHaveCount(0);
  await page.getByRole("switch", { name: "Emphasis" }).check();
  await expect(article.locator("fita-e").first()).toBeAttached();
  await page.getByLabel("Theme").selectOption("dark");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Close" }).click();

  await page.getByRole("link", { name: "Library" }).click();
  await expect(page.getByRole("link", { name: /My text/ })).toBeVisible();

  // Still there after a reload, with the dark theme remembered.
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("link", { name: /My text/ }).click();
  await expect(article).toContainText("anchor");

  // Nothing ever left the device.
  const origin = new URL(page.url()).origin;
  expect(requests.filter((u) => !u.startsWith(origin) && !u.startsWith("blob:"))).toEqual([]);
});

test("opens a Markdown file with chapters", async ({ page }) => {
  await page.goto("/");
  await page.locator('input[type="file"]').setInputFiles({
    name: "notes.md",
    mimeType: "text/markdown",
    buffer: Buffer.from("# One\n\nFirst chapter.\n\n# Two\n\nSecond chapter."),
  });
  const article = page.locator("article.page");
  await expect(article.getByRole("heading", { name: "One" })).toBeVisible();
  await page.getByRole("button", { name: "Next" }).click();
  await expect(article.getByRole("heading", { name: "Two" })).toBeVisible();
  await page.getByRole("button", { name: "Contents" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "One" }).click();
  await expect(article.getByRole("heading", { name: "One" })).toBeVisible();
});

test("ships a web app manifest and a service worker", async ({ request }) => {
  const manifest = await (await request.get("/manifest.webmanifest")).json();
  expect(manifest.share_target.action).toBe("./share");
  expect((await request.get("/sw.js")).ok()).toBe(true);
});
