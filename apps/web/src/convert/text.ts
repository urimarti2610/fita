import { createEmphasizer, type EmphasisOptions } from "@fita/core";
import { marked } from "marked";
import { type Chapter, xml } from "./epub.js";

/** Plain text to XHTML body: blank lines separate paragraphs, single newlines become <br/>. */
export function textToXhtml(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${xml(p).replace(/\n/g, "<br/>\n")}</p>`)
    .join("\n");
}

const VOID = /<(area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)\b([^>]*?)\s*\/?>/gi;

/** Markdown to XHTML body (void elements self-closed so the result is well-formed XML). */
export function markdownToXhtml(markdown: string): string {
  const html = marked.parse(markdown, { async: false, gfm: true }) as string;
  return html.replace(VOID, "<$1$2/>");
}

/** Splits a long XHTML body into chapters: at h1/h2 when present, else by size. */
export function splitChapters(
  body: string,
  label: (n: number) => string,
  size = 150_000,
): Chapter[] {
  const blocks = body.split(/\n(?=<(?:p|h[1-6]|ul|ol|pre|blockquote|table|hr|div)\b)/);
  const chapters: Chapter[] = [];
  let current: string[] = [];
  let length = 0;
  let title: string | null = null;
  const flush = () => {
    if (!current.length) return;
    chapters.push({ title: title ?? label(chapters.length + 1), body: current.join("\n") });
    current = [];
    length = 0;
    title = null;
  };
  for (const block of blocks) {
    const heading = block.match(/^<h[12][^>]*>([\s\S]*?)<\/h[12]>/);
    if ((heading && current.length) || length > size) flush();
    if (heading && !current.length) {
      title =
        heading[1]
          ?.replace(/<[^>]+>/g, "")
          .replace(/&amp;/g, "&")
          .trim() || null;
    }
    current.push(block);
    length += block.length;
  }
  flush();
  return chapters.length ? chapters : [{ title: label(1), body: "" }];
}

/** Inline Markdown that must stay byte for byte: code, autolinks, HTML, link targets, images. */
const MD_PROTECTED =
  /(`+)[\s\S]*?\1|<[^>\n]+>|!\[[^\]\n]*\]\([^)\n]*\)|\]\([^)\n]*\)|\]\[[^\]\n]*\]|\\./g;

/**
 * Markdown to Markdown: emphasized parts become inline <b> tags, which every
 * common renderer supports and which nest safely inside existing **bold**.
 */
export function emphasizeMarkdown(markdown: string, options: Partial<EmphasisOptions>): string {
  const emphasize = createEmphasizer(options);
  const inline = (text: string) =>
    emphasize(text)
      .map((s) => (s.emphasis ? `<b>${s.text}</b>` : s.text))
      .join("");
  const lines = markdown.split(/(?<=\n)/);
  let fence: string | null = null;
  let frontMatter = lines[0]?.trimEnd() === "---";
  let previousBlank = true;
  let indentedCode = false;
  const out: string[] = [];
  lines.forEach((line, index) => {
    const content = line.replace(/\r?\n$/, "");
    const blank = content.trim() === "";
    if (frontMatter) {
      out.push(line);
      if (index > 0 && content.trimEnd() === "---") frontMatter = false;
      return;
    }
    const fenceMatch = content.match(/^ {0,3}(`{3,}|~{3,})/);
    if (fence) {
      out.push(line);
      if (
        fenceMatch &&
        fenceMatch[1]?.[0] === fence[0] &&
        (fenceMatch[1]?.length ?? 0) >= fence.length
      ) {
        fence = null;
      }
      return;
    }
    if (fenceMatch) {
      fence = fenceMatch[1] as string;
      out.push(line);
      return;
    }
    indentedCode = !blank && /^( {4}|\t)/.test(content) && (previousBlank || indentedCode);
    previousBlank = blank;
    if (
      blank ||
      indentedCode ||
      /^ {0,3}</.test(content) || // HTML block
      /^ {0,3}\[[^\]]+\]:\s/.test(content) // link reference definition
    ) {
      out.push(line);
      return;
    }
    let result = "";
    let last = 0;
    for (const m of content.matchAll(MD_PROTECTED)) {
      result += inline(content.slice(last, m.index)) + m[0];
      last = m.index + m[0].length;
    }
    out.push(result + inline(content.slice(last)) + line.slice(content.length));
  });
  return out.join("");
}
