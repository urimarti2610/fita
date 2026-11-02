import { expect, test } from "@playwright/test";

for (const lang of ["es", "ca", "en"]) {
  test(`home page in ${lang} works without any third-party request`, async ({ page, baseURL }) => {
    const external: string[] = [];
    page.on("request", (request) => {
      if (!request.url().startsWith(baseURL ?? "")) external.push(request.url());
    });
    await page.goto(`/${lang}/`);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(page.locator("h1 fita-e").first()).toBeVisible();
    await expect(page.locator("#demo-output fita-e").first()).toBeVisible();
    expect(external).toEqual([]);
  });
}

test("live demo follows typing and controls", async ({ page }) => {
  await page.goto("/es/");
  const output = page.locator("#demo-output");
  await page.getByRole("textbox", { name: "Tu texto", exact: true }).fill("elefante <b>&");
  await expect(output.locator("fita-e").first()).toHaveText("elef");
  await expect(output).toHaveText("elefante <b>&");

  await page.locator("#demo-strength").fill("0.7");
  await expect(output.locator("fita-e").first()).toHaveText("elefan");

  await page.getByRole("radio", { name: "Color" }).check();
  await expect(output).toHaveAttribute("data-fita-style", "color");
});

test("demo handles a book-length text without freezing", async ({ page }) => {
  await page.goto("/en/");
  // ~280,000 words in 2,000 paragraphs.
  const paragraph = "Reading should feel comfortable for everyone. ".repeat(20);
  const text = Array.from({ length: 2000 }, () => paragraph).join("\n\n");
  // Paste-like: set the value at once (typing 2 MB through Playwright is slow on CI).
  await page.getByRole("textbox", { name: "Your text", exact: true }).evaluate((el, value) => {
    (el as HTMLTextAreaElement).value = value;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }, text);
  await expect(page.locator("#demo-output fita-e").first()).toHaveText("Rea");

  // While the rest is emphasized in the background, the page keeps painting frames.
  const maxGap = await page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        let max = 0;
        let last = performance.now();
        const end = last + 1500;
        const tick = (now: number) => {
          max = Math.max(max, now - last);
          last = now;
          if (now < end) requestAnimationFrame(tick);
          else resolve(max);
        };
        requestAnimationFrame(tick);
      }),
  );
  expect(maxGap).toBeLessThan(250);
});

test("root redirects to a language and text pages exist", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/(es|ca|en)\/$/);
  for (const path of ["/es/privacidad/", "/ca/accessibilitat/", "/en/privacy/"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
  }
});

test("keyboard users can skip to content", async ({ page }) => {
  await page.goto("/ca/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Salta al contingut" });
  await expect(skip).toBeFocused();
});

test("who-it's-for page exists in every language and home links to each case", async ({ page }) => {
  for (const path of ["/es/para-quien/", "/ca/per-a-qui/", "/en/who-its-for/"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main h2")).toHaveCount(3);
  }
  await page.goto("/es/");
  await page.getByRole("link", { name: "Cómo usarlo en consulta" }).click();
  await expect(page).toHaveURL(/\/es\/para-quien\/#logopedia$/);
  await expect(page.locator("#logopedia h2")).toBeInViewport();
});

test("SEO files and tags are published", async ({ page, request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain("<loc>https://fitaread.com/ca/fitxes/</loc>");
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "Sitemap: https://fitaread.com/sitemap.xml",
  );
  expect(await (await request.get("/llms.txt")).text()).toMatch(/^# fita\n\n> /);
  expect((await request.get("/llms-full.txt")).ok()).toBe(true);

  await page.goto("/es/fichas/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://fitaread.com/es/fichas/",
  );
  await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute(
    "href",
    "https://fitaread.com/en/worksheets/",
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "https://fitaread.com/og.png",
  );
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "es_ES");
});

test("who-it's-for cases are tabs that follow the URL", async ({ page }) => {
  await page.goto("/en/who-its-for/#speech-therapy");
  const tab = page.getByRole("tab", { name: /Speech therapists/ });
  await expect(tab).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toHaveCount(1);
  await expect(page.locator("#speech-therapy")).toBeVisible();
  await expect(page.locator("#education")).toBeHidden();

  await tab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: /Adults/ })).toBeFocused();
  await expect(page.locator("#adults")).toBeVisible();
  await expect(page).toHaveURL(/#adults$/);
  await page.keyboard.press("Home");
  await expect(page.locator("#education")).toBeVisible();
});
