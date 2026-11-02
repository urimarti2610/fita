import {
  ALL_SITES_KEY,
  ALL_SITES_PATTERN,
  alwaysOnOrigins,
  applyPendingGrant,
  originPattern,
  type StateMessage,
  siteOrigin,
  updateSite,
} from "./settings.js";
import { CONTENT_CSS, CONTENT_JS, setTab } from "./tabs.js";

const AUTO_SCRIPT_ID = "auto";
const MENU_ID = "enable-site";
const COMMAND = "toggle-emphasis";

const t = (key: string) => chrome.i18n.getMessage(key);

let registration = Promise.resolve();
/**
 * Registers the content script for "always on" sites, matching the granted permissions.
 * Calls are serialized: storage events and explicit calls can overlap.
 */
export function syncRegistration(): Promise<void> {
  registration = registration.then(register, register);
  return registration;
}

async function register() {
  const { [ALL_SITES_KEY]: allSites } = await chrome.storage.sync.get(ALL_SITES_KEY);
  const origins = await alwaysOnOrigins();
  const wanted = allSites === true ? [ALL_SITES_PATTERN] : origins.map(originPattern);
  const granted: string[] = [];
  for (const pattern of wanted) {
    if (await chrome.permissions.contains({ origins: [pattern] })) granted.push(pattern);
  }
  const existing = await chrome.scripting.getRegisteredContentScripts({ ids: [AUTO_SCRIPT_ID] });
  if (existing.length > 0) {
    await chrome.scripting.unregisterContentScripts({ ids: [AUTO_SCRIPT_ID] });
  }
  if (granted.length === 0) return;
  await chrome.scripting.registerContentScripts([
    {
      id: AUTO_SCRIPT_ID,
      matches: granted,
      js: [CONTENT_JS],
      css: [CONTENT_CSS],
      runAt: "document_idle",
    },
  ]);
}

async function setupMenus() {
  if (!chrome.contextMenus) return; // e.g. Firefox for Android
  await chrome.contextMenus.removeAll();
  chrome.contextMenus.create({
    id: MENU_ID,
    title: t("contextMenuEnable"),
    contexts: ["page", "selection"],
  });
}

async function activeTab(): Promise<chrome.tabs.Tab | undefined> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

chrome.runtime.onInstalled.addListener(() => {
  setupMenus();
  syncRegistration();
});
chrome.runtime.onStartup.addListener(() => {
  syncRegistration();
});

async function onCommand(command: string, tab?: chrome.tabs.Tab) {
  if (command !== COMMAND) return;
  const target = tab?.id !== undefined ? tab : await activeTab();
  if (target?.id !== undefined) await setTab(target.id).catch(() => {});
}
chrome.commands?.onCommand.addListener(onCommand);

chrome.contextMenus?.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== MENU_ID || tab?.id === undefined) return;
  const origin = siteOrigin(tab.url);
  // Must be called first, while the click still counts as a user gesture.
  const granted = origin
    ? await chrome.permissions.request({ origins: [originPattern(origin)] }).catch(() => false)
    : false;
  if (origin && granted) await updateSite(origin, { on: true });
  await setTab(tab.id, true).catch(() => {});
});

chrome.runtime.onMessage.addListener((message: StateMessage, sender) => {
  if (message.type !== "state" || sender.tab?.id === undefined) return;
  const tabId = sender.tab.id;
  chrome.action.setBadgeText({ tabId, text: message.enabled ? t("badgeOn") : "" });
  chrome.action.setBadgeBackgroundColor?.({ tabId, color: "#1d6a72" });
});

chrome.tabs.onUpdated.addListener((tabId, change) => {
  if (change.status === "loading") chrome.action.setBadgeText({ tabId, text: "" });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync") return;
  if (Object.keys(changes).some((key) => key === ALL_SITES_KEY || key.startsWith("site:"))) {
    syncRegistration();
  }
});

chrome.permissions.onRemoved.addListener(() => {
  syncRegistration();
});

// Firefox closes the popup while the permission prompt is open, so the popup may
// never see the result: finish its pending request here.
chrome.permissions.onAdded.addListener(() => {
  applyPendingGrant();
});

// Test hook: lets the Playwright suite drive the same code paths as the UI.
if (process.env.E2E === "true") {
  Object.assign(globalThis, { fitaTest: { setTab, syncRegistration, onCommand } });
}
