/**
 * Task pane UI. Talks to the document only through Office.js; nothing is sent
 * anywhere. Settings are kept in this device's localStorage (if available).
 */
import { BRAND, MAX_STRENGTH, MIN_STRENGTH } from "@fita/core";
import { format, type Messages, messagesFor } from "./i18n.js";
import { WORD_STYLES, type WordStyle } from "./plan.js";
import {
  emphasizeDocument,
  emphasizeSelection,
  REQUIREMENT,
  removeEmphasis,
  type Settings,
} from "./word.js";

const STORAGE_KEY = `${BRAND.id}.word.settings`;
const DEFAULTS: Settings = { strength: 0.45, style: "bold" };

function loadSettings(): Settings {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Partial<Settings>;
    return {
      strength:
        typeof raw.strength === "number"
          ? Math.min(MAX_STRENGTH, Math.max(MIN_STRENGTH, raw.strength))
          : DEFAULTS.strength,
      style: WORD_STYLES.includes(raw.style as WordStyle)
        ? (raw.style as WordStyle)
        : DEFAULTS.style,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

function saveSettings(settings: Settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage blocked: settings just won't be remembered.
  }
}

function $(selector: string): HTMLElement {
  return document.querySelector(selector) as HTMLElement;
}

/** Fills every [data-i18n] element with its message. */
export function translate(root: ParentNode, t: Messages) {
  for (const el of root.querySelectorAll<HTMLElement>("[data-i18n]")) {
    const key = el.dataset.i18n as keyof Messages;
    if (key in t) el.textContent = t[key];
  }
}

export function start(t: Messages, supported: boolean) {
  document.documentElement.lang = t.lang;
  document.title = BRAND.name;
  translate(document, t);
  const status = $("#status");
  const buttons = [...document.querySelectorAll<HTMLButtonElement>("button[data-action]")];
  if (!supported) {
    status.textContent = t.unsupported;
    for (const b of buttons) b.disabled = true;
    return;
  }
  const strength = $("#strength") as HTMLInputElement;
  strength.min = String(MIN_STRENGTH);
  strength.max = String(MAX_STRENGTH);
  const settings = loadSettings();
  strength.value = String(settings.strength);
  const radio = document.querySelector<HTMLInputElement>(
    `input[name=style][value=${settings.style}]`,
  );
  if (radio) radio.checked = true;

  const current = (): Settings => {
    const style = document.querySelector<HTMLInputElement>("input[name=style]:checked")?.value;
    const next = { strength: Number(strength.value), style: (style ?? "bold") as WordStyle };
    saveSettings(next);
    return next;
  };
  const progress = (done: number, total: number) => {
    status.textContent = format(t.progress, { done, total });
  };

  for (const button of buttons) {
    button.addEventListener("click", async () => {
      for (const b of buttons) b.disabled = true;
      status.textContent = t.working;
      try {
        const action = button.dataset.action;
        const message = await Word.run(async (context) => {
          if (action === "document") {
            return format(t.done, { count: await emphasizeDocument(context, current(), progress) });
          }
          if (action === "selection") {
            const count = await emphasizeSelection(context, current(), progress);
            return count < 0 ? t.noSelection : format(t.done, { count });
          }
          await removeEmphasis(context);
          return t.removed;
        });
        status.textContent = message;
      } catch (error) {
        status.textContent = format(t.error, { message: (error as Error).message });
      } finally {
        for (const b of buttons) b.disabled = false;
      }
    });
  }
}

if (typeof Office !== "undefined") {
  Office.onReady(() => {
    start(
      messagesFor(Office.context.displayLanguage),
      Office.context.requirements.isSetSupported(REQUIREMENT.set, REQUIREMENT.version),
    );
  });
}
