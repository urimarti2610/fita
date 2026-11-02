import { describe, expect, it } from "vitest";
import ca from "../src/worksheet/texts/ca/README.md?raw";
import en from "../src/worksheet/texts/en/README.md?raw";
import es from "../src/worksheet/texts/es/README.md?raw";
import { parsePlainText, parseTexts, serializeTexts } from "../src/worksheet/texts.js";

describe("worksheet texts", () => {
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
