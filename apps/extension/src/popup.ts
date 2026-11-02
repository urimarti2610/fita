import { DEFAULT_STYLE, type EmphasisStyle } from "@fita/core";
import {
  ALL_SITES_KEY,
  ALL_SITES_PATTERN,
  type ContentMessage,
  loadSiteState,
  originPattern,
  requestGrant,
  type Settings,
  type SiteState,
  saveSettings,
  siteOrigin,
  updateSite,
} from "./settings.js";
import { getTabState, setTab } from "./tabs.js";

const t = (key: string, subs?: string) => chrome.i18n.getMessage(key, subs);
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const toggle = $<HTMLButtonElement>("toggle");
const status = $<HTMLParagraphElement>("status");
const unavailable = $<HTMLParagraphElement>("unavailable");
const alwaysOn = $<HTMLInputElement>("alwaysOn");
const allSites = $<HTMLInputElement>("allSites");
const strength = $<HTMLInputElement>("strength");
const strengthValue = $<HTMLOutputElement>("strengthValue");
const every = $<HTMLSelectElement>("every");
const lineHeight = $<HTMLSelectElement>("lineHeight");
const maxWidth = $<HTMLSelectElement>("maxWidth");
const custom = $<HTMLInputElement>("custom");
const shortcuts = $<HTMLAnchorElement>("shortcuts");
const styleInputs = [...document.querySelectorAll<HTMLInputElement>('input[name="style"]')];

document.documentElement.lang = chrome.i18n.getUILanguage();
for (const el of document.querySelectorAll<HTMLElement>("[data-i18n]")) {
  el.textContent = t(el.dataset.i18n as string);
}

let tabId: number | undefined;
let origin: string | null = null;
let state: SiteState;
let enabled = false;

function readSettings(): Settings {
  return {
    strength: Number(strength.value),
    style: (styleInputs.find((i) => i.checked)?.value ?? DEFAULT_STYLE) as EmphasisStyle,
    every: Number(every.value),
    lineHeight: Number(lineHeight.value),
    maxWidth: Number(maxWidth.value),
  };
}

function render() {
  toggle.setAttribute("aria-checked", String(enabled));
  status.textContent = enabled ? t("statusOn") : t("statusOff");
  const s = state.settings;
  strength.value = String(s.strength);
  strengthValue.textContent = `${Math.round(s.strength * 100)} %`;
  for (const input of styleInputs) input.checked = input.value === s.style;
  every.value = String(s.every);
  lineHeight.value = String(s.lineHeight);
  maxWidth.value = String(s.maxWidth);
  alwaysOn.checked = state.alwaysOn;
  allSites.checked = state.allSites;
  custom.checked = state.custom;
  alwaysOn.disabled = origin === null;
  custom.disabled = origin === null;
}

function preview(settings: Settings) {
  if (tabId === undefined || !enabled) return;
  const message: ContentMessage = { type: "preview", settings };
  chrome.tabs.sendMessage(tabId, message).catch(() => {});
}

async function onSettingsInput(save: boolean) {
  state.settings = readSettings();
  strengthValue.textContent = `${Math.round(state.settings.strength * 100)} %`;
  preview(state.settings);
  if (save) await saveSettings(origin, state.custom, state.settings);
}

async function setEnabled(wanted?: boolean) {
  if (tabId === undefined) return;
  try {
    enabled = (await setTab(tabId, wanted)).enabled;
  } catch {
    showUnavailable();
  }
  render();
}

function showUnavailable() {
  unavailable.hidden = false;
  toggle.disabled = true;
  alwaysOn.disabled = true;
}

toggle.addEventListener("click", () => setEnabled());

alwaysOn.addEventListener("change", async () => {
  if (!origin) return;
  if (alwaysOn.checked) {
    const granted = await requestGrant({ kind: "site", origin });
    if (!granted) {
      alwaysOn.checked = false;
      status.textContent = t("permissionDenied");
      return;
    }
    state.alwaysOn = true;
    await setEnabled(true);
  } else {
    state.alwaysOn = false;
    await updateSite(origin, { on: false });
    if (!state.allSites) await chrome.permissions.remove({ origins: [originPattern(origin)] });
  }
});

allSites.addEventListener("change", async () => {
  if (allSites.checked) {
    const granted = await requestGrant({ kind: "all" });
    if (!granted) {
      allSites.checked = false;
      status.textContent = t("permissionDenied");
      return;
    }
    state.allSites = true;
    await setEnabled(true);
  } else {
    state.allSites = false;
    await chrome.storage.sync.remove(ALL_SITES_KEY);
    await chrome.permissions.remove({ origins: [ALL_SITES_PATTERN] });
  }
});

strength.addEventListener("input", () => onSettingsInput(false));
strength.addEventListener("change", () => onSettingsInput(true));
for (const el of [...styleInputs, every, lineHeight, maxWidth]) {
  el.addEventListener("change", () => onSettingsInput(true));
}

custom.addEventListener("change", async () => {
  if (!origin) return;
  if (custom.checked) {
    await updateSite(origin, { settings: readSettings() });
  } else {
    await updateSite(origin, { settings: undefined });
  }
  state = await loadSiteState(origin);
  render();
  preview(state.settings);
});

async function setupShortcutHint() {
  const commands = await chrome.commands?.getAll?.().catch(() => []);
  const shortcut = commands?.find((c) => c.name === "toggle-emphasis")?.shortcut;
  if (!commands) {
    shortcuts.hidden = true;
    return;
  }
  shortcuts.textContent = shortcut ? t("shortcutHint", shortcut) : t("shortcutNone");
  shortcuts.addEventListener("click", (event) => {
    event.preventDefault();
    const firefox = chrome.commands as unknown as { openShortcutSettings?: () => Promise<void> };
    if (firefox.openShortcutSettings) firefox.openShortcutSettings();
    else chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
  });
}

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  tabId = tab?.id;
  origin = siteOrigin(tab?.url);
  state = await loadSiteState(origin);
  if (tabId !== undefined) enabled = (await getTabState(tabId))?.enabled ?? false;
  if (tabId === undefined) showUnavailable();
  render();
  await setupShortcutHint();
}

init();
