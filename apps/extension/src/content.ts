import { applyToElement, type Controller, STYLE_ATTRIBUTE } from "@fita/core";
import { EXTENSION_BRAND } from "../brand.js";
import { createRuler } from "./ruler.js";
import {
  type ContentMessage,
  type ContentReply,
  loadSiteState,
  type Settings,
  type SpeechMessage,
  type SpeechStateMessage,
  type StateMessage,
  siteOrigin,
} from "./settings.js";
import {
  createReader,
  DEFAULT_SPEECH,
  loadSpeech,
  SPEECH_HIGHLIGHT,
  SPEECH_KEY,
  type SpeechAction,
  type SpeechSettings,
  type SpeechState,
} from "./speech.js";

const LOADED_FLAG = `__${EXTENSION_BRAND.id}ContentLoaded`;
const LINE_HEIGHT_ATTR = `data-${EXTENSION_BRAND.id}-lh`;
const MAX_WIDTH_ATTR = `data-${EXTENSION_BRAND.id}-mw`;
const LINE_HEIGHT_VAR = `--${EXTENSION_BRAND.id}-lh`;
const MAX_WIDTH_VAR = `--${EXTENSION_BRAND.id}-mw`;

const scope = globalThis as unknown as Record<string, boolean>;
if (!scope[LOADED_FLAG]) {
  scope[LOADED_FLAG] = true;
  main();
}

function main() {
  const html = document.documentElement;
  const origin = siteOrigin(location.href);
  let controller: Controller | null = null;
  let applied = "";
  const ruler = createRuler(document);

  function applyPageStyles(settings: Settings) {
    html.setAttribute(STYLE_ATTRIBUTE, settings.style);
    toggleVar(LINE_HEIGHT_ATTR, LINE_HEIGHT_VAR, settings.lineHeight, String(settings.lineHeight));
    toggleVar(MAX_WIDTH_ATTR, MAX_WIDTH_VAR, settings.maxWidth, `${settings.maxWidth}ch`);
    ruler.set(settings.ruler);
  }

  function toggleVar(attr: string, variable: string, value: number, css: string) {
    if (value > 0) {
      html.setAttribute(attr, "");
      html.style.setProperty(variable, css);
    } else {
      html.removeAttribute(attr);
      html.style.removeProperty(variable);
    }
  }

  function apply(settings: Settings) {
    const key = JSON.stringify(settings);
    if (controller && key === applied) return;
    applied = key;
    applyPageStyles(settings);
    const options = { strength: settings.strength, every: settings.every };
    if (controller) controller.update(options);
    else controller = applyToElement(document.body, options, { injectStyles: false });
    report(true);
  }

  function disable() {
    controller?.undo();
    controller = null;
    applied = "";
    ruler.set("off");
    for (const attr of [STYLE_ATTRIBUTE, LINE_HEIGHT_ATTR, MAX_WIDTH_ATTR])
      html.removeAttribute(attr);
    html.style.removeProperty(LINE_HEIGHT_VAR);
    html.style.removeProperty(MAX_WIDTH_VAR);
    if (html.getAttribute("style") === "") html.removeAttribute("style");
    report(false);
  }

  function report(enabled: boolean) {
    const message: StateMessage = { type: "state", enabled };
    chrome.runtime.sendMessage(message).catch(() => {});
  }

  async function enable() {
    apply((await loadSiteState(origin)).settings);
  }

  const speech = createSpeech();

  chrome.runtime.onMessage.addListener(
    (
      message: ContentMessage | SpeechMessage,
      _sender,
      sendResponse: (reply: ContentReply | SpeechState) => void,
    ) => {
      if (message.type === "speech") {
        speech(message.action).then(sendResponse);
        return true; // async response
      }
      if (message.type === "get") {
        sendResponse({ enabled: controller !== null });
        return;
      }
      if (message.type === "preview") {
        if (controller) apply(message.settings);
        sendResponse({ enabled: controller !== null });
        return;
      }
      const wanted = message.enabled ?? controller === null;
      if (!wanted) {
        disable();
        sendResponse({ enabled: false });
        return;
      }
      enable().then(() => sendResponse({ enabled: true }));
      return true; // async response
    },
  );

  // Settings changed elsewhere (popup, another device): follow them while active.
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync" || !controller) return;
    if (Object.keys(changes).some((key) => key !== SPEECH_KEY)) enable();
  });

  // Auto-activation for "always on this site" / "on all sites".
  loadSiteState(origin).then((state) => {
    if (controller === null && (state.alwaysOn || state.allSites)) apply(state.settings);
  });
}

/** Read aloud with the browser's own voices. */
function createSpeech(): (action: SpeechAction) => Promise<SpeechState> {
  const synth = globalThis.speechSynthesis as SpeechSynthesis | undefined;
  let settings: SpeechSettings = DEFAULT_SPEECH;
  let reader: ReturnType<typeof createReader> | null = null;
  const registry = (globalThis.CSS as { highlights?: HighlightRegistry } | undefined)?.highlights;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

  function highlight(range: Range | null) {
    try {
      if (range) registry?.set(SPEECH_HIGHLIGHT, new Highlight(range));
      else registry?.delete(SPEECH_HIGHLIGHT);
    } catch {
      // Highlight API missing or blocked: reading still works, without marking words.
    }
  }

  function reveal(range: Range) {
    const rect = range.getBoundingClientRect();
    if (rect.height === 0 || (rect.top >= 0 && rect.bottom <= innerHeight)) return;
    range.startContainer.parentElement?.scrollIntoView({
      block: "center",
      behavior: reducedMotion.matches ? "auto" : "smooth",
    });
  }

  function waitForVoices(): Promise<void> {
    if (!synth || synth.getVoices().length > 0) return Promise.resolve();
    return new Promise((resolve) => {
      const done = () => {
        synth.removeEventListener("voiceschanged", done);
        resolve();
      };
      synth.addEventListener("voiceschanged", done);
      setTimeout(done, 1500);
    });
  }

  function report(state: SpeechState) {
    const message: SpeechStateMessage = { type: "speech-state", state };
    chrome.runtime.sendMessage(message).catch(() => {});
  }

  if (synth) {
    reader = createReader(document, {
      synth,
      createUtterance: (text) => new SpeechSynthesisUtterance(text),
      settings: () => settings,
      highlight,
      reveal,
      onState: report,
      waitForVoices,
    });
    // Some browsers keep talking after the page is gone.
    addEventListener("pagehide", () => reader?.stop());
    chrome.storage.onChanged.addListener(async (changes, area) => {
      if (area === "sync" && SPEECH_KEY in changes) settings = await loadSpeech();
    });
  }

  return async (action) => {
    if (!reader)
      return { status: "idle", lang: document.documentElement.lang, error: "unsupported" };
    if (action === "play" || (action === "toggle" && reader.state.status === "idle")) {
      settings = await loadSpeech();
      await reader.play();
    } else if (action === "toggle") reader.toggle();
    else if (action === "pause") reader.pause();
    else if (action === "resume") reader.resume();
    else if (action === "stop") reader.stop();
    return reader.state;
  };
}
