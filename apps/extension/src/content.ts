import { applyToElement, type Controller, STYLE_ATTRIBUTE } from "@fita/core";
import { EXTENSION_BRAND } from "../brand.js";
import {
  type ContentMessage,
  type ContentReply,
  loadSiteState,
  type Settings,
  type StateMessage,
  siteOrigin,
} from "./settings.js";

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

  function applyPageStyles(settings: Settings) {
    html.setAttribute(STYLE_ATTRIBUTE, settings.style);
    toggleVar(LINE_HEIGHT_ATTR, LINE_HEIGHT_VAR, settings.lineHeight, String(settings.lineHeight));
    toggleVar(MAX_WIDTH_ATTR, MAX_WIDTH_VAR, settings.maxWidth, `${settings.maxWidth}ch`);
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

  chrome.runtime.onMessage.addListener(
    (message: ContentMessage, _sender, sendResponse: (reply: ContentReply) => void) => {
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
  chrome.storage.onChanged.addListener((_changes, area) => {
    if (area === "sync" && controller) enable();
  });

  // Auto-activation for "always on this site" / "on all sites".
  loadSiteState(origin).then((state) => {
    if (controller === null && (state.alwaysOn || state.allSites)) apply(state.settings);
  });
}
