import { openEpub } from "@web/convert/epub.js";
import { markdownToXhtml, splitChapters, textToXhtml } from "@web/convert/text.js";
import type { Format } from "./formats.js";
import { classifyLink, type LinkTarget, sanitize } from "./sanitize.js";

/**
 * A document open in the reader, split into chapters that are parsed one at a time,
 * so even very large books only keep the current chapter in the DOM.
 */
export type Chapter = {
  /** Title from the book's table of contents or its first heading; null when it has none. */
  title: string | null;
  /** Path inside the book (EPUB) used to follow links between chapters. */
  path: string;
};

export type RenderedChapter = {
  fragment: DocumentFragment;
  /** Releases resources created for this chapter (image object URLs). */
  release(): void;
};

export type Book = {
  title: string | null;
  lang: string | null;
  chapters: Chapter[];
  render(index: number, target: Document): Promise<RenderedChapter>;
  /** Index of the chapter at `path` (a link target), or -1. */
  indexOf(path: string): number;
};

const parse = (markup: string, type: DOMParserSupportedType) =>
  new DOMParser().parseFromString(markup, type);

/** Parses XHTML strictly, falling back to the forgiving HTML parser for broken files. */
function parseChapter(markup: string): Document {
  const doc = parse(markup, "application/xhtml+xml");
  return doc.querySelector("parsererror") ? parse(markup, "text/html") : doc;
}

/** Resolves `href` against the folder of the zip path `from`. */
export function resolvePath(from: string, href: string): string {
  let path = href.split("#")[0] ?? "";
  try {
    path = decodeURIComponent(path);
  } catch {
    // Keep it as written.
  }
  const base = from.includes("/") ? from.slice(0, from.lastIndexOf("/") + 1) : "";
  const out: string[] = [];
  for (const part of (path.startsWith("/") ? path.slice(1) : base + path).split("/")) {
    if (part === "..") out.pop();
    else if (part !== "." && part !== "") out.push(part);
  }
  return out.join("/");
}

const clean = (text: string | null | undefined) => text?.replace(/\s+/g, " ").trim() || null;

/** Chapter titles from the EPUB 3 navigation document or the EPUB 2 NCX. */
async function readToc(book: Awaited<ReturnType<typeof openEpub>>): Promise<Map<string, string>> {
  const titles = new Map<string, string>();
  const add = (from: string, href: string | null, label: string | null) => {
    if (!href || !label) return;
    const path = resolvePath(from, href);
    if (!titles.has(path)) titles.set(path, label);
  };
  if (book.nav) {
    const markup = await book.zip.file(book.nav)?.async("string");
    if (markup) {
      const doc = parseChapter(markup);
      const navs = Array.from(doc.getElementsByTagName("nav"));
      const toc =
        navs.find((n) => /\btoc\b/.test(n.getAttribute("epub:type") ?? "")) ?? navs[0] ?? null;
      for (const a of Array.from(toc?.getElementsByTagName("a") ?? [])) {
        add(book.nav, a.getAttribute("href"), clean(a.textContent));
      }
    }
  }
  if (!titles.size && book.ncx) {
    const markup = await book.zip.file(book.ncx)?.async("string");
    if (markup) {
      const doc = parse(markup, "application/xml");
      for (const point of Array.from(doc.getElementsByTagName("navPoint"))) {
        const label = point.getElementsByTagName("text")[0]?.textContent;
        const src = point.getElementsByTagName("content")[0]?.getAttribute("src");
        add(book.ncx, src ?? null, clean(label));
      }
    }
  }
  return titles;
}

const IMAGE_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  svg: "image/svg+xml",
};

async function openEpubBook(file: Blob): Promise<Book> {
  const epub = await openEpub(file);
  const toc = await readToc(epub);
  const chapters = epub.spine.map((path) => ({ path, title: toc.get(path) ?? null }));
  const index = new Map(chapters.map((c, i) => [c.path, i]));

  return {
    title: epub.title ?? null,
    lang: epub.language ?? null,
    chapters,
    indexOf: (path) => index.get(path) ?? -1,
    async render(i, target) {
      const chapter = chapters[i];
      const markup = chapter ? await epub.zip.file(chapter.path)?.async("string") : undefined;
      if (!chapter || markup === undefined)
        return { fragment: target.createDocumentFragment(), release() {} };
      const doc = parseChapter(markup);
      const body = doc.getElementsByTagName("body")[0] ?? doc.documentElement;
      const link = (href: string): LinkTarget => {
        const external = classifyLink(href);
        if (external) return external;
        if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return null;
        const path = resolvePath(chapter.path, href);
        const anchor = href.includes("#") ? href.slice(href.indexOf("#") + 1) : "";
        return { kind: "internal", path: path === chapter.path ? "" : path, anchor };
      };
      const { fragment, images } = sanitize(body, target, {
        link,
        image: (src) => (/^[a-z][a-z0-9+.-]*:/i.test(src) ? null : resolvePath(chapter.path, src)),
      });
      // Images come from inside the book, as object URLs: never from the network.
      const urls: string[] = [];
      await Promise.all(
        images.map(async ({ element, attribute, source }) => {
          const entry = epub.zip.file(source);
          if (!entry) return;
          const ext = source.toLowerCase().split(".").pop() ?? "";
          const blob = new Blob([await entry.async("blob")], {
            type: IMAGE_TYPES[ext] ?? "application/octet-stream",
          });
          const url = URL.createObjectURL(blob);
          urls.push(url);
          element.setAttribute(attribute, url);
        }),
      );
      return {
        fragment,
        release: () => {
          for (const url of urls) URL.revokeObjectURL(url);
        },
      };
    },
  };
}

function openMarkupBook(body: string, meta: { title: string | null; lang: string | null }): Book {
  // splitChapters labels untitled chapters; we keep them untitled (null) instead.
  const LABEL = "\u0000";
  const parts = splitChapters(body, () => LABEL);
  const chapters = parts.map((p, i) => ({
    path: `#${i}`,
    title: p.title === LABEL ? null : clean(p.title),
  }));
  return {
    ...meta,
    chapters,
    indexOf: () => -1,
    async render(i, target) {
      const doc = parse(`<!doctype html><body>${parts[i]?.body ?? ""}</body>`, "text/html");
      const { fragment } = sanitize(doc.body, target);
      return { fragment, release() {} };
    },
  };
}

/** Opens a file for reading. Throws ConvertError("drm" | "invalid") for unreadable books. */
export async function openBook(file: Blob, format: Format): Promise<Book> {
  if (format === "epub") return openEpubBook(file);
  const text = await file.text();
  if (format === "txt") return openMarkupBook(textToXhtml(text), { title: null, lang: null });
  if (format === "md") return openMarkupBook(markdownToXhtml(text), { title: null, lang: null });
  const doc = parse(text, "text/html");
  return openMarkupBook(doc.body?.innerHTML ?? "", {
    title: clean(doc.title),
    lang: doc.documentElement.getAttribute("lang"),
  });
}
