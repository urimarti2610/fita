import type {
  Doc,
  DocContainer,
  DocElement,
  DocNamedRange,
  DocRange,
  DocRangeElement,
  DocText,
} from "../src/docs.js";

export const TEXT = "TEXT";
const PARAGRAPH = "PARAGRAPH";

/** In-memory stand-in for an Apps Script Text element, one attribute record per char. */
export class FakeText implements DocText, DocElement {
  bold: (boolean | null)[];
  underline: (boolean | null)[];
  color: (string | null)[];
  constructor(readonly text: string) {
    this.underline = Array.from({ length: text.length }, () => null);
    this.color = Array.from({ length: text.length }, () => null);
    this.bold = Array.from({ length: text.length }, () => null);
  }
  getType() {
    return TEXT;
  }
  asText() {
    return this;
  }
  getText() {
    return this.text;
  }
  getTextAttributeIndices() {
    const out: number[] = [];
    for (let i = 0; i < this.text.length; i++) {
      if (
        i === 0 ||
        this.bold[i] !== this.bold[i - 1] ||
        this.underline[i] !== this.underline[i - 1] ||
        this.color[i] !== this.color[i - 1]
      )
        out.push(i);
    }
    return out;
  }
  isBold(o: number) {
    return this.bold[o] ?? null;
  }
  isUnderline(o: number) {
    return this.underline[o] ?? null;
  }
  getForegroundColor(o: number) {
    return this.color[o] ?? null;
  }
  #set<T>(list: T[], s: number, e: number, value: T) {
    if (s < 0 || e >= this.text.length || s > e) throw new RangeError(`${s}..${e}`);
    for (let i = s; i <= e; i++) list[i] = value;
  }
  setBold(s: number, e: number, v: boolean) {
    this.#set(this.bold, s, e, v ? true : null);
  }
  setUnderline(s: number, e: number, v: boolean) {
    this.#set(this.underline, s, e, v ? true : null);
  }
  setForegroundColor(s: number, e: number, c: string | null) {
    this.#set(this.color, s, e, c);
  }
  /** The text with bold parts in [brackets], for readable assertions. */
  marked(list: readonly unknown[] = this.bold) {
    let out = "";
    for (let i = 0; i < this.text.length; i++) {
      const on = !!list[i];
      if (on && !list[i - 1]) out += "[";
      out += this.text[i];
      if (on && !list[i + 1]) out += "]";
    }
    return out;
  }
}

class Item implements DocRangeElement {
  constructor(
    readonly element: DocElement,
    readonly start = -1,
    readonly end = -1,
  ) {}
  getElement() {
    return this.element;
  }
  isPartial() {
    return this.start >= 0;
  }
  getStartOffset() {
    return this.start;
  }
  getEndOffsetInclusive() {
    return this.end;
  }
}

/** A paragraph: a container of text runs. */
export class FakeParagraph implements DocElement, DocContainer {
  constructor(readonly texts: FakeText[]) {}
  getType() {
    return PARAGRAPH;
  }
  asText(): DocText {
    throw new Error("not a text");
  }
  findElement(type: unknown, from?: DocRangeElement | null) {
    if (type !== TEXT) return null;
    const index = from ? this.texts.indexOf(from.getElement() as FakeText) + 1 : 0;
    const text = this.texts[index];
    return text ? new Item(text) : null;
  }
}

export class FakeDoc implements Doc {
  named: { name: string; range: DocRange; removed: boolean }[] = [];
  selection: DocRange | null = null;
  readonly body: FakeParagraph;
  constructor(readonly paragraphs: FakeParagraph[]) {
    this.body = new FakeParagraph(paragraphs.flatMap((p) => p.texts));
  }
  getBody() {
    return this.body;
  }
  getSelection() {
    return this.selection;
  }
  select(...items: [DocElement, number?, number?][]) {
    const elements = items.map(([el, s, e]) => new Item(el, s, e));
    this.selection = { getRangeElements: () => elements };
  }
  newRange() {
    const elements: Item[] = [];
    const builder = {
      addElement(element: DocText, start: number, end: number) {
        elements.push(new Item(element as FakeText, start, end));
        return builder;
      },
      build: () => ({ getRangeElements: () => elements }),
    };
    return builder;
  }
  addNamedRange(name: string, range: DocRange): DocNamedRange {
    const entry = { name, range, removed: false };
    this.named.push(entry);
    return this.#wrap(entry);
  }
  getNamedRanges() {
    return this.named.filter((n) => !n.removed).map((n) => this.#wrap(n));
  }
  #wrap(entry: { name: string; range: DocRange; removed: boolean }): DocNamedRange {
    return {
      getName: () => entry.name,
      getRange: () => entry.range,
      remove: () => {
        entry.removed = true;
      },
    };
  }
}
