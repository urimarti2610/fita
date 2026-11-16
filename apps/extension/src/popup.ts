import { DEFAULT_STYLE, type EmphasisStyle } from "@fita/core";
import type { RulerMode } from "./ruler.js";
import {
  ALL_SITES_KEY,
  ALL_SITES_PATTERN,
  type ContentMessage,
  loadSiteState,
  originPattern,
  requestGrant,
  type Settings,
  type SiteState,
  type SpeechStateMessage,
  saveSettings,
  siteOrigin,
  updateSite,
} from "./settings.js";
import {
  langBase,
  loadSpeech,
  localVoices,
  type SpeechSettings,
  type SpeechState,
  saveSpeech,
} from "./speech.js";
import { getTabState, setReader, setTab, speakTab } from "./tabs.js";

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
const ruler = $<HTMLSelectElement>("ruler");
const custom = $<HTMLInputElement>("custom");
const shortcuts = $<HTMLAnchorElement>("shortcuts");
const readingMode = $<HTMLButtonElement>("readingMode");
const readerStatus = $<HTMLParagraphElement>("readerStatus");
const speechPlay = $<HTMLButtonElement>("speechPlay");
const speechStop = $<HTMLButtonElement>("speechStop");
const speechStatus = $<HTMLParagraphElement>("speechStatus");
const speechRate = $<HTMLInputElement>("speechRate");
const speechRateValue = $<HTMLOutputElement>("speechRateValue");
const speechVoice = $<HTMLSelectElement>("speechVoice");
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
    ruler: ruler.value as RulerMode,
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
  ruler.value = s.ruler;
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

let speech: SpeechSettings;
let speechState: SpeechState = { status: "idle", lang: "" };
let pageLang = "";

function renderSpeech() {
  const { status, error } = speechState;
  speechPlay.textContent =
    status === "playing"
      ? t("speechPause")
      : status === "paused"
        ? t("speechResume")
        : t("speechPlay");
  speechStop.disabled = status === "idle";
  const messages = {
    noVoice: "speechNoVoice",
    noText: "speechNoText",
    unsupported: "speechUnsupported",
  } as const;
  speechStatus.textContent = error
    ? t(messages[error])
    : status === "playing"
      ? t("speechReading")
      : status === "paused"
        ? t("speechPaused")
        : t("speechHint");
  speechRate.value = String(speech.rate);
  speechRateValue.textContent = `${speech.rate.toFixed(1)}×`;
}

/** On-device voices only, the page's language first. */
function renderVoices() {
  const voices = localVoices(globalThis.speechSynthesis?.getVoices() ?? []);
  const base = langBase(pageLang);
  const chosen = speech.voices[base] ?? "";
  const names = new Intl.DisplayNames([chrome.i18n.getUILanguage()], { type: "language" });
  const languageName = (lang: string) => {
    try {
      return names.of(lang) ?? lang;
    } catch {
      return lang;
    }
  };
  const option = (value: string, label: string) => {
    const el = document.createElement("option");
    el.value = value;
    el.textContent = label;
    return el;
  };
  const group = (label: string, list: SpeechSynthesisVoice[], withLang: boolean) => {
    const el = document.createElement("optgroup");
    el.label = label;
    for (const v of list)
      el.append(option(v.voiceURI, withLang ? `${v.name} (${languageName(v.lang)})` : v.name));
    return el;
  };
  const same = voices.filter((v) => langBase(v.lang) === base);
  const others = voices
    .filter((v) => langBase(v.lang) !== base)
    .sort((a, b) => a.lang.localeCompare(b.lang) || a.name.localeCompare(b.name));
  speechVoice.replaceChildren(option("", t("voiceAuto")));
  if (same.length > 0) speechVoice.append(group(languageName(pageLang || base), same, false));
  if (others.length > 0) speechVoice.append(group(t("voiceOther"), others, true));
  speechVoice.value = voices.some((v) => v.voiceURI === chosen) ? chosen : "";
}

async function speechAction() {
  if (tabId === undefined) return;
  const action =
    speechState.status === "playing"
      ? "pause"
      : speechState.status === "paused"
        ? "resume"
        : "play";
  try {
    speechState = (await speakTab(tabId, action)) ?? speechState;
  } catch {
    showUnavailable();
  }
  renderSpeech();
}

async function setupSpeech() {
  speech = await loadSpeech();
  if (!globalThis.speechSynthesis) {
    speechState = { status: "idle", lang: "", error: "unsupported" };
    speechPlay.disabled = true;
    readingMode.disabled = true;
    speechRate.disabled = true;
    speechVoice.disabled = true;
    renderSpeech();
    return;
  }
  const known = tabId === undefined ? null : await speakTab(tabId, "state");
  if (known) speechState = known;
  pageLang = known?.lang || (await tabLanguage()) || chrome.i18n.getUILanguage();
  renderSpeech();
  renderVoices();
  speechSynthesis.addEventListener("voiceschanged", renderVoices);
  chrome.runtime.onMessage.addListener((message: SpeechStateMessage, sender) => {
    if (message.type !== "speech-state" || sender.tab?.id !== tabId) return;
    speechState = message.state;
    renderSpeech();
  });
}

/** The page's declared language, read without injecting the content script. */
async function tabLanguage(): Promise<string> {
  if (tabId === undefined) return "";
  try {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => document.documentElement.lang,
    });
    return typeof result?.result === "string" ? result.result : "";
  } catch {
    return "";
  }
}

readingMode.addEventListener("click", async () => {
  if (tabId === undefined) return;
  const reply = await setReader(tabId, true).catch(() => null);
  if (reply?.open) window.close();
  else readerStatus.textContent = t(reply ? "readerNoArticle" : "unavailable");
});

speechPlay.addEventListener("click", () => speechAction());
speechStop.addEventListener("click", async () => {
  if (tabId === undefined) return;
  speechState = (await speakTab(tabId, "stop").catch(() => null)) ?? speechState;
  renderSpeech();
});
speechRate.addEventListener("input", () => {
  speech.rate = Number(speechRate.value);
  speechRateValue.textContent = `${speech.rate.toFixed(1)}×`;
});
speechRate.addEventListener("change", () => saveSpeech(speech));
speechVoice.addEventListener("change", () => {
  const base = langBase(pageLang);
  if (speechVoice.value) speech.voices[base] = speechVoice.value;
  else delete speech.voices[base];
  saveSpeech(speech);
});

function showUnavailable() {
  unavailable.hidden = false;
  toggle.disabled = true;
  alwaysOn.disabled = true;
  speechPlay.disabled = true;
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
for (const el of [...styleInputs, every, lineHeight, maxWidth, ruler]) {
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
  await Promise.all([setupShortcutHint(), setupSpeech()]);
}

init();
