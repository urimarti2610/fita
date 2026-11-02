import {
  BRAND,
  DEFAULT_OPTIONS,
  DEFAULT_STYLE,
  EMPHASIS_STYLES,
  type EmphasisStyle,
  MAX_STRENGTH,
  MIN_STRENGTH,
} from "@fita/core";

/**
 * Reading settings shared by every tool on the site (demo, worksheets, converter)
 * and the floating settings bubble. Stored only in this browser.
 */
export type ReadingSettings = { strength: number; every: number; style: EmphasisStyle };
export type Preset = { name: string; settings: ReadingSettings };

const SETTINGS_KEY = `${BRAND.id}-reading-settings`;
const PRESETS_KEY = `${BRAND.id}-presets`;
/** Fired on window when the settings change; `detail.source` is who changed them. */
export const SETTINGS_EVENT = `${BRAND.id}:settings`;

export const DEFAULT_SETTINGS: ReadingSettings = {
  strength: DEFAULT_OPTIONS.strength,
  every: DEFAULT_OPTIONS.every,
  style: DEFAULT_STYLE,
};

/** Accepts only well-formed values: storage can hold anything. */
export function sanitize(raw: unknown): ReadingSettings {
  const value = (raw ?? {}) as Partial<Record<keyof ReadingSettings, unknown>>;
  const strength = Number(value.strength);
  const every = Number(value.every);
  return {
    strength:
      Number.isFinite(strength) && strength >= MIN_STRENGTH && strength <= MAX_STRENGTH
        ? strength
        : DEFAULT_SETTINGS.strength,
    every: [1, 2, 3].includes(every) ? every : DEFAULT_SETTINGS.every,
    style: EMPHASIS_STYLES.includes(value.style as EmphasisStyle)
      ? (value.style as EmphasisStyle)
      : DEFAULT_SETTINGS.style,
  };
}

function read<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode or storage disabled: settings still apply until the page closes.
  }
}

export function loadSettings(): ReadingSettings {
  return sanitize(read(SETTINGS_KEY, DEFAULT_SETTINGS));
}

export function saveSettings(settings: ReadingSettings, source?: unknown) {
  const clean = sanitize(settings);
  write(SETTINGS_KEY, clean);
  window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: { settings: clean, source } }));
}

export function loadPresets(): Preset[] {
  const raw = read<unknown>(PRESETS_KEY, []);
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((p) => p && typeof p.name === "string" && p.name.trim())
    .map((p) => ({ name: String(p.name).trim().slice(0, 60), settings: sanitize(p.settings) }));
}

export function savePresets(presets: Preset[]) {
  write(PRESETS_KEY, presets);
}
