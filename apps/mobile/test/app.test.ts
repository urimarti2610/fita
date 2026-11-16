import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { detectFormat } from "../src/formats.js";
import { format, LANGS, loadStrings, pickLang } from "../src/i18n.js";
import {
  bookProgress,
  createLibrary,
  memoryBackend,
  sanitizePosition,
  titleFromName,
} from "../src/library.js";
import { nameFromUrl } from "../src/native.js";
import { DEFAULT_PREFS, loadPrefs, sanitizePrefs, savePrefs } from "../src/settings.js";

const bytes = (s: string) => new TextEncoder().encode(s);

describe("detectFormat", () => {
  it("uses the extension, then the MIME type, then the content", () => {
    expect(detectFormat("Llibre.EPUB")).toBe("epub");
    expect(detectFormat("notes.markdown")).toBe("md");
    expect(detectFormat("1234", "text/html; charset=utf-8")).toBe("html");
    expect(detectFormat("1234", "", new Uint8Array([0x50, 0x4b, 3, 4, 0]))).toBe("epub");
    expect(detectFormat("1234", "", bytes('<?xml version="1.0"?>\n<html>'))).toBe("html");
    expect(detectFormat("1234", "", bytes("Hola, món"))).toBe("txt");
    expect(detectFormat("1234", "", new Uint8Array([1, 0, 2]))).toBeNull();
    expect(detectFormat("photo.jpg")).toBeNull();
  });
});

describe("library", () => {
  it("adds, lists, remembers the position and removes books", async () => {
    const library = createLibrary(memoryBackend(), localStorage);
    const { record, saved } = await library.add(new Blob(["Text"]), {
      title: "Primer",
      format: "txt",
    });
    expect(saved).toBe(true);
    await new Promise((r) => setTimeout(r, 2));
    const second = await library.add(new Blob(["Més"]), { title: "Segon", format: "md" });
    expect((await library.list()).map((b) => b.title)).toEqual(["Segon", "Primer"]);

    await library.touch(record, "Títol real");
    expect((await library.list())[0]?.title).toBe("Títol real");
    expect(await (await library.get(record.id))?.file.text()).toBe("Text");

    library.savePosition(record.id, { chapter: 2, offset: 0.5, progress: 0.25 });
    expect(library.position(record.id)).toEqual({ chapter: 2, offset: 0.5, progress: 0.25 });

    await library.remove(record.id);
    expect(library.position(record.id)).toBeNull();
    expect((await library.list()).map((b) => b.id)).toEqual([second.record.id]);
  });

  it("keeps books readable in memory when the device storage fails", async () => {
    const failing = {
      ...memoryBackend(),
      put: () => Promise.reject(new Error("quota")),
      list: () => Promise.reject(new Error("blocked")),
    };
    const library = createLibrary(failing, null);
    const { record, saved } = await library.add(new Blob(["x"]), { title: "T", format: "txt" });
    expect(saved).toBe(false);
    expect((await library.get(record.id))?.record.title).toBe("T");
    expect((await library.list()).map((b) => b.id)).toEqual([record.id]);
  });

  it("validates stored positions and computes progress", () => {
    expect(sanitizePosition({ chapter: 1, offset: 2, progress: -1 })).toEqual({
      chapter: 1,
      offset: 1,
      progress: 0,
    });
    expect(sanitizePosition({ chapter: -1 })).toBeNull();
    expect(sanitizePosition("x")).toBeNull();
    expect(bookProgress(1, 0.5, 4)).toBe(0.375);
    expect(bookProgress(0, 0, 0)).toBe(0);
  });

  it("derives titles from file names and content URLs", () => {
    expect(titleFromName("/sdcard/Download/El_meu_llibre.epub")).toBe("El meu llibre");
    expect(
      nameFromUrl("content://com.android.providers/document/primary%3ADownload%2Fllibre.epub"),
    ).toBe("llibre.epub");
  });
});

describe("settings", () => {
  it("accepts only valid preferences", () => {
    expect(sanitizePrefs(null)).toEqual(DEFAULT_PREFS);
    expect(
      sanitizePrefs({
        enabled: false,
        lineHeight: "2",
        maxWidth: "999px",
        textSize: 3,
        theme: "dark",
        lang: "ca",
      }),
    ).toEqual({
      ...DEFAULT_PREFS,
      enabled: false,
      lineHeight: "2",
      textSize: 3,
      theme: "dark",
      lang: "ca",
    });
    expect(sanitizePrefs({ textSize: 9, theme: "neon", lang: "<script>" })).toEqual(DEFAULT_PREFS);
  });

  it("round-trips through storage", () => {
    savePrefs({ ...DEFAULT_PREFS, theme: "light" }, localStorage);
    expect(loadPrefs(localStorage).theme).toBe("light");
  });
});

describe("i18n", () => {
  it("has app strings for every language of the website", () => {
    const web = readdirSync(resolve(process.cwd(), "../web/src/locales"))
      .map((f) => f.replace(/\.ts$/, ""))
      .sort();
    expect(LANGS).toEqual(web);
  });

  it("picks the device language, falling back to English", () => {
    expect(pickLang(["ca-ES", "es"])).toBe("ca");
    expect(pickLang(["pt-BR"])).toBe("pt");
    expect(pickLang(["ja-JP"])).toBe("en");
  });

  it("loads the website's and the app's strings together", async () => {
    for (const lang of LANGS) {
      const t = await loadStrings(lang);
      expect(t.demo.strength, lang).toBeTruthy();
      expect(t.app.reader.sizes, lang).toHaveLength(4);
      expect(t.app.library.progress, lang).toContain("{n}");
      expect(t.app.reader.position, lang).toMatch(/\{n\}.*\{total\}|\{total\}.*\{n\}/);
    }
    expect(format("{n} de {total}", { n: 1, total: 3 })).toBe("1 de 3");
  });

  it("never mentions the trademark or promises speed", async () => {
    for (const lang of LANGS) {
      const json = JSON.stringify((await loadStrings(lang)).app).toLowerCase();
      expect(json, lang).not.toContain("bionic");
    }
  });
});
