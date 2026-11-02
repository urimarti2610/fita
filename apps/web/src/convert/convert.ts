import { BRAND, createMarkupEmphasizer, type EmphasisStyle, staticEmphasisCSS } from "@fita/core";
import {
  addStyle,
  buildEpub,
  convertEpub,
  openEpub,
  type Progress,
  xhtmlDocument,
} from "./epub.js";
import { emphasizeMarkdown, markdownToXhtml, splitChapters, textToXhtml } from "./text.js";

export type InputFormat = "epub" | "txt" | "md" | "html";
export type OutputFormat = "epub" | "html" | "md";

/** Output formats offered for each input. Plain text cannot hold emphasis, so TXT has no TXT output. */
export const OUTPUTS: Record<InputFormat, OutputFormat[]> = {
  epub: ["epub"],
  txt: ["epub", "html"],
  md: ["md", "epub", "html"],
  html: ["html"],
};

export function detectFormat(name: string): InputFormat | null {
  const ext = name.toLowerCase().split(".").pop() ?? "";
  if (ext === "epub") return "epub";
  if (ext === "txt" || ext === "text") return "txt";
  if (ext === "md" || ext === "markdown") return "md";
  if (ext === "html" || ext === "htm" || ext === "xhtml") return "html";
  return null;
}

export type ConvertRequest = {
  file: Blob;
  name: string;
  input: InputFormat;
  output: OutputFormat;
  strength: number;
  every: number;
  style: EmphasisStyle;
  /** Interface language: fallback document language and labels for generated books. */
  lang: string;
  labels: { part: string; contents: string };
};

export type ConvertResult = { blob: Blob; name: string };

const MIME: Record<OutputFormat, string> = {
  epub: "application/epub+zip",
  html: "text/html;charset=utf-8",
  md: "text/markdown;charset=utf-8",
};

/** Converts one file. Runs anywhere without a DOM (the converter's Web Worker, tests). */
export async function convert(request: ConvertRequest, progress: Progress): Promise<ConvertResult> {
  const { input, output, style, lang } = request;
  const stem = request.name.replace(/\.[^.]+$/, "") || BRAND.id;
  const name = `${stem}.${BRAND.id}.${output}`;
  const css = `${staticEmphasisCSS(style)}\n`;
  const options = { strength: request.strength, every: request.every };

  if (input === "epub") {
    const book = await openEpub(request.file);
    const transform = createMarkupEmphasizer(
      { ...options, locale: book.language ?? lang },
      { style },
    );
    return { blob: await convertEpub(book, transform, css, progress), name };
  }

  const source = await request.file.text();
  progress(0.1);
  if (input === "md" && output === "md") {
    const blob = new Blob([emphasizeMarkdown(source, { ...options, locale: lang })], {
      type: MIME.md,
    });
    return { blob, name };
  }

  const transform = createMarkupEmphasizer({ ...options, locale: lang }, { style });
  if (input === "html") {
    const declared = source.match(/<html[^>]*\slang\s*=\s*["']?([\w-]+)/i)?.[1];
    const html = declared
      ? createMarkupEmphasizer({ ...options, locale: declared }, { style })(source)
      : transform(source);
    return { blob: new Blob([addStyleOrPrepend(html, css)], { type: MIME.html }), name };
  }

  const body = input === "md" ? markdownToXhtml(source) : textToXhtml(source);
  progress(0.3);
  if (output === "html") {
    const html = xhtmlDocument(stem, lang, transform(body), `<style>${css}</style>\n`);
    return { blob: new Blob([html], { type: MIME.html }), name };
  }
  const chapters = splitChapters(body, (n) => `${request.labels.part} ${n}`).map((c, i, all) => {
    progress(0.3 + (0.5 * (i + 1)) / all.length);
    return { ...c, body: transform(c.body) };
  });
  const blob = await buildEpub({
    title: stem,
    lang,
    chapters,
    css,
    contentsLabel: request.labels.contents,
    progress,
  });
  return { blob, name };
}

function addStyleOrPrepend(html: string, css: string): string {
  const styled = addStyle(html, css);
  return styled === html ? `<style>${css}</style>\n${html}` : styled;
}
