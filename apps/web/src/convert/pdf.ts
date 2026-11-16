import { ConvertError, type Progress } from "./epub.js";
import { type Block, type PdfItem, Reflow } from "./reflow.js";

/**
 * PDF text extraction with pdf.js, bundled with the site and loaded only when a
 * PDF is converted. It runs inside the converter's Web Worker: pdf.js's own
 * worker code is imported into the same thread (its "fake worker"), so no extra
 * worker or script is fetched. Nothing is requested from other sites: the only
 * extra files pdf.js may ask for are character maps for some Asian fonts,
 * served from this site next to the code.
 */

type PdfJs = typeof import("pdfjs-dist/legacy/build/pdf.mjs");

/** Character maps (CMaps) shipped with pdf.js, as URLs of this site's own build. */
const CMAPS = import.meta.glob<string>("/node_modules/pdfjs-dist/cmaps/*.bcmap", {
  query: "?url",
  import: "default",
});

/** Gives pdf.js the bundled character maps and nothing else: no fonts or wasm from anywhere. */
class LocalData {
  async fetch({ kind, filename }: { kind: string; filename: string }): Promise<Uint8Array> {
    const load = kind === "cMapUrl" ? CMAPS[`/node_modules/pdfjs-dist/cmaps/${filename}`] : null;
    if (!load) throw new Error(`${kind}/${filename} is not bundled`);
    const response = await fetch(await load());
    return new Uint8Array(await response.arrayBuffer());
  }
}

let pdfjs: Promise<PdfJs> | null = null;

function loadPdfJs(): Promise<PdfJs> {
  pdfjs ??= (async () => {
    // With pdfjsWorker set, pdf.js runs its parser in this thread instead of
    // starting a worker from a URL.
    const worker = await import("pdfjs-dist/legacy/build/pdf.worker.mjs");
    (globalThis as { pdfjsWorker?: unknown }).pdfjsWorker = worker;
    return import("pdfjs-dist/legacy/build/pdf.mjs");
  })();
  return pdfjs;
}

export type PdfText = { blocks: Block[]; title?: string; language?: string };

/**
 * Reads the text of a PDF page by page and reflows it into headings and
 * paragraphs. For previews, `limit` stops after enough characters or pages.
 */
export async function readPdf(
  file: Blob,
  progress: Progress,
  limit: { chars?: number; pages?: number } = {},
): Promise<PdfText> {
  const enough = limit.chars ?? Number.POSITIVE_INFINITY;
  const pages = limit.pages ?? Number.POSITIVE_INFINITY;
  const { getDocument, PasswordException, InvalidPDFException } = await loadPdfJs();
  const task = getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
    BinaryDataFactory: LocalData as never,
    useSystemFonts: true,
    disableFontFace: true,
    useWasm: false,
    isOffscreenCanvasSupported: false,
    isImageDecoderSupported: false,
    enableXfa: false,
    verbosity: 0,
  });
  let doc: Awaited<typeof task.promise>;
  try {
    doc = await task.promise;
  } catch (error) {
    await task.destroy();
    if (error instanceof PasswordException) throw new ConvertError("pdfLocked");
    if (error instanceof InvalidPDFException) throw new ConvertError("invalid");
    throw error;
  }
  try {
    const reflow = new Reflow();
    let chars = 0;
    const last = Math.min(doc.numPages, pages);
    for (let n = 1; n <= last && chars < enough; n++) {
      const page = await doc.getPage(n);
      const content = await page.getTextContent();
      const items: PdfItem[] = [];
      for (const item of content.items) {
        if (!("str" in item)) continue;
        const [, , c = 0, d = 0, x = 0, y = 0] = item.transform as number[];
        items.push({
          str: item.str,
          x,
          y,
          width: item.width,
          size: Math.hypot(c, d) || item.height,
          hasEOL: item.hasEOL,
        });
        chars += item.str.length;
      }
      reflow.addPage(items);
      page.cleanup();
      progress(n / last);
    }
    const blocks = reflow.finish();
    if (!blocks.length) throw new ConvertError("noText");
    const result: PdfText = { blocks };
    const { info } = (await doc.getMetadata().catch(() => ({ info: {} }))) as {
      info: { Title?: unknown; Language?: unknown };
    };
    if (typeof info.Title === "string" && info.Title.trim()) result.title = info.Title.trim();
    if (typeof info.Language === "string" && /^[a-z]{2,3}(?:-[\w-]+)?$/i.test(info.Language)) {
      result.language = info.Language;
    }
    return result;
  } finally {
    await task.destroy();
  }
}
