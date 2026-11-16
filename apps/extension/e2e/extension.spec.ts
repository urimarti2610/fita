import { expect, tabIdOf, test } from "./fixtures.js";

type TestHooks = {
  setTab(tabId: number, enabled?: boolean): Promise<{ enabled: boolean }>;
  syncRegistration(): Promise<void>;
  onCommand(command: string, tab?: chrome.tabs.Tab): Promise<void>;
  speakTab(
    tabId: number,
    action: string,
  ): Promise<{ status: string; lang: string; error?: string } | null>;
  setReader(tabId: number, open?: boolean): Promise<{ open: boolean; error?: string }>;
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
      settings: { strength: 0.2 },
    });
    await fitaTest.syncRegistration();
  }, baseURL);
  const page = await context.newPage();
  await page.goto(baseURL);
  await expect(page.locator("#p fita-e").first()).toHaveText("H");

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
  await expect(popup.getByRole("slider")).toHaveCount(2);
  await expect(popup.getByRole("button", { name: "Start" })).toBeVisible();
  await expect(popup.getByRole("button", { name: "Stop" })).toBeDisabled();
  await expect(popup.getByRole("radio")).toHaveCount(5);
  await popup.keyboard.press("Tab");
  await expect(toggle).toBeFocused();
  await popup.getByText("More options").click();
  await expect(popup.getByRole("button", { name: "Reading mode" })).toBeVisible();
});

test("line ruler follows the pointer and keyboard, and goes away with emphasis", async ({
  context,
  worker,
  baseURL,
}) => {
  await worker.evaluate(() => chrome.storage.sync.set({ settings: { ruler: "band" } }));
  const page = await context.newPage();
  await page.goto(baseURL);
  const before = await page.locator("body").innerHTML();
  const tabId = await tabIdOf(worker, baseURL);
  await worker.evaluate((id) => fitaTest.setTab(id, true), tabId);

  const ruler = page.locator("fita-ruler");
  await expect(ruler).toHaveCount(1);
  await expect(ruler).toHaveAttribute("aria-hidden", "true");
  await expect(ruler).toBeHidden(); // nothing to follow yet

  const box = await page.locator("#p").boundingBox();
  if (!box) throw new Error("no paragraph box");
  await page.mouse.move(box.x + 10, box.y + box.height / 2);
  await expect(ruler).toBeVisible();
  // The overlay never takes the pointer.
  expect(await ruler.evaluate((el) => getComputedStyle(el).pointerEvents)).toBe("none");

  // Keyboard focus moves it too.
  await page.mouse.move(box.x + 10, box.y + box.height + 300);
  await page.locator("textarea").focus();
  await expect(ruler).toBeVisible();

  await worker.evaluate((id) => fitaTest.setTab(id, false), tabId);
  await expect(ruler).toHaveCount(0);
  expect(await page.locator("body").innerHTML()).toBe(before);
});

test("read aloud starts and stops from the extension, leaving the page untouched", async ({
  context,
  worker,
  baseURL,
}) => {
  const page = await context.newPage();
  await page.goto(baseURL);
  const before = await page.locator("body").innerHTML();
  const tabId = await tabIdOf(worker, baseURL);

  // Asking for the state never injects anything.
  expect(await worker.evaluate((id) => fitaTest.speakTab(id, "state"), tabId)).toBeNull();

  const started = await worker.evaluate((id) => fitaTest.speakTab(id, "play"), tabId);
  expect(started?.lang).toBe("es");
  // Test machines often have no on-device voice; then it must say so instead of
  // falling back to an online one.
  if (started?.status === "idle") expect(started.error).toBe("noVoice");
  else expect(started?.status).toBe("playing");

  const stopped = await worker.evaluate((id) => fitaTest.speakTab(id, "stop"), tabId);
  expect(stopped?.status).toBe("idle");
  expect(await page.locator("body").innerHTML()).toBe(before);
  await expect(page.locator("fita-w")).toHaveCount(0);
});

test("reading mode shows the article in its own view and closes with Escape", async ({
  context,
  worker,
  baseURL,
}) => {
  const page = await context.newPage();
  await page.goto(baseURL);
  await page.evaluate(() => {
    const main = document.querySelector("main") as HTMLElement;
    for (let i = 0; i < 6; i++) {
      const p = document.createElement("p");
      p.textContent = `Párrafo ${i}: el río atraviesa la ciudad y cada verano las familias bajan a pasear, a leer y a escuchar el agua bajo los puentes viejos.`;
      main.append(p);
    }
  });
  const before = await page.locator("body").innerHTML();
  const tabId = await tabIdOf(worker, baseURL);

  const reply = await worker.evaluate((id) => fitaTest.setReader(id, true), tabId);
  expect(reply.open).toBe(true);
  const view = page.locator("fita-reader");
  await expect(view).toHaveCount(1);
  // The modal dialog takes focus (its close button) away from the page.
  expect(await page.evaluate(() => document.activeElement?.localName)).toBe("fita-reader");
  expect(await page.locator("body").innerHTML()).toBe(before);

  await page.keyboard.press("Escape");
  await expect(view).toHaveCount(0);
  expect(await page.locator("body").innerHTML()).toBe(before);

  // Without an argument it toggles.
  expect((await worker.evaluate((id) => fitaTest.setReader(id), tabId)).open).toBe(true);
  expect((await worker.evaluate((id) => fitaTest.setReader(id), tabId)).open).toBe(false);
  await expect(view).toHaveCount(0);
});
