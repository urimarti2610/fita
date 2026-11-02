import { readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

test("worksheet preview follows the editor across tabs", async ({ page }) => {
  await page.goto("/es/fichas/");
  const sheet = page.locator("#ws-sheet .sheet");
  await expect(sheet.locator("h1")).toHaveText("El gato que quería volar");
  await expect(sheet.locator("fita-e").first()).toBeVisible();

  await page.getByLabel("Elegir texto").selectOption({ label: "El faro y la gaviota" });
  await expect(sheet.locator("h1")).toHaveText("El faro y la gaviota");
  await page.getByLabel("Título", { exact: true }).fill("Mi ficha <3");
  await expect(sheet.locator("h1")).toHaveText("Mi ficha <3");

  await page.getByRole("tab", { name: "Diseño" }).click();
  await expect(page.getByLabel("Título", { exact: true })).toBeHidden();
  for (const [name, theme] of [
    ["Coches y camiones", "vehicles"],
    ["Sin marco", "none"],
    ["Estrellas", "stars"],
  ] as const) {
    await page.getByRole("radio", { name }).check();
    await expect(sheet).toHaveClass(new RegExp(`theme-${theme}`));
  }
  await page.getByRole("radio", { name: "Horizontal" }).check();
  await expect(sheet).toHaveClass(/landscape/);
  const box = await sheet.boundingBox();
  expect(box && box.width > box.height).toBe(true);

  await page.getByLabel("Líneas para escribir").selectOption("3");
  await expect(sheet.locator(".line")).toHaveCount(3);
  await page.getByLabel("Añadir nombre y fecha").uncheck();
  await expect(sheet.locator(".meta")).toHaveCount(0);
});

test("tabs work with the keyboard", async ({ page }) => {
  await page.goto("/en/worksheets/");
  const text = page.getByRole("tab", { name: "Text" });
  await text.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Layout" })).toBeFocused();
  await expect(page.getByRole("tab", { name: "Layout" })).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("End");
  await expect(page.getByRole("tabpanel", { name: "Emphasis" })).toBeVisible();
  await page.keyboard.press("Home");
  await expect(page.getByRole("tabpanel", { name: "Text" })).toBeVisible();
});

test("warns when the worksheet does not fit on one page", async ({ page }) => {
  await page.goto("/ca/fitxes/");
  const notice = page.getByRole("status").filter({ hasText: "més d'una pàgina" });
  await expect(notice).toBeHidden();
  await page
    .getByRole("textbox", { name: "Text", exact: true })
    .fill("Una frase llarga per omplir la fitxa. ".repeat(80));
  await expect(notice).toBeVisible();
});

test("my texts: save, survive a reload, export and import", async ({ page }) => {
  await page.goto("/es/fichas/");
  await page.getByLabel("Título", { exact: true }).fill("Mi cuento");
  await page.getByRole("textbox", { name: "Texto", exact: true }).fill("Había una vez.\n\nFin.");
  await page.getByRole("button", { name: "Guardar en mis textos" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "«Mi cuento» está guardado" }),
  ).toBeVisible();

  await page.reload();
  const select = page.getByLabel("Elegir texto");
  await select.selectOption({ label: "Mi cuento" });
  await expect(page.locator("#ws-sheet h1")).toHaveText("Mi cuento");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Exportar mis textos" }).click(),
  ]);
  const exported = readFileSync(await download.path(), "utf8");
  expect(download.suggestedFilename()).toBe("mis-textos-fichas.md");
  expect(exported).toBe("# Mis textos para fichas\n\n## Mi cuento\n\nHabía una vez.\n\nFin.\n");

  await page.getByRole("button", { name: "Quitar de mis textos" }).click();
  await expect(select.locator("option", { hasText: "Mi cuento" })).toHaveCount(0);

  const file = join(tmpdir(), "textos.md");
  writeFileSync(file, `${exported}\n## Otro\n- Nivel: 8–9 años\n\nMás texto.\n`);
  await page.getByLabel("Importar textos").setInputFiles(file);
  await expect(page.getByRole("status").filter({ hasText: "Textos importados: 2." })).toBeVisible();
  await expect(page.locator("#ws-sheet h1")).toHaveText("Otro");
  await expect(select.locator("option", { hasText: "Mi cuento" })).toHaveCount(1);
});

