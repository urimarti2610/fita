import { describe, expect, it } from "vitest";
import { LANGS, PAGES } from "../src/i18n";
import { absolute, allPages, clip, DEFAULT_LANG, description, jsonLd, ogLocale } from "../src/seo";

describe("SEO helpers", () => {
  it("lists every page in every language with absolute URLs", () => {
    const pages = allPages();
    expect(pages).toHaveLength(PAGES.length + 1);
    for (const { urls } of pages) {
      for (const lang of LANGS) expect(urls[lang]).toMatch(/^https:\/\/fitaread\.com\/[a-z]{2}\//);
    }
    expect(absolute("es", "convert")).toBe("https://fitaread.com/es/convertir/");
    expect(LANGS).toContain(DEFAULT_LANG);
  });

  it("clips descriptions at a word boundary, unless asked for the full text", () => {
    expect(clip("uno dos tres cuatro", 12)).toBe("uno dos…");
    expect(clip("  corto  ")).toBe("corto");
    for (const lang of LANGS) {
      for (const page of [undefined, ...PAGES]) {
        const text = description(lang, page);
        expect(text.length).toBeGreaterThan(50);
        expect(text.length).toBeLessThanOrEqual(158);
      }
    }
    expect(description("en", "uses", Number.POSITIVE_INFINITY)).not.toMatch(/…$/);
  });

  it("maps every EU language to an Open Graph locale", () => {
    expect(ogLocale("ca")).toBe("ca_ES");
    expect(ogLocale("el")).toBe("el_GR");
    expect(ogLocale("xx")).toBe("xx");
  });

  it("describes the app as free, with an FAQ only on the home page", () => {
    const home = JSON.stringify(jsonLd("en"));
    expect(home).toContain('"price":"0"');
    expect(home).toContain("FAQPage");
    expect(JSON.stringify(jsonLd("en", "convert"))).not.toContain("FAQPage");
  });
});
