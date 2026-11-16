/// <reference lib="webworker" />

import { type ConvertRequest, convert } from "./convert.js";
import { ConvertError, type ConvertErrorCode } from "./epub.js";
import type { Preview } from "./preview.js";

/** Asks for the first page of a PDF (parsing PDFs is too heavy for the main thread). */
export type PreviewRequest = { type: "preview"; file: Blob };

export type WorkerMessage =
  | { type: "progress"; value: number }
  | { type: "done"; blob: Blob; name: string }
  | { type: "preview"; preview: Preview }
  | { type: "error"; code: ConvertErrorCode | "failed"; detail?: string };

const post = (message: WorkerMessage) => self.postMessage(message);

/** About one page of text, read from at most the first few pages. */
const PREVIEW_CHARS = 2000;
const PREVIEW_PAGES = 30;

async function preview(file: Blob): Promise<Preview> {
  const { readPdf } = await import("./pdf.js");
  try {
    const text = await readPdf(file, () => {}, { chars: PREVIEW_CHARS, pages: PREVIEW_PAGES });
    const result: Preview = { blocks: text.blocks };
    if (text.title) result.title = text.title;
    if (text.language) result.lang = text.language;
    return result;
  } catch (error) {
    // No text on the first pages: the preview stays empty, converting is still possible.
    if (error instanceof ConvertError && error.code === "noText") return { blocks: [] };
    throw error;
  }
}

self.onmessage = async (event: MessageEvent<ConvertRequest | PreviewRequest>) => {
  try {
    const data = event.data;
    if ("type" in data) {
      post({ type: "preview", preview: await preview(data.file) });
      return;
    }
    let last = -1;
    const result = await convert(data, (value) => {
      const rounded = Math.round(value * 100);
      if (rounded === last) return;
      last = rounded;
      post({ type: "progress", value: rounded / 100 });
    });
    post({ type: "done", ...result });
  } catch (error) {
    if (error instanceof ConvertError) post({ type: "error", code: error.code });
    else post({ type: "error", code: "failed", detail: String(error) });
  }
};
