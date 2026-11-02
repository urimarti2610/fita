import { expect, test } from "@playwright/test";

test("settings bubble: changes apply to the page, presets persist across pages", async ({
  page,
}) => {
  await page.goto("/es/");
  const bubble = page.getByRole("button", { name: "Abrir los ajustes de lectura" });
  const panel = page.locator("#settings-panel");
  await expect(panel).toBeHidden();
  await bubble.click();
  await expect(panel).toBeVisible();

  // A change in the bubble shows up in the demo controls and output.
  await panel.getByLabel(/Intensidad/).fill("0.2");
  await expect(page.locator("#demo-strength")).toHaveValue("0.2");
  await expect(page.locator("#demo-output fita-e").first()).toHaveText("L");

  // Save it as a preset.
  await panel.getByLabel("Nombre").fill("Suave");
  await panel.getByRole("button", { name: "Guardar" }).click();
  await expect(panel.getByRole("button", { name: "Usar los ajustes «Suave»" })).toContainText(
    "20 %, Negrita y atenuar",
  );

  // Escape closes the panel; the settings follow to another page and survive a reload.
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await page.goto("/es/fichas/");
  await expect(page.locator("#ws-strength")).toHaveValue("0.2");
  await page.reload();
  await expect(page.locator("#ws-strength")).toHaveValue("0.2");

  // Back to defaults, then the preset brings its values back.
  await bubble.click();
  await panel.getByRole("button", { name: "Volver a los ajustes predeterminados" }).click();
  await expect(page.locator("#ws-strength")).toHaveValue("0.45");
  await panel.getByRole("button", { name: "Usar los ajustes «Suave»" }).click();
  await expect(page.locator("#ws-strength")).toHaveValue("0.2");
  await expect(panel.locator("#preset-status")).toHaveText("Ahora usas «Suave».");

  await panel.getByRole("button", { name: "Borrar «Suave»" }).click();
  await expect(
    panel.getByText("Aún no has guardado ningún ajuste.", { exact: false }),
  ).toBeVisible();
});

test("the bubble is only on pages with tools", async ({ page }) => {
  await page.goto("/en/privacy/");
  await expect(page.getByRole("button", { name: "Open reading settings" })).toHaveCount(0);
  await page.goto("/en/convert/");
  await expect(page.getByRole("button", { name: "Open reading settings" })).toBeVisible();
});
