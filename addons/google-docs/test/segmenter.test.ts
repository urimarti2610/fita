import { createEmphasizer } from "@fita/core";
import { describe, expect, it } from "vitest";
import { ensureSegmenter, FallbackSegmenter } from "../src/segmenter-fallback.js";

const SAMPLES = [
  "Reading is more comfortable, your way.",
  "La col·lecció de l'àvia d'una amiga.",
  "Zażółć gęślą jaźń. Привет, мир! Καλημέρα κόσμε.",
  "Version 3.14 costs 1,000 euros.",
  "Cafe\u{301} 👍🏽 family 👨‍👩‍👧 flag 🇪🇸 done",
  "مرحبا بالعالم שלום עולם",
  "line\r\nbreak",
];

function words(
  segmenter: { segment(s: string): Iterable<{ segment: string; isWordLike?: boolean }> },
  text: string,
) {
  return [...segmenter.segment(text)].filter((s) => s.isWordLike).map((s) => s.segment);
}
function graphemes(segmenter: { segment(s: string): Iterable<{ segment: string }> }, text: string) {
  return [...segmenter.segment(text)].map((s) => s.segment);
}

describe("FallbackSegmenter", () => {
  it.each(SAMPLES)("finds the same words as Intl.Segmenter: %s", (text) => {
    const native = new Intl.Segmenter("en", { granularity: "word" });
    const fallback = new FallbackSegmenter("en", { granularity: "word" });
    expect(words(fallback, text)).toEqual(words(native, text));
  });

  it.each(SAMPLES)("finds the same graphemes as Intl.Segmenter: %s", (text) => {
    const native = new Intl.Segmenter("en", { granularity: "grapheme" });
    const fallback = new FallbackSegmenter(["en"]);
    expect(graphemes(fallback, text)).toEqual(graphemes(native, text));
  });

  it("keeps every character, in order", () => {
    const text = SAMPLES.join(" — ");
    const fallback = new FallbackSegmenter(undefined, { granularity: "word" });
    expect(graphemes(fallback, text).join("")).toBe(text);
    expect(fallback.resolvedOptions()).toEqual({ locale: "en", granularity: "word" });
  });

  it("produces the same emphasis as the native segmenter", () => {
    const intl = { Segmenter: undefined as unknown };
    expect(ensureSegmenter(intl)).toBe(true);
    expect(ensureSegmenter(intl)).toBe(false);
    const text = SAMPLES.join(" ");
    const native = createEmphasizer({ locale: "en" })(text);
    const original = Intl.Segmenter;
    try {
      (Intl as { Segmenter: unknown }).Segmenter = FallbackSegmenter;
      // A locale the core has not cached yet, so it builds segmenters with the fallback.
      expect(createEmphasizer({ locale: "x-fallback" })(text)).toEqual(native);
    } finally {
      (Intl as { Segmenter: unknown }).Segmenter = original;
    }
  });

  it("does nothing when Intl.Segmenter exists", () => {
    expect(ensureSegmenter()).toBe(false);
  });
});
