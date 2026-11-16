import { xml } from "./epub.js";

/**
 * Turns the positioned text of PDF pages back into headings and paragraphs.
 * A PDF has no paragraphs, only lines placed on a page, so they are guessed:
 * a larger gap, an indent, or a short line ending a sentence starts a new
 * paragraph; clearly larger type is a heading; page numbers and running
 * headers are dropped; words hyphenated at the end of a line are joined.
 */

/** A piece of text on a page, in PDF units (y grows upwards). */
export type PdfItem = {
  str: string;
  x: number;
  y: number;
  width: number;
  size: number;
  hasEOL: boolean;
};
export type Block = { heading: boolean; text: string };

type Line = { text: string; x: number; right: number; y: number; size: number };

/** Lines in reading order, as pdf.js reports them. */
export function linesOf(items: PdfItem[]): Line[] {
  const lines: Line[] = [];
  let line: Line | null = null;
  for (const item of items) {
    if (
      line &&
      Math.abs(item.y - line.y) > Math.max(line.size, item.size) * 0.6 &&
      item.str.trim()
    ) {
      lines.push(line);
      line = null;
    }
    if (!line) {
      if (!item.str.trim() && item.hasEOL) continue;
      line = { text: "", x: item.x, right: item.x, y: item.y, size: 0 };
    }
    line.text += item.str;
    if (item.str.trim()) {
      line.x = Math.min(line.x, item.x);
      line.right = Math.max(line.right, item.x + item.width);
      line.size = Math.max(line.size, item.size);
    }
    if (item.hasEOL) {
      lines.push(line);
      line = null;
    }
  }
  if (line) lines.push(line);
  return lines
    .map((l) => ({ ...l, text: l.text.replace(/\s+/g, " ").trim() }))
    .filter((l) => l.text);
}

const median = (values: number[]) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor((sorted.length - 1) / 2)] as number;
};

/** Page numbers ("12", "- 12 -", "iv", "Page 3 of 9" are all digits or roman numerals). */
const PAGE_NUMBER =
  /^[\s\-–—|.·()[\]]*(?:\d{1,5}|[ivxlcdm]{1,7})(?:[\s/]+\d{1,5})?[\s\-–—|.·()[\]]*$/i;
/** Running headers and footers compare equal once their numbers are ignored. */
const signature = (text: string) => text.replace(/\d+/g, "#").toLowerCase();
const ENDS_SENTENCE = /[.!?…:;»"”’)\]]$/;
const CJK = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u;

/** Joins two lines of the same paragraph, undoing end-of-line hyphenation. */
function join(before: string, after: string): string {
  if (/\p{L}[-­]$/u.test(before) && /^\p{Ll}/u.test(after)) {
    return before.slice(0, -1) + after;
  }
  if (CJK.test(before.slice(-1)) && CJK.test(after[0] ?? "")) return before + after;
  return `${before} ${after}`;
}

export class Reflow {
  readonly blocks: Block[] = [];
  /** Body text size, learnt from the pages seen so far (weighted by text). */
  private sizes = new Map<number, number>();
  private open: Block | null = null;
  private lastSize = 0;
  private edges: { top: string; bottom: string } = { top: "", bottom: "" };

  private bodySize(): number {
    let best = 0;
    let count = 0;
    for (const [size, chars] of this.sizes) {
      if (chars > count) {
        best = size;
        count = chars;
      }
    }
    return best;
  }

  private close() {
    if (this.open) this.blocks.push(this.open);
    this.open = null;
  }

  /** Adds one page. Pages must come in order. */
  addPage(items: PdfItem[]) {
    let lines = linesOf(items);
    // Drop page numbers and headers/footers repeated from the previous page.
    const top = lines[0];
    const bottom = lines[lines.length - 1];
    const edges = {
      top: top ? signature(top.text) : "",
      bottom: bottom ? signature(bottom.text) : "",
    };
    lines = lines.filter((line, i) => {
      const edge = i === 0 || i === lines.length - 1;
      if (!edge) return true;
      if (PAGE_NUMBER.test(line.text)) return false;
      const sig = signature(line.text);
      return sig !== this.edges.top && sig !== this.edges.bottom;
    });
    this.edges = edges;
    if (!lines.length) return;

    for (const line of lines) {
      const size = Math.round(line.size * 2) / 2;
      this.sizes.set(size, (this.sizes.get(size) ?? 0) + line.text.length);
    }
    const body = this.bodySize();
    const isHeading = (line: Line) =>
      body > 0 && line.size >= body * 1.2 && line.text.length < 200 && /\p{L}/u.test(line.text);

    const bodyLines = lines.filter((l) => !isHeading(l));
    const gaps: number[] = [];
    for (let i = 1; i < bodyLines.length; i++) {
      const gap = (bodyLines[i - 1] as Line).y - (bodyLines[i] as Line).y;
      if (gap > 0) gaps.push(gap);
    }
    const lineGap = median(gaps) || body * 1.2 || 14;
    const left = median(bodyLines.map((l) => l.x));
    const right = Math.max(...bodyLines.map((l) => l.right), 0);

    let previous: Line | null = null;
    for (const line of lines) {
      const heading = isHeading(line);
      if (heading) {
        if (this.open?.heading && Math.abs(line.size - this.lastSize) < 0.5 && previous) {
          this.open.text = join(this.open.text, line.text);
        } else {
          this.close();
          this.open = { heading: true, text: line.text };
        }
      } else {
        const indent = line.x > left + line.size * 0.8;
        let starts: boolean;
        if (!this.open || this.open.heading) starts = true;
        else if (!previous) {
          // First line of a page: continue the paragraph from the previous page
          // unless it clearly ended there.
          starts = indent || ENDS_SENTENCE.test(this.open.text) || !/^\p{Ll}/u.test(line.text);
        } else {
          const gap = previous.y - line.y;
          const short = previous.right < right - previous.size * 4;
          starts =
            gap < 0 || // next column
            gap > lineGap * 1.5 ||
            indent ||
            Math.abs(line.size - previous.size) > previous.size * 0.15 ||
            (short && ENDS_SENTENCE.test(previous.text));
        }
        if (starts) {
          this.close();
          this.open = { heading: false, text: line.text };
        } else if (this.open) {
          this.open.text = join(this.open.text, line.text);
        }
      }
      this.lastSize = line.size;
      previous = line;
    }
  }

  /** Closes the last paragraph and returns every block. */
  finish(): Block[] {
    this.close();
    return this.blocks;
  }
}

/** XHTML body for reflowed blocks. */
export function blocksToXhtml(blocks: Block[]): string {
  return blocks
    .map((b) => (b.heading ? `<h2>${xml(b.text)}</h2>` : `<p>${xml(b.text)}</p>`))
    .join("\n");
}
