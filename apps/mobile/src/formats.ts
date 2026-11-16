// Formats the reader opens. Kept free of imports: vite.config.ts loads it too.

export type Format = "epub" | "txt" | "md" | "html";

/** MIME types and extensions, for the file picker, the share target and file handlers. */
export const ACCEPT: Record<string, string[]> = {
  "application/epub+zip": [".epub"],
  "text/plain": [".txt", ".text"],
  "text/markdown": [".md", ".markdown"],
  "text/html": [".html", ".htm", ".xhtml"],
};

/** Value for <input type="file" accept>. */
export const ACCEPT_ATTRIBUTE = Object.entries(ACCEPT).flat(2).join(",");

const BY_EXTENSION: Record<string, Format> = {
  epub: "epub",
  txt: "txt",
  text: "txt",
  md: "md",
  markdown: "md",
  html: "html",
  htm: "html",
  xhtml: "html",
};

const BY_MIME: Record<string, Format> = {
  "application/epub+zip": "epub",
  "text/plain": "txt",
  "text/markdown": "md",
  "text/x-markdown": "md",
  "text/html": "html",
  "application/xhtml+xml": "html",
};

/**
 * Format from the file name, then the MIME type, then the first bytes. Files shared
 * from other apps often arrive without a usable name ("content://…/1234").
 */
export function detectFormat(name: string, type = "", head?: Uint8Array): Format | null {
  const ext = name.toLowerCase().match(/\.([a-z]+)$/)?.[1];
  if (ext && BY_EXTENSION[ext]) return BY_EXTENSION[ext];
  const mime = type.split(";")[0]?.trim().toLowerCase() ?? "";
  if (BY_MIME[mime]) return BY_MIME[mime];
  if (!head?.length) return null;
  // Zip: "PK\x03\x04". EPUB is the only zip-based format we open.
  if (head[0] === 0x50 && head[1] === 0x4b && head[2] === 0x03 && head[3] === 0x04) return "epub";
  const text = new TextDecoder("utf-8", { fatal: false }).decode(head.subarray(0, 512));
  if (text.includes("\u0000")) return null;
  if (/^\s*(?:<\?xml[^>]*>\s*)?(?:<!doctype html|<html)/i.test(text)) return "html";
  return "txt";
}
