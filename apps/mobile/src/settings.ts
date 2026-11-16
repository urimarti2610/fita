import { BRAND } from "@fita/core";

/**
 * Reader-only preferences. Emphasis settings (strength, style, every) are shared
 * with the website through apps/web/src/settings/store.ts: same storage key, so the
 * installed web app and fitaread.com remember the same choices.
 */
export type Theme = "system" | "light" | "dark";
export type ReaderPrefs = {
  /** Emphasis on or off. */
  enabled: boolean;
  /** "" means the reader's normal spacing. */
  lineHeight: "" | "1.8" | "2" | "2.2";
  /** "" means the full screen width. */
  maxWidth: "" | "50ch" | "65ch" | "80ch";
  /** Index into TEXT_SIZES. */
  textSize: number;
  theme: Theme;
  /** Interface language chosen by the person; null follows the device. */
  lang: string | null;
};

/** Text size multipliers, on top of the size the device asks for. */
export const TEXT_SIZES = [1, 1.25, 1.5, 2] as const;
export const LINE_HEIGHTS = ["", "1.8", "2", "2.2"] as const;
export const WIDTHS = ["", "50ch", "65ch", "80ch"] as const;
export const THEMES: readonly Theme[] = ["system", "light", "dark"];

export const DEFAULT_PREFS: ReaderPrefs = {
  enabled: true,
  lineHeight: "",
  maxWidth: "65ch",
  textSize: 0,
  theme: "system",
  lang: null,
};

const KEY = `${BRAND.id}-reader-prefs`;

export function sanitizePrefs(raw: unknown): ReaderPrefs {
  const v = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const pick = <T>(list: readonly T[], value: unknown, fallback: T): T =>
    list.includes(value as T) ? (value as T) : fallback;
  const size = Number(v.textSize);
  return {
    enabled: typeof v.enabled === "boolean" ? v.enabled : DEFAULT_PREFS.enabled,
    lineHeight: pick(LINE_HEIGHTS, v.lineHeight, DEFAULT_PREFS.lineHeight),
    maxWidth: pick(WIDTHS, v.maxWidth, DEFAULT_PREFS.maxWidth),
    textSize:
      Number.isInteger(size) && size >= 0 && size < TEXT_SIZES.length
        ? size
        : DEFAULT_PREFS.textSize,
    theme: pick(THEMES, v.theme, DEFAULT_PREFS.theme),
    lang: typeof v.lang === "string" && /^[a-z]{2,3}$/.test(v.lang) ? v.lang : null,
  };
}

export function loadPrefs(storage: Storage | null = local()): ReaderPrefs {
  try {
    return sanitizePrefs(JSON.parse(storage?.getItem(KEY) ?? "null"));
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export function savePrefs(prefs: ReaderPrefs, storage: Storage | null = local()) {
  try {
    storage?.setItem(KEY, JSON.stringify(sanitizePrefs(prefs)));
  } catch {
    // Private mode or full storage: preferences last until the app closes.
  }
}

function local(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
