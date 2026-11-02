// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_SETTINGS,
  loadPresets,
  loadSettings,
  SETTINGS_EVENT,
  sanitize,
  savePresets,
  saveSettings,
} from "../src/settings/store.js";

beforeEach(() => localStorage.clear());

describe("reading settings store", () => {
  it("defaults to the core defaults", () => {
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
    expect(DEFAULT_SETTINGS).toEqual({ strength: 0.45, every: 1, style: "bold-fade" });
  });

  it("saves, reloads and notifies listeners", () => {
    const listener = vi.fn();
    window.addEventListener(SETTINGS_EVENT, listener);
    const source = {};
    saveSettings({ strength: 0.3, every: 2, style: "underline" }, source);
    expect(loadSettings()).toEqual({ strength: 0.3, every: 2, style: "underline" });
    const event = listener.mock.calls[0]?.[0] as CustomEvent;
    expect(event.detail.source).toBe(source);
    window.removeEventListener(SETTINGS_EVENT, listener);
  });

  it("rejects malformed stored values", () => {
    expect(sanitize({ strength: 9, every: 7, style: "comic-sans" })).toEqual(DEFAULT_SETTINGS);
    expect(sanitize(null)).toEqual(DEFAULT_SETTINGS);
    localStorage.setItem("fita-reading-settings", "{not json");
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it("keeps presets, dropping broken ones", () => {
    savePresets([{ name: "  Clase  ", settings: { strength: 0.5, every: 1, style: "bold" } }]);
    localStorage.setItem(
      "fita-presets",
      JSON.stringify([
        ...JSON.parse(localStorage.getItem("fita-presets") ?? "[]"),
        { name: "" },
        "junk",
        { name: "Sin ajustes" },
      ]),
    );
    expect(loadPresets()).toEqual([
      { name: "Clase", settings: { strength: 0.5, every: 1, style: "bold" } },
      { name: "Sin ajustes", settings: DEFAULT_SETTINGS },
    ]);
    localStorage.setItem("fita-presets", '{"x":1}');
    expect(loadPresets()).toEqual([]);
  });
});
