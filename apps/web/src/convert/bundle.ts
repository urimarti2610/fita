import JSZip from "jszip";
import { ConvertError, type Resource, xml } from "./epub.js";

/**
 * A Markdown document together with the files next to it (a folder or a .zip),
 * so the images it references can travel inside the converted book.
 */
export type BundleFile = Blob | (() => Promise<Uint8Array>);
export type Bundle = {
  /** Path of the Markdown document inside the bundle, e.g. "notes/book.md". */
  path: string;
  markdown: string;
  /** Every other file, keyed by its normalized path inside the bundle. */
  files: Map<string, BundleFile>;
};

const MARKDOWN = /\.(?:md|markdown)$/i;
/** Folders that archivers and operating systems add and nobody means to convert. */
const JUNK = /(?:^|\/)(?:__MACOSX|\.[^/]*)(?:\/|$)/;

/**
 * Normalizes a path inside a bundle: forward slashes, no "." or empty parts.
 * Returns null when ".." would climb above the bundle's root.
 */
export function normalizePath(path: string): string | null {
  const out: string[] = [];
  for (const part of path.replace(/\\/g, "/").split("/")) {
    if (part === "..") {
      if (!out.length) return null;
      out.pop();
    } else if (part !== "." && part !== "") out.push(part);
  }
  return out.join("/");
}

/**
 * Resolves an image reference from a document at `from` to a path inside the
 * bundle. URLs with a scheme (https:, data:…) and paths that leave the bundle
 * resolve to null. A leading "/" means the bundle's root.
 */
export function resolveReference(from: string, src: string): string | null {
  const reference = src.trim().replace(/[?#].*$/, "");
  if (!reference || /^[a-z][a-z\d+.-]*:/i.test(reference) || reference.startsWith("//")) {
    return null;
  }
  let decoded = reference;
  try {
    decoded = decodeURIComponent(reference);
  } catch {
    // A literal "%" in a file name: use the reference as written.
  }
  if (decoded.startsWith("/")) return normalizePath(decoded);
  const dir = from.includes("/") ? from.slice(0, from.lastIndexOf("/") + 1) : "";
  return normalizePath(dir + decoded);
}

/** The document to convert: the shallowest Markdown file, preferring index/readme. */
export function pickMarkdown(paths: Iterable<string>): string | null {
  const rank = (path: string) => {
    const name = path.slice(path.lastIndexOf("/") + 1).toLowerCase();
    return /^(?:index|readme)\./.test(name) ? 0 : 1;
  };
  const candidates = [...paths].filter((p) => MARKDOWN.test(p) && !JUNK.test(p));
  candidates.sort(
    (a, b) =>
      a.split("/").length - b.split("/").length ||
      rank(a) - rank(b) ||
      a.localeCompare(b, "en", { numeric: true }),
  );
  return candidates[0] ?? null;
}

/** Builds a bundle from files picked as a folder; paths are relative to that folder. */
export async function folderBundle(entries: { path: string; file: Blob }[]): Promise<Bundle> {
  const files = new Map<string, BundleFile>();
  for (const entry of entries) {
    const path = normalizePath(entry.path);
    if (path && !JUNK.test(path)) files.set(path, entry.file);
  }
  const path = pickMarkdown(files.keys());
  const main = path ? files.get(path) : undefined;
  if (!path || !(main instanceof Blob)) throw new ConvertError("noMarkdown");
  return { path, markdown: await main.text(), files };
}

/** Opens a .zip with a Markdown document and its images. Entries are read only when used. */
export async function zipBundle(data: Blob): Promise<Bundle> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(await data.arrayBuffer());
  } catch {
    throw new ConvertError("invalid");
  }
  const files = new Map<string, BundleFile>();
  const entries = new Map<string, JSZip.JSZipObject>();
  zip.forEach((name, entry) => {
    // Entries that would climb out of the archive ("zip slip") are ignored.
    const path = normalizePath(name);
    if (entry.dir || !path || JUNK.test(path)) return;
    entries.set(path, entry);
    files.set(path, () => entry.async("uint8array"));
  });
  const path = pickMarkdown(entries.keys());
  const main = path ? entries.get(path) : undefined;
  if (!path || !main) throw new ConvertError("noMarkdown");
  return { path, markdown: await main.async("string"), files };
}

