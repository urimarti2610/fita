import { BRAND, createMarkupEmphasizer, type EmphasisStyle, staticEmphasisCSS } from "@fita/core";
import { bundleImagesForEpub, folderBundle, inlineImagesForHtml, zipBundle } from "./bundle.js";
import { convertDocx, openDocx } from "./docx.js";
import {
  addStyle,
  buildEpub,
  convertEpub,
  openEpub,
  type Progress,
  type Resource,
  xhtmlDocument,
} from "./epub.js";
import { emphasizeMarkdown, markdownToXhtml, splitChapters, textToXhtml } from "./text.js";

/** "zip" and "folder" hold a Markdown document together with its images. */
export type InputFormat = "epub" | "txt" | "md" | "html" | "zip" | "folder" | "docx";
export type OutputFormat = "epub" | "html" | "md" | "docx";

/** Output formats offered for each input. Plain text cannot hold emphasis, so TXT has no TXT output. */
export const OUTPUTS: Record<InputFormat, OutputFormat[]> = {
  epub: ["epub"],
  txt: ["epub", "html"],
  md: ["md", "epub", "html"],
  html: ["html"],
  zip: ["epub", "html"],
  folder: ["epub", "html"],
  docx: ["docx"],
};

export function detectFormat(name: string): InputFormat | null {
  const ext = name.toLowerCase().split(".").pop() ?? "";
  if (ext === "epub") return "epub";
  if (ext === "txt" || ext === "text") return "txt";
  if (ext === "md" || ext === "markdown") return "md";
  if (ext === "html" || ext === "htm" || ext === "xhtml") return "html";
  if (ext === "zip") return "zip";
  if (ext === "docx") return "docx";
  return null;
}

export type ConvertRequest = {
  /** The file to convert; for a folder, any placeholder (the files are in `assets`). */
  file: Blob;
  /** File name, or the folder's name for a folder. */
  name: string;
  /** Every file of a picked folder, with its path relative to that folder. */
  assets?: { path: string; file: Blob }[];
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
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

/** Converts one file. Runs anywhere without a DOM (the converter's Web Worker, tests). */
export async function convert(request: ConvertRequest, progress: Progress): Promise<ConvertResult> {
  const { input, output, style, lang } = request;
  const stem =
    (input === "folder" ? request.name : request.name.replace(/\.[^.]+$/, "")) || BRAND.id;
  const name = `${stem}.${BRAND.id}.${output}`;
  const css = `${staticEmphasisCSS(style)}\n`;
  const options = { strength: request.strength, every: request.every };

  if (input === "docx") {
    const docx = await openDocx(request.file);
    const blob = await convertDocx(
      docx,
      { ...options, locale: docx.language ?? lang },
      style,
      progress,
    );
    return { blob, name };
  }

  if (input === "epub") {
    const book = await openEpub(request.file);
    const transform = createMarkupEmphasizer(
      { ...options, locale: book.language ?? lang },
      { style },
    );
    return { blob: await convertEpub(book, transform, css, progress), name };
  }

  let source: string;
  let bundle: Awaited<ReturnType<typeof zipBundle>> | null = null;
  if (input === "zip" || input === "folder") {
    bundle =
      input === "zip" ? await zipBundle(request.file) : await folderBundle(request.assets ?? []);
    source = bundle.markdown;
  } else {
    source = await request.file.text();
  }
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

  let body = input === "txt" ? textToXhtml(source) : markdownToXhtml(source);
  let resources: Resource[] = [];
  progress(0.3);
  if (output === "html") {
    if (bundle) body = await inlineImagesForHtml(body, bundle);
    const html = xhtmlDocument(stem, lang, transform(body), `<style>${css}</style>\n`);
    return { blob: new Blob([html], { type: MIME.html }), name };
  }
  if (bundle) ({ body, resources } = bundleImagesForEpub(body, bundle));
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
    resources,
  });
  return { blob, name };
}

function addStyleOrPrepend(html: string, css: string): string {
  const styled = addStyle(html, css);
  return styled === html ? `<style>${css}</style>\n${html}` : styled;
}
