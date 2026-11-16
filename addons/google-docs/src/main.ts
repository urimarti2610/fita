/**
 * Apps Script entry points. The build bundles this file (and @fita/core) into one
 * script and exposes these functions as globals, which is how Apps Script finds menu
 * handlers and `google.script.run` targets.
 */
import { BRAND } from "@fita/core";
import * as docs from "./docs.js";
import { format, messagesFor } from "./i18n.js";
import { parseSettings, type Settings } from "./plan.js";
import { ensureSegmenter } from "./segmenter-fallback.js";
import { sidebarHtml } from "./sidebar.js";

ensureSegmenter();

// The few Apps Script services used, declared here instead of pulling in a types package.
declare const DocumentApp: {
  getActiveDocument(): docs.Doc;
  getUi(): {
    createAddonMenu(): AddonMenu;
    showSidebar(html: unknown): void;
    alert(message: string): unknown;
  };
  ElementType: { TEXT: unknown };
};
type AddonMenu = {
  addItem(caption: string, fn: string): AddonMenu;
  addSeparator(): AddonMenu;
  addToUi(): void;
};
declare const HtmlService: {
  createHtmlOutput(html: string): { setTitle(title: string): unknown };
};
declare const PropertiesService: {
  getUserProperties(): {
    getProperty(key: string): string | null;
    setProperty(key: string, value: string): unknown;
  };
};
declare const Session: { getActiveUserLocale(): string };

const SETTINGS_KEY = `${BRAND.id}.settings`;

function locale(): string {
  try {
    return Session.getActiveUserLocale() || "en";
  } catch {
    return "en";
  }
}

function loadSettings(): Settings {
  try {
    const raw = PropertiesService.getUserProperties().getProperty(SETTINGS_KEY);
    return parseSettings(raw ? JSON.parse(raw) : {});
  } catch {
    return parseSettings({});
  }
}

/** Calls from the sidebar carry `source: "sidebar"`; menu items pass nothing or an event. */
function fromSidebar(raw: unknown): boolean {
  return !!raw && typeof raw === "object" && (raw as { source?: unknown }).source === "sidebar";
}

/** Settings from the sidebar are saved; menu items reuse the last saved ones. */
function useSettings(raw: unknown): Settings {
  if (!fromSidebar(raw)) return loadSettings();
  const settings = parseSettings(raw);
  PropertiesService.getUserProperties().setProperty(SETTINGS_KEY, JSON.stringify(settings));
  return settings;
}

/** Shows the result: as the sidebar status (returned) or as an alert when run from the menu. */
function report(message: string, raw: unknown): string {
  if (!fromSidebar(raw)) DocumentApp.getUi().alert(message);
  return message;
}

export function onOpen() {
  const t = messagesFor(locale());
  DocumentApp.getUi()
    .createAddonMenu()
    .addItem(t.menuDocument, "emphasizeDocument")
    .addItem(t.menuSelection, "emphasizeSelection")
    .addItem(t.menuRemove, "removeEmphasis")
    .addSeparator()
    .addItem(t.menuSettings, "showSidebar")
    .addToUi();
}

export function onInstall() {
  onOpen();
}

export function showSidebar() {
  const lang = locale();
  const html = sidebarHtml(messagesFor(lang), loadSettings(), lang.split(/[-_]/)[0] ?? "en");
  DocumentApp.getUi().showSidebar(HtmlService.createHtmlOutput(html).setTitle(BRAND.name));
}

export function emphasizeDocument(raw?: unknown): string {
  const t = messagesFor(locale());
  const count = docs.emphasizeDocument(
    DocumentApp.getActiveDocument(),
    useSettings(raw),
    DocumentApp.ElementType.TEXT,
  );
  return report(format(t.done, { count }), raw);
}

export function emphasizeSelection(raw?: unknown): string {
  const t = messagesFor(locale());
  const count = docs.emphasizeSelection(
    DocumentApp.getActiveDocument(),
    useSettings(raw),
    DocumentApp.ElementType.TEXT,
  );
  const message = count < 0 ? t.noSelection : format(t.done, { count });
  return report(message, raw);
}

export function removeEmphasis(raw?: unknown): string {
  const t = messagesFor(locale());
  docs.removeEmphasis(DocumentApp.getActiveDocument());
  return report(t.removed, raw);
}