test("downloads a self-contained worksheet file", async ({ page }) => {
  await page.goto("/en/worksheets/");
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Download the worksheet" }).click(),
  ]);
  expect(download.suggestedFilename()).toBe("worksheet-the-cat-who-wanted-to-fly.html");
  const html = readFileSync(await download.path(), "utf8");
  expect(html).toContain("@font-face");
  expect(html).toContain("data:font/woff2;base64,");
  expect(html).toContain("<fita-e>");
  expect(html).toContain('class="sheet theme-clouds portrait"');
  expect(html).toContain("@page landscape");
  expect(html).not.toMatch(/https?:\/\//);
});

test("printing shows only the worksheet", async ({ page }) => {
  await page.goto("/es/fichas/");
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".site-header")).toBeHidden();
  await expect(page.locator("#ws-form")).toBeHidden();
  await expect(page.locator("#ws-sheet .sheet")).toBeVisible();
});

test("typing straight onto the worksheet updates the editor and keeps emphasis", async ({
  page,
}) => {
  await page.goto("/es/fichas/");
  const story = page.getByRole("textbox", { name: "Texto de la ficha" });
  await story.click();
  await expect(story.locator("fita-e")).toHaveCount(0); // plain while editing
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.type("Elefantes en el parque");
  await expect(page.getByRole("textbox", { name: "Texto", exact: true })).toHaveValue(
    "Elefantes en el parque",
  );

  // From the text straight to the title: the title keeps focus after re-rendering.
  const heading = page.locator("#ws-sheet h1");
  await heading.click();
  await expect(page.locator("#ws-sheet h1")).toBeFocused();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.type("Mi título");
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Título", { exact: true })).toHaveValue("Mi título");
  await expect(page.locator("#ws-sheet .story fita-e").first()).toHaveText("Elef");
});

test("prints on a white background, keeping the frame", async ({ page }) => {
  await page.goto("/es/fichas/");
  const sheet = page.locator("#ws-sheet .sheet");
  await expect(sheet).toHaveCSS("background-color", "rgb(242, 248, 253)"); // clouds tint on screen
  await page.emulateMedia({ media: "print" });
  await expect(sheet).toHaveCSS("background-color", "rgb(255, 255, 255)");
  const frame = await sheet.evaluate((el) => getComputedStyle(el, "::before").borderTopColor);
  expect(frame).toBe("rgb(141, 187, 230)");
});

test("shows the page size and page breaks, and can hide them", async ({ page }) => {
  await page.goto("/es/fichas/");
  const size = page.locator("#ws-page-size");
  await expect(size).toHaveText("A4 vertical (210 × 297 mm)");
  await expect(page.locator(".page-break")).toHaveCount(0);

  await page
    .getByRole("textbox", { name: "Texto", exact: true })
    .fill("Una frase larga para llenar la ficha. ".repeat(120));
  await expect(page.locator(".page-break").first()).toHaveText("Página 2");

  await page.getByLabel("Mostrar tamaño de página").uncheck();
  await expect(size).toBeHidden();
  await expect(page.locator("#ws-guides")).toBeHidden();
  await page.reload();
  await expect(page.getByLabel("Mostrar tamaño de página")).not.toBeChecked();
  await expect(size).toBeHidden();

  await page.getByLabel("Mostrar tamaño de página").check();
  await page.getByRole("tab", { name: "Diseño" }).click();
  await page.getByRole("radio", { name: "Horizontal" }).check();
  await expect(size).toHaveText("A4 horizontal (297 × 210 mm)");
});
