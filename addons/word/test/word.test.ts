import { beforeAll, describe, expect, it } from "vitest";
import { EMPHASIS_COLOR } from "../src/plan.js";
import { emphasizeDocument, emphasizeSelection, removeEmphasis, STYLE_NAME } from "../src/word.js";

/** In-memory stand-in for the slice of the Word API the add-in uses. */
class FakeParagraph {
  styles: string[];
  constructor(readonly text: string) {
    this.styles = Array.from({ length: text.length }, () => "");
  }
  range(start = 0, end = this.text.length) {
    return new FakeRange(this, start, end);
  }
  getTextRanges(marks: string[]) {
    return this.range().getTextRanges(marks);
  }
  marked() {
    let out = "";
    for (let i = 0; i < this.text.length; i++) {
      const on = this.styles[i] === STYLE_NAME;
      if (on && this.styles[i - 1] !== STYLE_NAME) out += "[";
      out += this.text[i];
      if (on && this.styles[i + 1] !== STYLE_NAME) out += "]";
    }
    return out;
  }
}

const collection = <T>(items: T[]) => ({ items, load: () => {} });

class FakeRange {
  isEmpty: boolean;
  constructor(
    readonly paragraph: FakeParagraph,
    readonly start: number,
    readonly end: number,
  ) {
    this.isEmpty = start === end;
  }
  get text() {
    return this.paragraph.text.slice(this.start, this.end);
  }
  load() {}
  set style(name: string) {
    for (let i = this.start; i < this.end; i++) this.paragraph.styles[i] = name;
  }
  getTextRanges(marks: string[]) {
    const parts: FakeRange[] = [];
    let from = this.start;
    for (let i = this.start; i < this.end; i++) {
      if (marks.includes(this.paragraph.text[i] as string)) {
        parts.push(new FakeRange(this.paragraph, from, i + 1));
        from = i + 1;
      }
    }
    if (from < this.end) parts.push(new FakeRange(this.paragraph, from, this.end));
    return collection(parts);
  }
  search(query: string, options: { matchCase: boolean }) {
    expect(options.matchCase).toBe(true);
    const needle = query.replace(/\^\^/g, "^");
    const found: FakeRange[] = [];
    let at = this.text.indexOf(needle);
    while (at >= 0) {
      found.push(new FakeRange(this.paragraph, this.start + at, this.start + at + needle.length));
      at = this.text.indexOf(needle, at + needle.length);
    }
    return collection(found);
  }
}

function fakeContext(paragraphs: FakeParagraph[]) {
  const styles = new Map<string, { font: Record<string, unknown> }>();
  let selection = new FakeRange(paragraphs[0] as FakeParagraph, 0, 0);
  const context = {
    syncs: 0,
    styles,
    select(range: FakeRange) {
      selection = range;
    },
    sync: async () => {
      context.syncs++;
    },
    document: {
      body: { paragraphs: collection(paragraphs) },
      getSelection: () => selection,
      getStyles: () => ({
        getByNameOrNullObject: (name: string) => ({
          isNullObject: !styles.has(name),
          load() {},
          delete() {
            styles.delete(name);
            for (const p of paragraphs) p.styles = p.styles.map((s) => (s === name ? "" : s));
          },
        }),
      }),
      addStyle: (name: string, type: string) => {
        expect(type).toBe("Character");
        const style = { font: {} };
        styles.set(name, style);
        return style;
      },
    },
  };
  return context;
}

beforeAll(() => {
  (globalThis as Record<string, unknown>).Word = {
    StyleType: { character: "Character" },
    UnderlineType: { single: "Single" },
  };
});

const run = (ctx: unknown) => ctx as Word.RequestContext;

describe("Word add-in", () => {
  it("emphasizes every paragraph with the character style", async () => {
    const paragraphs = [
      new FakeParagraph("Reading is comfortable"),
      new FakeParagraph("l'àvia 2024"),
    ];
    const ctx = fakeContext(paragraphs);
    const progress: number[][] = [];
    const words = await emphasizeDocument(run(ctx), { strength: 0.45, style: "bold" }, (d, t) =>
      progress.push([d, t]),
    );
    expect(words).toBe(4);
    expect(paragraphs[0]?.marked()).toBe("[Rea]ding [i]s [comfo]rtable");
    expect(paragraphs[1]?.marked()).toBe("l'[àv]ia 2024");
    expect(ctx.styles.get(STYLE_NAME)?.font).toEqual({ bold: true });
    expect(progress).toEqual([[2, 2]]);
  });

  it("re-applies with a new look and removes exactly", async () => {
    const paragraph = new FakeParagraph("abab ab-abc");
    const ctx = fakeContext([paragraph]);
    await emphasizeDocument(run(ctx), { strength: 0.45, style: "bold" });
    await emphasizeDocument(run(ctx), { strength: 0.45, style: "color" });
    expect(ctx.styles.get(STYLE_NAME)?.font).toEqual({ color: EMPHASIS_COLOR });
    expect(paragraph.marked()).toBe("[ab]ab [a]b-[a]bc");
    expect(await removeEmphasis(run(ctx))).toBe(true);
    expect(paragraph.marked()).toBe("abab ab-abc");
    expect(ctx.styles.size).toBe(0);
    expect(await removeEmphasis(run(ctx))).toBe(false);
  });

  it("emphasizes the selection only", async () => {
    const paragraph = new FakeParagraph("First second third");
    const ctx = fakeContext([paragraph]);
    expect(await emphasizeSelection(run(ctx), { strength: 0.45, style: "underline" })).toBe(-1);
    ctx.select(paragraph.range(6, 18));
    expect(await emphasizeSelection(run(ctx), { strength: 0.45, style: "underline" })).toBe(2);
    expect(paragraph.marked()).toBe("First [sec]ond [th]ird");
    expect(ctx.styles.get(STYLE_NAME)?.font).toEqual({ underline: "Single" });
  });

  it("stops between batches when cancelled", async () => {
    const paragraphs = Array.from({ length: 250 }, () => new FakeParagraph("Some words"));
    const ctx = fakeContext(paragraphs);
    let calls = 0;
    await emphasizeDocument(
      run(ctx),
      { strength: 0.45, style: "bold" },
      () => {},
      () => calls++ > 0,
    );
    expect(paragraphs[0]?.marked()).toBe("[So]me [wo]rds");
    expect(paragraphs[249]?.marked()).toBe("Some words");
  });
});
