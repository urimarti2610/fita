import { expect, tabIdOf, test } from "./fixtures.js";

type TestHooks = {
  setTab(tabId: number, enabled?: boolean): Promise<{ enabled: boolean }>;
  syncRegistration(): Promise<void>;
  onCommand(command: string, tab?: chrome.tabs.Tab): Promise<void>;
};
declare const fitaTest: TestHooks;

test("activate and deactivate in a tab, leaving the page identical", async ({
  context,
  worker,
  baseURL,
}) => {
  const page = await context.newPage();
  await page.goto(baseURL);
  const before = await page.locator("main").innerHTML();
  const tabId = await tabIdOf(worker, baseURL);

  const on = await worker.evaluate((id) => fitaTest.setTab(id), tabId);
  expect(on.enabled).toBe(true);
  await expect(page.locator("#p fita-e").first()).toHaveText("Ho");
  await expect(page.locator("pre fita-w")).toHaveCount(0);
  await expect(page.locator("textarea")).toHaveValue("no tocar");
  expect(await page.locator("#p").textContent()).toBe("Hola mundo, esto es un párrafo de ejemplo.");
  // Emphasis is visible: the injected stylesheet makes the anchor bolder.
  const weight = await page
    .locator("#p fita-e")
    .first()
    .evaluate((el) => getComputedStyle(el).fontWeight);
  expect(Number(weight)).toBeGreaterThan(400);
  expect(await worker.evaluate((id) => chrome.action.getBadgeText({ tabId: id }), tabId)).toBe(
    "ON",
  );

  const off = await worker.evaluate((id) => fitaTest.setTab(id), tabId);
  expect(off.enabled).toBe(false);
  await expect(page.locator("fita-w")).toHaveCount(0);
  expect(await page.locator("main").innerHTML()).toBe(before);
  await expect
    .poll(() => worker.evaluate((id) => chrome.action.getBadgeText({ tabId: id }), tabId))
    .toBe("");
});

test("Alt+B command toggles the active tab", async ({ context, worker, baseURL }) => {
  const page = await context.newPage();
  await page.goto(baseURL);
  await page.bringToFront();
  await worker.evaluate(() => fitaTest.onCommand("toggle-emphasis"));
  await expect(page.locator("#p fita-e").first()).toHaveText("Ho");
  await worker.evaluate(() => fitaTest.onCommand("toggle-emphasis"));
  await expect(page.locator("fita-w")).toHaveCount(0);

  const commands = await worker.evaluate(() => chrome.commands.getAll());
  expect(commands.find((c) => c.name === "toggle-emphasis")?.shortcut).toMatch(/Alt\+B|⌥B/);
});

test("always on this site activates automatically after reload", async ({
  context,
  worker,
  baseURL,
}) => {
  await worker.evaluate(async (origin) => {
    await chrome.storage.sync.set({
      [`site:${origin}`]: { on: true },
      settings: { strength: 0.7 },
    });
    await fitaTest.syncRegistration();
  }, baseURL);
  const page = await context.newPage();
  await page.goto(baseURL);
  await expect(page.locator("#p fita-e").first()).toHaveText("Hol");

  // Turning the site off unregisters the automatic script.
  await worker.evaluate(async (origin) => {
    await chrome.storage.sync.remove(`site:${origin}`);
    await fitaTest.syncRegistration();
  }, baseURL);
  await page.reload();
  await expect(page.locator("#p")).toBeVisible();
  await page.waitForTimeout(500);
  await expect(page.locator("fita-w")).toHaveCount(0);
});

test("popup is translated and keyboard-usable", async ({ context, extensionId }) => {
  const popup = await context.newPage();
  await popup.goto(`chrome-extension://${extensionId}/popup.html`);
  const toggle = popup.getByRole("switch");
  await expect(toggle).toHaveAccessibleName(/.+/);
  await expect(popup.getByRole("slider")).toHaveCount(1);
  await expect(popup.getByRole("radio")).toHaveCount(4);
  await popup.keyboard.press("Tab");
  await expect(toggle).toBeFocused();
});