/** Image types every EPUB 3 reader must support (core media types), by extension. */
const CORE_IMAGES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  svg: "image/svg+xml",
  webp: "image/webp",
};
/** Further types a browser can show in an HTML export. */
const WEB_IMAGES: Record<string, string> = {
  ...CORE_IMAGES,
  avif: "image/avif",
  bmp: "image/bmp",
  ico: "image/x-icon",
};

const IMG = /<img\b[^>]*>/gi;

function attribute(tag: string, name: string): string | undefined {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i"));
  return m ? (m[1] ?? m[2] ?? "") : undefined;
}

function setAttribute(tag: string, name: string, value: string): string {
  return tag.replace(
    new RegExp(`(\\s${name}\\s*=\\s*)(?:"[^"]*"|'[^']*')`, "i"),
    (_, prefix: string) => `${prefix}"${xml(value)}"`,
  );
}

/** Undoes the escaping of an attribute value, enough for file names. */
function unescapeAttribute(value: string): string {
  return value.replace(/&(amp|lt|gt|quot|apos|#39);/g, (_, e: string) =>
    e === "amp" ? "&" : e === "lt" ? "<" : e === "gt" ? ">" : e === "quot" ? '"' : "'",
  );
}

function lookup(files: Map<string, BundleFile>, path: string): [string, BundleFile] | null {
  const exact = files.get(path);
  if (exact) return [path, exact];
  // Documents written on case-insensitive systems often get the case wrong.
  const lower = path.toLowerCase();
  for (const [key, file] of files) if (key.toLowerCase() === lower) return [key, file];
  return null;
}

async function bytes(file: BundleFile): Promise<Uint8Array> {
  return file instanceof Blob ? new Uint8Array(await file.arrayBuffer()) : file();
}

function base64(data: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < data.length; i += 0x8000) {
    binary += String.fromCharCode(...data.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

/** An image the book cannot carry is replaced by its description, so nothing is lost. */
const altText = (tag: string) => attribute(tag, "alt") ?? "";

/**
 * Makes the images of an XHTML body travel with an EPUB: each image found in the
 * bundle is added once as a resource under `images/` and the tag points to it.
 * Images that cannot be bundled (missing, outside the bundle, remote, or a type
 * readers do not support) become their alt text, so the book stays valid.
 */
export function bundleImagesForEpub(
  body: string,
  bundle: Bundle,
): { body: string; resources: Resource[] } {
  const resources: Resource[] = [];
  const added = new Map<string, string>();
  const out = body.replace(IMG, (tag) => {
    const src = unescapeAttribute(attribute(tag, "src") ?? "");
    if (src.startsWith("data:image/")) return tag;
    const path = resolveReference(bundle.path, src);
    const found = path === null ? null : lookup(bundle.files, path);
    const extension = found?.[0].split(".").pop()?.toLowerCase() ?? "";
    const type = CORE_IMAGES[extension];
    if (!found || !type) return altText(tag);
    let href = added.get(found[0]);
    if (!href) {
      href = `images/image-${String(added.size + 1).padStart(4, "0")}.${extension}`;
      added.set(found[0], href);
      const file = found[1];
      resources.push({ href, type, data: file instanceof Blob ? file : file() });
    }
    return setAttribute(tag, "src", href);
  });
  return { body: out, resources };
}

/**
 * Makes an HTML export self-contained: images found in the bundle are embedded
 * as data URLs. Anything else (remote images, missing files) is left as written.
 */
export async function inlineImagesForHtml(body: string, bundle: Bundle): Promise<string> {
  const cache = new Map<string, string>();
  const parts: string[] = [];
  let last = 0;
  for (const m of body.matchAll(IMG)) {
    const tag = m[0];
    parts.push(body.slice(last, m.index));
    last = m.index + tag.length;
    const path = resolveReference(bundle.path, unescapeAttribute(attribute(tag, "src") ?? ""));
    const found = path === null ? null : lookup(bundle.files, path);
    const type = WEB_IMAGES[found?.[0].split(".").pop()?.toLowerCase() ?? ""];
    if (!found || !type) {
      parts.push(tag);
      continue;
    }
    let url = cache.get(found[0]);
    if (!url) {
      url = `data:${type};base64,${base64(await bytes(found[1]))}`;
      cache.set(found[0], url);
    }
    parts.push(setAttribute(tag, "src", url));
  }
  parts.push(body.slice(last));
  return parts.join("");
}
