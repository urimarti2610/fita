import { createMarkupEmphasizer, type EmphasisStyle, escapeHTML } from "@fita/core";
import { marked } from "marked";
import type { InputFormat } from "./convert.js";
import { openEpub } from "./epub.js";

/**
 * First page of a book or document, as plain blocks of text, for the converter's
 * live preview. Runs on the main thread (it needs DOMParser) and reads only the
 * beginning of the file.
 */
export type PreviewBlock = { heading: boolean; text: string };
export type Preview = { title?: string; lang?: string; blocks: PreviewBlock[] };

/** About one printed page. */
const PAGE_CHARS = 1400;
/** Covers and title pages have almost no text: look further. */
const MIN_CHARS = 200;
const HEAD_BYTES = 256 * 1024;

function blocksFrom(doc: Document): PreviewBlock[] {
  const blocks: PreviewBlock[] = [];
  for (const el of doc.querySelectorAll("h1, h2, h3, h4, p, li, blockquote")) {
    if (el.closest("nav, aside, pre, code, script, style")) continue;
    if (el.matches("li, blockquote") && el.querySelector("p")) continue;
    const text = el.textContent?.replace(/\s+/g, " ").trim();
    if (text) blocks.push({ heading: /^H\d$/.test(el.tagName.toUpperCase()), text });
  }
  return blocks;
}

function firstPage(blocks: PreviewBlock[]): PreviewBlock[] {
  const page: PreviewBlock[] = [];
  let length = 0;
  for (const block of blocks) {
    if (length >= PAGE_CHARS) break;
    page.push(block);
    length += block.text.length;
  }
  return page;
}

const html = (markup: string, type: DOMParserSupportedType = "text/html") =>
  new DOMParser().parseFromString(markup, type);

export async function extractPreview(file: Blob, input: InputFormat): Promise<Preview> {
  if (input === "epub") {
    const book = await openEpub(file);
    const blocks: PreviewBlock[] = [];
    // Text from skipped short documents, used if the whole book is short.
    const skipped: PreviewBlock[] = [];
    for (const path of book.spine) {
      const markup = (await book.zip.file(path)?.async("string")) ?? "";
      let doc = html(markup, "application/xhtml+xml");
      if (doc.querySelector("parsererror")) doc = html(markup);
      const found = blocksFrom(doc);
      const chars = found.reduce((n, b) => n + b.text.length, 0);
      if (chars < MIN_CHARS && blocks.length === 0) {
        skipped.push(...found);
        continue;
      }
      blocks.push(...found);
      if (blocks.reduce((n, b) => n + b.text.length, 0) >= PAGE_CHARS) break;
    }
    const preview: Preview = { blocks: firstPage(blocks.length ? blocks : skipped) };
    if (book.title) preview.title = book.title;
    if (book.language) preview.lang = book.language;
    return preview;
  }
  const head = await file.slice(0, HEAD_BYTES).text();
  if (input === "txt") {
    const blocks = head
      .replace(/\r\n?/g, "\n")
      .split(/\n\s*\n/)
      .map((p) => p.replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .map((text) => ({ heading: false, text }));
    return { blocks: firstPage(blocks) };
  }
  const doc = html(input === "md" ? (marked.parse(head, { async: false }) as string) : head);
  const preview: Preview = { blocks: firstPage(blocksFrom(doc)) };
  const lang = doc.documentElement.getAttribute("lang");
  if (lang) preview.lang = lang;
  return preview;
}

/** Preview markup with the same emphasis and classes as the converted file. */
export function renderPreview(
  preview: Preview,
  options: { strength: number; every: number; style: EmphasisStyle; lang: string },
): string {
  const emphasize = createMarkupEmphasizer(
    { strength: options.strength, every: options.every, locale: preview.lang ?? options.lang },
    { style: options.style },
  );
  return preview.blocks
    .map((b) => {
      const tag = b.heading ? "h3" : "p";
      return `<${tag}>${emphasize(escapeHTML(b.text))}</${tag}>`;
    })
    .join("");
}
