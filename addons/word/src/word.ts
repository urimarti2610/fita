/**
 * Applies and removes emphasis with the Office.js Word API.
 *
 * Emphasis is a character style ("<name> emphasis") applied to the start of each
 * word. The text and the author's formatting are never changed, so screen readers
 * read the document as before, and removing the emphasis is exact: deleting the
 * style returns its text to the default character formatting.
 *
 * Requires WordApi 1.5 (styles API): Word 2021, Microsoft 365 and Word on the web.
 */
import { BRAND, createEmphasizer } from "@fita/core";
import { EMPHASIS_COLOR, escapeSearch, searchTargets, type WordStyle } from "./plan.js";

export const STYLE_NAME = `${BRAND.name} emphasis`;
export const REQUIREMENT = { set: "WordApi", version: "1.5" } as const;
/** Paragraphs per round trip to the document: keeps memory flat on long documents. */
const PARAGRAPH_BATCH = 100;

export type Settings = { strength: number; style: WordStyle };
export type Progress = (done: number, total: number) => void;

async function deleteStyle(context: Word.RequestContext): Promise<boolean> {
  const style = context.document.getStyles().getByNameOrNullObject(STYLE_NAME);
  style.load("isNullObject");
  await context.sync();
  if (style.isNullObject) return false;
  style.delete();
  await context.sync();
  return true;
}

/** Creates the emphasis style if missing. A new style only sets the chosen property. */
async function ensureStyle(context: Word.RequestContext, look: WordStyle): Promise<void> {
  const existing = context.document.getStyles().getByNameOrNullObject(STYLE_NAME);
  existing.load("isNullObject");
  await context.sync();
  if (!existing.isNullObject) return;
  const style = context.document.addStyle(STYLE_NAME, Word.StyleType.character);
  if (look === "bold") style.font.bold = true;
  else if (look === "color") style.font.color = EMPHASIS_COLOR;
  else style.font.underline = Word.UnderlineType.single;
  await context.sync();
}

/** Emphasizes the words of a list of ranges (paragraphs or the selection). */
async function emphasizeRanges(
  context: Word.RequestContext,
  ranges: (Word.Range | Word.Paragraph)[],
  settings: Settings,
  progress: Progress,
  cancelled: () => boolean,
): Promise<number> {
  const emphasizer = createEmphasizer({ strength: settings.strength });
  let words = 0;
  for (let i = 0; i < ranges.length && !cancelled(); i += PARAGRAPH_BATCH) {
    const batch = ranges.slice(i, i + PARAGRAPH_BATCH).map((r) => {
      const parts = r.getTextRanges([" "], false);
      parts.load("items/text");
      return parts;
    });
    await context.sync();
    const found: { results: Word.RangeCollection; occurrence: number }[] = [];
    for (const parts of batch) {
      for (const part of parts.items) {
        for (const target of searchTargets(emphasizer(part.text))) {
          const results = part.search(escapeSearch(target.text), { matchCase: true });
          results.load("items");
          found.push({ results, occurrence: target.occurrence });
        }
      }
    }
    await context.sync();
    for (const { results, occurrence } of found) {
      const range = results.items[occurrence];
      if (range) {
        range.style = STYLE_NAME;
        words++;
      }
    }
    await context.sync();
    progress(Math.min(i + PARAGRAPH_BATCH, ranges.length), ranges.length);
  }
  return words;
}

/** Re-emphasizes the whole document (previous emphasis is removed first). */
export async function emphasizeDocument(
  context: Word.RequestContext,
  settings: Settings,
  progress: Progress = () => {},
  cancelled: () => boolean = () => false,
): Promise<number> {
  await deleteStyle(context);
  await ensureStyle(context, settings.style);
  const paragraphs = context.document.body.paragraphs;
  paragraphs.load("items");
  await context.sync();
  return emphasizeRanges(context, paragraphs.items, settings, progress, cancelled);
}

/** Emphasizes the selection. Returns -1 when nothing is selected. */
export async function emphasizeSelection(
  context: Word.RequestContext,
  settings: Settings,
  progress: Progress = () => {},
): Promise<number> {
  const selection = context.document.getSelection();
  selection.load("isEmpty");
  await context.sync();
  if (selection.isEmpty) return -1;
  await ensureStyle(context, settings.style);
  return emphasizeRanges(context, [selection], settings, progress, () => false);
}

/** Removes all emphasis by deleting the style. Returns false if there was none. */
export function removeEmphasis(context: Word.RequestContext): Promise<boolean> {
  return deleteStyle(context);
}
