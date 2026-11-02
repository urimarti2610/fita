import JSZip from "jszip";

/** Thrown for books we must not or cannot convert; `code` maps to a UI message. */
export class ConvertError extends Error {
  constructor(public readonly code: "drm" | "invalid") {
    super(code);
  }
}

export type Progress = (fraction: number) => void;
/** Turns one (X)HTML document into its emphasized version. */
export type MarkupTransform = (markup: string) => string;

/** Font obfuscation is listed in encryption.xml too, but it is not DRM. */
const FONT_OBFUSCATION = new Set([
  "http://www.idpf.org/2008/embedding",
  "http://ns.adobe.com/pdf/enc#RC",
]);
/** Formats that are already compressed: storing them is faster and as small. */
const STORED = /\.(?:jpe?g|png|gif|webp|avif|woff2?|otf|ttf|mp3|mp4|m4a|ogg|webm|zip)$/i;

function attributes(tag: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const m of tag.matchAll(/([\w:.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
    result[(m[1] as string).toLowerCase()] = m[2] ?? m[3] ?? "";
  }
  return result;
}

/** Resolves an href from the OPF against the OPF's folder, as a zip path. */
function resolve(base: string, href: string): string {
  const path = decodeURIComponent(href.split("#")[0] as string);
  const parts = (base + path).split("/");
  const out: string[] = [];
  for (const part of parts) {
    if (part === "..") out.pop();
    else if (part !== "." && part !== "") out.push(part);
  }
  return out.join("/");
}

/** True when the book has real DRM (not just font obfuscation). */
export async function hasDRM(zip: JSZip): Promise<boolean> {
  if (zip.file("META-INF/rights.xml")) return true;
  const encryption = zip.file("META-INF/encryption.xml");
  if (!encryption) return false;
  const xml = await encryption.async("string");
  const algorithms = [...xml.matchAll(/EncryptionMethod[^>]*Algorithm\s*=\s*["']([^"']+)/g)].map(
    (m) => m[1] as string,
  );
  return algorithms.some((a) => !FONT_OBFUSCATION.has(a));
}

/** Reads container.xml and the OPF: spine documents and declared language. */
async function readPackage(zip: JSZip) {
  const container = await zip.file("META-INF/container.xml")?.async("string");
  const opfPath = container?.match(/full-path\s*=\s*["']([^"']+)/)?.[1];
  const opf = opfPath ? await zip.file(opfPath)?.async("string") : undefined;
  if (!opfPath || !opf) throw new ConvertError("invalid");
  const base = opfPath.includes("/") ? opfPath.slice(0, opfPath.lastIndexOf("/") + 1) : "";
  const items = new Map<string, { href: string; type: string }>();
  for (const m of opf.matchAll(/<(?:\w+:)?item\b[^>]*>/g)) {
    const a = attributes(m[0]);
    if (a.id && a.href)
      items.set(a.id, { href: resolve(base, a.href), type: a["media-type"] ?? "" });
  }
  const spine: string[] = [];
  for (const m of opf.matchAll(/<(?:\w+:)?itemref\b[^>]*>/g)) {
    const item = items.get(attributes(m[0]).idref ?? "");
    if (item && /x?html/.test(item.type) && zip.file(item.href)) spine.push(item.href);
  }
  const language = opf.match(/<dc:language[^>]*>\s*([^<\s]+)/)?.[1];
  return { spine, language };
}

/** Adds the emphasis stylesheet to a chapter's <head>. */
export function addStyle(markup: string, css: string): string {
  const style = `<style type="text/css">${css}</style>`;
  const head = markup.search(/<\/head\s*>/i);
  return head === -1 ? markup : `${markup.slice(0, head)}${style}${markup.slice(head)}`;
}

/** Language declared by the book, read before converting so segmentation can use it. */
export async function openEpub(data: Blob | ArrayBuffer) {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(data instanceof Blob ? await data.arrayBuffer() : data);
  } catch {
    throw new ConvertError("invalid");
  }
  if (await hasDRM(zip)) throw new ConvertError("drm");
  const pkg = await readPackage(zip);
  return { zip, ...pkg };
}

/**
 * Emphasizes every spine document, one at a time, and repackages the book:
 * `mimetype` first and uncompressed, metadata, images and fonts untouched.
 */
export async function convertEpub(
  book: Awaited<ReturnType<typeof openEpub>>,
  transform: MarkupTransform,
  css: string,
  progress: Progress,
): Promise<Blob> {
  const { zip, spine } = book;
  const chapters = new Set(spine);
  const out = new JSZip();
  out.file("mimetype", "application/epub+zip", { compression: "STORE" });

  const entries: JSZip.JSZipObject[] = [];
  zip.forEach((_, entry) => {
    if (entry.name !== "mimetype") entries.push(entry);
  });

  let done = 0;
  for (const entry of entries) {
    if (entry.dir) {
      out.folder(entry.name);
      continue;
    }
    if (chapters.has(entry.name)) {
      // One chapter in memory at a time; the string is released after this iteration.
      const markup = await entry.async("string");
      out.file(entry.name, addStyle(transform(markup), css));
      progress((++done / chapters.size) * 0.8);
    } else {
      out.file(entry.name, entry.async("uint8array"), {
        compression: STORED.test(entry.name) ? "STORE" : "DEFLATE",
      });
    }
  }
  return out.generateAsync(
    { type: "blob", mimeType: "application/epub+zip", compression: "DEFLATE" },
    (meta) => progress(0.8 + (meta.percent / 100) * 0.2),
  );
}

export type Chapter = { title: string; body: string };

/** Escapes text for XML content and attributes. */
export function xml(text: string): string {
  return text.replace(
    /[&<>"]/g,
    (c) => `&${{ "&": "amp", "<": "lt", ">": "gt", '"': "quot" }[c]};`,
  );
}

/** Complete XHTML document for an EPUB chapter or a standalone HTML export. */
export function xhtmlDocument(title: string, lang: string, body: string, head = ""): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${xml(lang)}" xml:lang="${xml(lang)}">
<head>
<meta charset="utf-8"/>
<title>${xml(title)}</title>
${head}</head>
<body>
${body}
</body>
</html>
`;
}

/** Builds a minimal, valid EPUB 3 from already-emphasized XHTML chapter bodies. */
export async function buildEpub(options: {
  title: string;
  lang: string;
  chapters: Chapter[];
  css: string;
  contentsLabel: string;
  progress: Progress;
}): Promise<Blob> {
  const { title, lang, chapters, css, contentsLabel, progress } = options;
  const zip = new JSZip();
  zip.file("mimetype", "application/epub+zip", { compression: "STORE" });
  zip.file(
    "META-INF/container.xml",
    `<?xml version="1.0" encoding="utf-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
<rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles>
</container>
`,
  );
  const link = '<link rel="stylesheet" type="text/css" href="style.css"/>\n';
  const files = chapters.map((_, i) => `chapter-${String(i + 1).padStart(4, "0")}.xhtml`);
  chapters.forEach((chapter, i) => {
    zip.file(`OEBPS/${files[i]}`, xhtmlDocument(chapter.title, lang, chapter.body, link));
  });
  zip.file("OEBPS/style.css", css);
  const toc = chapters
    .map((c, i) => `<li><a href="${files[i]}">${xml(c.title)}</a></li>`)
    .join("\n");
  zip.file(
    "OEBPS/nav.xhtml",
    xhtmlDocument(
      contentsLabel,
      lang,
      `<nav epub:type="toc" id="toc"><h1>${xml(contentsLabel)}</h1>\n<ol>\n${toc}\n</ol></nav>`,
      link,
    ),
  );
  const modified = `${new Date().toISOString().slice(0, 19)}Z`;
  zip.file(
    "OEBPS/content.opf",
    `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid" xml:lang="${xml(lang)}">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:identifier id="uid">urn:uuid:${crypto.randomUUID()}</dc:identifier>
<dc:title>${xml(title)}</dc:title>
<dc:language>${xml(lang)}</dc:language>
<meta property="dcterms:modified">${modified}</meta>
</metadata>
<manifest>
<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
<item id="css" href="style.css" media-type="text/css"/>
${files.map((f, i) => `<item id="c${i + 1}" href="${f}" media-type="application/xhtml+xml"/>`).join("\n")}
</manifest>
<spine>
${files.map((_, i) => `<itemref idref="c${i + 1}"/>`).join("\n")}
</spine>
</package>
`,
  );
  return zip.generateAsync(
    { type: "blob", mimeType: "application/epub+zip", compression: "DEFLATE" },
    (meta) => progress(0.8 + (meta.percent / 100) * 0.2),
  );
}
