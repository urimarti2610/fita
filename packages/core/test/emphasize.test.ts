import { describe, expect, it } from "vitest";
import {
  createEmphasizer,
  type EmphasisOptions,
  emphasisCount,
  emphasize,
  resolveOptions,
  toHTML,
} from "../src/index.js";
import { CLASSIC } from "./helpers.js";

/** Renders spans as text with emphasized parts in brackets. */
const show = (text: string, options?: Partial<EmphasisOptions>) =>
  emphasize(text, { ...CLASSIC, ...options })
    .map((s) => (s.emphasis ? `[${s.text}]` : s.text))
    .join("");

const join = (text: string, options?: Partial<EmphasisOptions>) =>
  emphasize(text, { ...CLASSIC, ...options })
    .map((s) => s.text)
    .join("");

describe("languages", () => {
  it.each([
    ["es", "Hola, ¿qué tal estás?", "[Ho]la, ¿[q]ué [t]al [es]tás?"],
    ["es ñ", "El niño soñó", "[E]l [ni]ño [so]ñó"],
    ["ca l·l", "La col·legiala", "[L]a [col·]legiala"],
    ["ca elision", "l'àvia d'una casa", "l'[àv]ia d'[u]na [ca]sa"],
    ["ca typographic apostrophe", "L’home", "L’[ho]me"],
    ["en", "The quick brown fox", "[T]he [qu]ick [br]own [f]ox"],
    ["en contractions", "don't it's", "[do]n't [it]'s"],
    ["ru", "Съешь же ещё этих", "[Съ]ешь [ж]е [е]щё [эт]их"],
    ["pl", "Zażółć gęślą jaźń", "[Za]żółć [gę]ślą [ja]źń"],
    ["el", "Καλημέρα κόσμε", "[Καλ]ημέρα [κό]σμε"],
    ["ar", "مرحبا بالعالم", "[مر]حبا [بال]عالم"],
    ["he", "שלום עולם", "[של]ום [עו]לם"],
  ])("%s", (_, input, expected) => {
    expect(show(input)).toBe(expected);
  });

  it("leaves Chinese and Japanese untouched", () => {
    expect(show("你好世界")).toBe("你好世界");
    expect(show("こんにちは世界、カタカナ")).toBe("こんにちは世界、カタカナ");
    expect(emphasize("你好世界").every((s) => !s.emphasis)).toBe(true);
  });

  it("leaves Thai, Lao, Khmer and Myanmar untouched", () => {
    for (const text of ["ภาษาไทย", "ພາສາລາວ", "ភាសាខ្មែរ", "မြန်မာဘာသာ"]) {
      expect(show(text)).toBe(text);
    }
  });

  it("still processes Latin words mixed with CJK", () => {
    expect(show("你好 hello")).toBe("你好 [he]llo");
  });

  it("keeps RTL text in logical order", () => {
    const text = "שלום עולם";
    expect(join(text)).toBe(text);
    expect(emphasize(text, CLASSIC)[0]).toEqual({ text: "של", emphasis: true });
  });
});

describe("defaults", () => {
  it("bold most of long words and only the first letter of short ones", () => {
    const text = "Es casi insultantemente simple. Y quizá funciona precisamente por eso";
    expect(
      emphasize(text)
        .map((s) => (s.emphasis ? `[${s.text}]` : s.text))
        .join(""),
    ).toBe(
      "[E]s [cas]i [insultante]mente [simp]le. [Y] [qui]zá [funci]ona [precisam]ente [p]or [e]so",
    );
    expect(resolveOptions()).toMatchObject({ strength: 0.65, minWordLength: 4, every: 1 });
  });
});

describe("graphemes", () => {
  it("never splits emoji or combining sequences", () => {
    expect(show("I ❤️ 👩‍👩‍👧 café")).toBe("[I] ❤️ 👩‍👩‍👧 [ca]fé");
    // n + combining tilde + combining tilde, e + combining ring: 2 graphemes of 5
    expect(show("ñ̃e̊xamp")).toBe("[ñ̃e̊]xamp");
    // decomposed é (e + U+0301) stays whole in a 2-grapheme word
    expect(show("e\u0301s")).toBe("[e\u0301]s");
  });

  it("does not split ligatures", () => {
    expect(show("ﬁnd")).toBe("[ﬁ]nd");
  });
});

