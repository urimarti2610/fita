import { describe, expect, it } from "vitest";
import {
  emphasizeDocument,
  emphasizeSelection,
  RANGE_PREFIX,
  removeEmphasis,
} from "../src/docs.js";
import { EMPHASIS_COLOR, type Settings } from "../src/plan.js";
import { FakeDoc, FakeParagraph, FakeText, TEXT } from "./fake-doc.js";

const bold: Settings = { strength: 0.45, style: "bold" };

function doc(...texts: string[]) {
  const runs = texts.map((t) => new FakeText(t));
  return { runs, doc: new FakeDoc([new FakeParagraph(runs)]) };
}

describe("emphasizeDocument", () => {
  it("bolds the start of every word, across runs", () => {
    const { runs, doc: d } = doc("Reading is comfortable", "l'àvia d'una amiga");
    const words = emphasizeDocument(d, bold, TEXT);
    expect(runs[0]?.marked()).toBe("[Rea]ding [i]s [comfo]rtable");
    expect(runs[1]?.marked()).toBe("l'[àv]ia d'[u]na [am]iga");
    expect(words).toBe(6);
    expect(d.getNamedRanges().map((n) => n.getName())).toEqual([
      `${RANGE_PREFIX}bold`,
      `${RANGE_PREFIX}bold`,
    ]);
  });

  it("re-applies without stacking named ranges", () => {
    const { runs, doc: d } = doc("Reading is comfortable");
    emphasizeDocument(d, bold, TEXT);
    emphasizeDocument(d, { strength: 0.7, style: "bold" }, TEXT);
    expect(runs[0]?.marked()).toBe("[Readi]ng [i]s [comforta]ble");
    expect(d.getNamedRanges()).toHaveLength(1);
  });

  it("skips empty runs, numbers and text without word spaces", () => {
    const { runs, doc: d } = doc("", "2026 東京都", "ok");
    expect(emphasizeDocument(d, bold, TEXT)).toBe(1);
    expect(runs[1]?.marked()).toBe("2026 東京都");
  });

  it("applies colour and underline", () => {
    const { runs, doc: d } = doc("Gentle anchors");
    emphasizeDocument(d, { strength: 0.45, style: "color" }, TEXT);
    expect(runs[0]?.marked(runs[0].color)).toBe("[Gen]tle [anc]hors");
    expect(runs[0]?.color[0]).toBe(EMPHASIS_COLOR);
    removeEmphasis(d);
    emphasizeDocument(d, { strength: 0.45, style: "underline" }, TEXT);
    expect(runs[0]?.marked(runs[0].underline)).toBe("[Gen]tle [anc]hors");
    expect(runs[0]?.color.every((c) => c === null)).toBe(true);
  });
});

describe("removeEmphasis", () => {
  it("restores the document exactly, keeping the author's bold", () => {
    const { runs, doc: d } = doc("Keep this bold word");
    const run = runs[0] as FakeText;
    run.setBold(10, 13, true); // "bold"
    const before = run.marked();
    emphasizeDocument(d, bold, TEXT);
    expect(run.marked()).toBe("[Ke]ep [th]is [bold] [wo]rd");
    removeEmphasis(d);
    expect(run.marked()).toBe(before);
    expect(d.getNamedRanges()).toHaveLength(0);
  });

  it("leaves other named ranges alone and survives deleted text", () => {
    const { doc: d } = doc("Some words");
    d.addNamedRange("someone-else", d.newRange().build());
    d.addNamedRange(`${RANGE_PREFIX}unknown`, d.newRange().build());
    const broken = {
      getElement: () => {
        throw new Error("gone");
      },
      isPartial: () => false,
      getStartOffset: () => -1,
      getEndOffsetInclusive: () => -1,
    };
    d.addNamedRange(`${RANGE_PREFIX}bold`, { getRangeElements: () => [broken] });
    expect(removeEmphasis(d)).toBe(0);
    expect(d.getNamedRanges().map((n) => n.getName())).toEqual([
      "someone-else",
      `${RANGE_PREFIX}unknown`,
    ]);
  });

  it("handles named ranges covering whole elements", () => {
    const { runs, doc: d } = doc("Whole");
    const run = runs[0] as FakeText;
    run.setBold(0, 4, true);
    const item = {
      getElement: () => run,
      isPartial: () => false,
      getStartOffset: () => -1,
      getEndOffsetInclusive: () => -1,
    };
    d.addNamedRange(`${RANGE_PREFIX}bold`, { getRangeElements: () => [item] });
    expect(removeEmphasis(d)).toBe(1);
    expect(run.marked()).toBe("Whole");
  });
});

describe("emphasizeSelection", () => {
  it("returns -1 without a selection", () => {
    const { doc: d } = doc("Nothing");
    expect(emphasizeSelection(d, bold, TEXT)).toBe(-1);
  });

  it("emphasizes only the selected part, keeping word boundaries", () => {
    const { runs, doc: d } = doc("First second third");
    const run = runs[0] as FakeText;
    // Select "cond thi": the words are still measured whole.
    d.select([run, 8, 15]);
    emphasizeSelection(d, bold, TEXT);
    expect(run.marked()).toBe("First se[c]ond [th]ird");
  });

  it("emphasizes whole selected paragraphs and runs", () => {
    const a = new FakeText("Alpha beta");
    const b = new FakeText("Gamma");
    const paragraph = new FakeParagraph([a]);
    const d = new FakeDoc([paragraph, new FakeParagraph([b])]);
    d.select([paragraph], [b]);
    expect(emphasizeSelection(d, bold, TEXT)).toBe(3);
    expect(a.marked()).toBe("[Al]pha [be]ta");
    expect(b.marked()).toBe("[Ga]mma");
  });
});
