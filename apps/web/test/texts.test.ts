import { describe, expect, it } from "vitest";
import ca from "../src/worksheet/texts/ca/README.md?raw";
import en from "../src/worksheet/texts/en/README.md?raw";
import es from "../src/worksheet/texts/es/README.md?raw";
import { parsePlainText, parseTexts, serializeTexts } from "../src/worksheet/texts.js";

// Every language's README.md, keyed by language code.
const ALL = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>("../src/worksheet/texts/*/README.md", {
      query: "?raw",
      import: "default",
      eager: true,
    }),
  ).map(([path, raw]) => [path.split("/").at(-2) as string, raw]),
);

describe("worksheet texts", () => {
  it("has 9 texts in every language, three per age level", () => {
    expect(Object.keys(ALL).length).toBeGreaterThan(3);
    for (const [lang, raw] of Object.entries(ALL)) {
      const texts = parseTexts(raw);
      expect(texts, lang).toHaveLength(9);
      const levels = texts.map((t) => t.level);
      for (const level of levels) expect(level, lang).toMatch(/\d/);
      // Same level inside each group of three, a different one between groups.
      expect(new Set(levels).size, lang).toBe(3);
      for (let i = 0; i < 9; i++) expect(levels[i], lang).toBe(levels[i - (i % 3)]);
      for (const t of texts)
        expect(t.text.split("\n\n").length, `${lang}: ${t.title}`).toBeGreaterThan(2);
    }
  });

  it("parses the sample READMEs: same number of texts, levels and paragraphs everywhere", () => {
    const all = [es, ca, en].map(parseTexts);
    for (const texts of all) {
      expect(texts).toHaveLength(9);
      for (const t of texts) {
        expect(t.title).not.toMatch(/^#|\n/);
        expect(t.level).toMatch(/\d/);
        expect(t.text.split("\n\n").length).toBeGreaterThan(2);
      }
    }
    expect(all.map((texts) => texts.map((t) => t.level))).toEqual([
      Array(9)
        .fill(0)
        .map((_, i) => ["6–7 años", "8–9 años", "10–12 años"][Math.floor(i / 3)]),
      Array(9)
        .fill(0)
        .map((_, i) => ["6–7 anys", "8–9 anys", "10–12 anys"][Math.floor(i / 3)]),
      Array(9)
        .fill(0)
        .map((_, i) => ["Ages 6–7", "Ages 8–9", "Ages 10–12"][Math.floor(i / 3)]),
    ]);
  });

  it("round-trips through export and import", () => {
    const texts = [
      { title: "Uno", level: "6–7 años", text: "Primer párrafo.\n\nSegundo párrafo." },
      { title: "Dos", text: "# no es un título\nlínea" },
    ];
    const markdown = serializeTexts("Mis textos", "Nivel", texts);
    expect(markdown).toMatch(/^# Mis textos\n\n## Uno\n- Nivel: 6–7 años\n\nPrimer/);
    expect(parseTexts(markdown)).toEqual([
      texts[0],
      { title: "Dos", text: "\\# no es un título\nlínea" },
    ]);
  });

  it("skips sections without text and ignores other headings", () => {
    expect(parseTexts("# Doc\n\nintro\n\n## Vacío\n\n## Bueno\nTexto\n\n# Otro\nfuera")).toEqual([
      { title: "Bueno", text: "Texto" },
    ]);
    expect(parseTexts("sin títulos")).toEqual([]);
  });

  it("reads plain text files", () => {
    expect(parsePlainText("Mi cuento\nHabía una vez.", "Texto")).toEqual([
      { title: "Mi cuento", text: "Había una vez." },
    ]);
    expect(parsePlainText("Solo una línea muy corta", "Texto")).toEqual([
      { title: "Texto", text: "Solo una línea muy corta" },
    ]);
    expect(parsePlainText("  \n ", "Texto")).toEqual([]);
  });
});
