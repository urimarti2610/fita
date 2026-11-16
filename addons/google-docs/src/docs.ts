/**
 * Applies and removes emphasis in a Google Docs document. Written against the small
 * slice of the Apps Script Document service it uses (declared below), so it can be
 * tested without Google's runtime.
 */
import { BRAND, createEmphasizer } from "@fita/core";
import {
  clip,
  type DocStyle,
  EMPHASIS_COLOR,
  emphasizedIntervals,
  type Interval,
  type Settings,
  withoutExisting,
} from "./plan.js";

export interface DocText {
  getText(): string;
  getTextAttributeIndices(): number[];
  isBold(offset: number): boolean | null;
  isUnderline(offset: number): boolean | null;
  getForegroundColor(offset: number): string | null;
  setBold(start: number, endInclusive: number, bold: boolean): unknown;
  setUnderline(start: number, endInclusive: number, underline: boolean): unknown;
  setForegroundColor(start: number, endInclusive: number, color: string | null): unknown;
}
export interface DocElement {
  getType(): unknown;
  asText(): DocText;
}
export interface DocRangeElement {
  getElement(): DocElement;
  isPartial(): boolean;
  getStartOffset(): number;
  getEndOffsetInclusive(): number;
}
export interface DocRange {
  getRangeElements(): DocRangeElement[];
}
export interface DocRangeBuilder {
  addElement(element: DocText, start: number, endInclusive: number): DocRangeBuilder;
  build(): DocRange;
}
export interface DocContainer {
  findElement(type: unknown, from?: DocRangeElement | null): DocRangeElement | null;
}
export interface DocNamedRange {
  getName(): string;
  getRange(): DocRange;
  remove(): void;
}
export interface Doc {
  getBody(): DocContainer;
  getSelection(): DocRange | null;
  newRange(): DocRangeBuilder;
  addNamedRange(name: string, range: DocRange): DocNamedRange;
  getNamedRanges(): DocNamedRange[];
}

/** Named ranges remember what was emphasized, so removal is exact even after edits. */
export const RANGE_PREFIX = `${BRAND.id}-emphasis-`;

const STYLE_OPS: Record<
  DocStyle,
  {
    isSet(t: DocText, o: number): boolean;
    set(t: DocText, s: number, e: number, on: boolean): void;
  }
> = {
  bold: {
    isSet: (t, o) => t.isBold(o) === true,
    set: (t, s, e, on) => t.setBold(s, e, on),
  },
  underline: {
    isSet: (t, o) => t.isUnderline(o) === true,
    set: (t, s, e, on) => t.setUnderline(s, e, on),
  },
  color: {
    isSet: (t, o) => t.getForegroundColor(o) !== null,
    set: (t, s, e, on) => t.setForegroundColor(s, e, on ? EMPHASIS_COLOR : null),
  },
};

/** One piece of text to process, optionally limited to a sub-range. */
type Target = { text: DocText; from?: number; to?: number };

function* textsIn(container: DocContainer, textType: unknown): Generator<DocText> {
  let found = container.findElement(textType);
  while (found) {
    yield found.getElement().asText();
    found = container.findElement(textType, found);
  }
}

function* selectionTargets(range: DocRange, textType: unknown): Generator<Target> {
  for (const item of range.getRangeElements()) {
    const element = item.getElement();
    if (element.getType() === textType) {
      const text = element.asText();
      yield item.isPartial()
        ? { text, from: item.getStartOffset(), to: item.getEndOffsetInclusive() + 1 }
        : { text };
    } else {
      // Whole paragraphs, list items, tables…: every text run inside them.
      for (const text of textsIn(element as unknown as DocContainer, textType)) yield { text };
    }
  }
}

function emphasizeTargets(doc: Doc, targets: Iterable<Target>, settings: Settings): number {
  const emphasizer = createEmphasizer({ strength: settings.strength });
  const op = STYLE_OPS[settings.style];
  const name = RANGE_PREFIX + settings.style;
  let words = 0;
  for (const { text, from, to } of targets) {
    const content = text.getText();
    if (!content) continue;
    // Words are found on the whole run so a partial selection keeps word boundaries.
    let intervals: Interval[] = emphasizedIntervals(emphasizer(content));
    if (from !== undefined || to !== undefined) {
      intervals = clip(intervals, from ?? 0, to ?? content.length);
    }
    intervals = withoutExisting(intervals, text.getTextAttributeIndices(), content.length, (o) =>
      op.isSet(text, o),
    );
    if (intervals.length === 0) continue;
    const builder = doc.newRange();
    for (const [start, end] of intervals) {
      op.set(text, start, end - 1, true);
      builder.addElement(text, start, end - 1);
    }
    doc.addNamedRange(name, builder.build());
    words += intervals.length;
  }
  return words;
}

/** Emphasizes the whole body. Existing emphasis is removed first, so this also re-applies. */
export function emphasizeDocument(doc: Doc, settings: Settings, textType: unknown): number {
  removeEmphasis(doc);
  return emphasizeTargets(
    doc,
    (function* () {
      for (const text of textsIn(doc.getBody(), textType)) yield { text };
    })(),
    settings,
  );
}

/** Emphasizes the selected text. Returns -1 when nothing is selected. */
export function emphasizeSelection(doc: Doc, settings: Settings, textType: unknown): number {
  const selection = doc.getSelection();
  if (!selection) return -1;
  return emphasizeTargets(doc, selectionTargets(selection, textType), settings);
}

/** Removes every emphasis this add-on added, leaving the author's own formatting. */
export function removeEmphasis(doc: Doc): number {
  let removed = 0;
  for (const named of doc.getNamedRanges()) {
    const name = named.getName();
    const style = name.slice(RANGE_PREFIX.length) as DocStyle;
    const op =
      name.startsWith(RANGE_PREFIX) && Object.hasOwn(STYLE_OPS, style)
        ? STYLE_OPS[style]
        : undefined;
    if (!op) continue;
    for (const item of named.getRange().getRangeElements()) {
      try {
        const text = item.getElement().asText();
        const length = text.getText().length;
        const start = item.isPartial() ? item.getStartOffset() : 0;
        const end = item.isPartial() ? item.getEndOffsetInclusive() : length - 1;
        if (end >= start && length > 0) {
          op.set(text, start, Math.min(end, length - 1), false);
          removed++;
        }
      } catch {
        // The text was deleted since it was emphasized: nothing left to undo.
      }
    }
    named.remove();
  }
  return removed;
}