describe("rules", () => {
  it("emphasizes at least one grapheme and leaves one plain", () => {
    expect(emphasisCount(1, resolveOptions())).toBe(1);
    expect(emphasisCount(2, resolveOptions({ strength: 0.7 }))).toBe(1);
    expect(emphasisCount(10, resolveOptions({ strength: 0.7 }))).toBe(7);
    expect(emphasisCount(10, resolveOptions({ strength: 0.2 }))).toBe(2);
    expect(emphasisCount(0, resolveOptions())).toBe(0);
  });

  it("emphasizes one grapheme in words shorter than minWordLength", () => {
    expect(show("casa elefante", { minWordLength: 5, strength: 0.7 })).toBe("[c]asa [elefan]te");
  });

  it("emphasizes every Nth processable word", () => {
    expect(show("uno dos 3 tres cuatro", { every: 2 })).toBe("[u]no dos 3 [tr]es cuatro");
  });

  it("carries the every counter across chunks", () => {
    const run = createEmphasizer({ ...CLASSIC, every: 2 });
    const a = run("uno dos");
    const b = run("tres cuatro");
    expect(a.map((s) => s.emphasis)).toEqual([true, false]);
    expect(b[0]).toEqual({ text: "tr", emphasis: true });
  });

  it("clamps and sanitizes options", () => {
    expect(resolveOptions({ strength: 5 }).strength).toBe(0.7);
    expect(resolveOptions({ strength: -1 }).strength).toBe(0.2);
    expect(resolveOptions({ strength: Number.NaN }).strength).toBe(0.65);
    expect(resolveOptions({ every: 0 }).every).toBe(1);
    expect(resolveOptions({ minWordLength: 2.7 }).minWordLength).toBe(2);
    expect(resolveOptions({ locale: "ca" }).locale).toBe("ca");
    expect(resolveOptions()).not.toHaveProperty("locale");
  });

  it("accepts an explicit locale", () => {
    expect(show("l'àvia", { locale: "ca" })).toBe("l'[àv]ia");
  });
});

describe("numbers", () => {
  it("skips numbers and words with digits by default", () => {
    expect(show("Año 2024, 3D y 1.000")).toBe("[A]ño 2024, 3D [y] 1.000");
    expect(show("٣٤٥ mil")).toBe("٣٤٥ [m]il");
  });

  it("processes them when skipNumbers is false", () => {
    expect(show("12345 3Dmax", { skipNumbers: false })).toBe("[12]345 [3D]max");
  });
});

describe("protected text", () => {
  it.each([
    "https://example.com/path?q=1",
    "http://ejemplo.cat",
    "www.example.org/page",
    "persona@example.com",
    "nom.cognom@domini.cat",
    "/usr/local/bin",
    "./src/index.ts",
    "~/Documents/libro.epub",
    "C:\\Users\\docs",
    "`npm install`",
    "foo()",
    "console.log(x)",
    "snake_case_name",
  ])("leaves %s untouched", (text) => {
    expect(show(`palabra ${text} palabra`)).toBe(`[pal]abra ${text} [pal]abra`);
  });

  it("does not treat prose with slashes or parentheses as code", () => {
    expect(show("and/or amigo(a)")).toBe("[a]nd/[o]r [am]igo([a])");
  });
});

describe("edge cases", () => {
  it("handles empty and whitespace-only input", () => {
    expect(emphasize("")).toEqual([]);
    expect(emphasize("  \n\t")).toEqual([{ text: "  \n\t", emphasis: false }]);
  });

  it("merges adjacent spans", () => {
    expect(emphasize("¡¡ ...")).toEqual([{ text: "¡¡ ...", emphasis: false }]);
  });

  it("round-trips text exactly", () => {
    const text = "Mixed: café 你好 שלום 👩‍👩‍👧 https://x.y/z l'àvia\r\n2024 — ok";
    expect(join(text)).toBe(text);
  });

  it("processes 5 MB of text in reasonable time", () => {
    const paragraph =
      "Lorem ipsum dolor sit amet, l'àvia col·leccionava llibres. Съешь же ещё этих мягких булок. ";
    const text = paragraph.repeat(Math.ceil((5 * 1024 * 1024) / paragraph.length));
    const start = performance.now();
    const spans = emphasize(text);
    const elapsed = performance.now() - start;
    expect(spans.length).toBeGreaterThan(100_000);
    expect(spans.reduce((n, s) => n + s.text.length, 0)).toBe(text.length);
    expect(elapsed).toBeLessThan(30_000);
  });
});

describe("toHTML", () => {
  it("wraps emphasis and escapes HTML", () => {
    expect(toHTML("<b>Tom & Jerry</b>", CLASSIC)).toBe(
      "&lt;[b]&gt;<b>T</b>om &amp; <b>Je</b>rry&lt;/<b>b</b>&gt;".replace("[b]", "<b>b</b>"),
    );
    expect(toHTML(`"quotes" 'single'`, CLASSIC)).toBe(
      "&quot;<b>qu</b>otes&quot; &#39;<b>si</b>ngle&#39;",
    );
  });

  it("uses a custom tag", () => {
    expect(toHTML("hola", CLASSIC, "strong")).toBe("<strong>ho</strong>la");
    expect(toHTML("hola", CLASSIC, "fita-e")).toBe("<fita-e>ho</fita-e>la");
  });

  it("rejects unsafe tag names", () => {
    expect(() => toHTML("hola", {}, "b onclick=x")).toThrow(TypeError);
    expect(() => toHTML("hola", {}, "")).toThrow(TypeError);
  });
});
