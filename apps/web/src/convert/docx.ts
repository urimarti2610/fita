import { createEmphasizer, type EmphasisOptions, type EmphasisStyle } from "@fita/core";
import JSZip from "jszip";
import { ConvertError, type Progress } from "./epub.js";

/**
 * Word documents (.docx): WordprocessingML in a zip. Text lives in runs
 * (<w:r>) of paragraphs (<w:p>); each run has its own formatting (<w:rPr>).
 * Emphasis is computed over a whole paragraph, because Word often splits a
 * single word across several runs, and then each run is split where the
 * emphasis starts and ends. The new runs copy the original formatting and add
 * bold, colour or underline. Everything else in the package stays untouched.
 */

/** Old Word files and password-protected .docx are OLE compound files, not zips. */
const OLE = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];

/** Parts with body text: the document, headers, footers, notes and comments. */
const TEXT_PART = /^word\/(?:document\d*|header\d+|footer\d+|footnotes|endnotes|comments)\.xml$/;

/** Colour for the faded rest of a word: grey with 5.7:1 contrast on white. */
const FADE_COLOR = "666666";
/** Same blue as the ebook stylesheet's colour style. */
const EMPHASIS_COLOR = "1F5FA8";

/** Order of run properties required by the schema (CT_RPr). */
const RPR_ORDER = [
  "rStyle",
  "rFonts",
  "b",
  "bCs",
  "i",
  "iCs",
  "caps",
  "smallCaps",
  "strike",
  "dstrike",
  "outline",
  "shadow",
  "emboss",
  "imprint",
  "noProof",
  "snapToGrid",
  "vanish",
  "webHidden",
  "color",
  "spacing",
  "w",
  "kern",
  "position",
  "sz",
  "szCs",
  "highlight",
  "u",
  "effect",
  "bdr",
  "shd",
  "fitText",
  "vertAlign",
  "rtl",
  "cs",
  "em",
  "lang",
  "eastAsianLayout",
  "specVanish",
  "oMath",
];

type Element = { name: string; open: string; children: Node[]; close: string };
type Node = Element | string;

const TOKEN = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<\?[\s\S]*?\?>|<![^>]*>|<[^>]+>|[^<]+/g;
const NAME = /^<\/?([^\s/>]+)/;

function decode(text: string): string {
  return text.replace(/&(?:#(\d+)|#x([\da-f]+)|(amp|lt|gt|quot|apos));/gi, (_, d, h, n) => {
    if (d) return String.fromCodePoint(Number(d));
    if (h) return String.fromCodePoint(Number.parseInt(h, 16));
    return { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" }[(n as string).toLowerCase()] ?? "";
  });
}

const encode = (text: string) =>
  text.replace(/[&<>]/g, (c) => (c === "&" ? "&amp;" : c === "<" ? "&lt;" : "&gt;"));

function serialize(node: Node): string {
  if (typeof node === "string") return node;
  return node.open + node.children.map(serialize).join("") + node.close;
}

/** Text content of an element (for <w:t>). */
function textOf(element: Element): string {
  return element.children.map((c) => (typeof c === "string" ? decode(c) : textOf(c))).join("");
}

/** What each character of a paragraph becomes: emphasized, faded rest, or unchanged. */
type Mark = "e" | "r" | "n";

/** A piece of a run's content and its text in the paragraph. */
type Piece = { node: Element; text: string; start: number };
/** A run; `pieces` is null when it holds content that must stay as is (drawings, fields…). */
type Run = { element: Element; parent: Element; rPr: Element | null; pieces: Piece[] | null };

/** Run content that can be split and recombined without changing its meaning. */
const SPLITTABLE: Record<string, (e: Element) => string> = {
  "w:t": textOf,
  "w:tab": () => "\t",
  "w:br": () => "\n",
  "w:cr": () => "\n",
  "w:noBreakHyphen": () => "‑",
  "w:softHyphen": () => "­",
  "w:lastRenderedPageBreak": () => "",
};

/** Stands between runs that are left alone, so words never join across them. */
const BOUNDARY = "￼";

export type DocxStyle = {
  /** Properties for emphasized characters and for the rest of each word. */
  emphasis: Record<string, string>;
  rest: Record<string, string>;
};

/** Run properties that render each emphasis style in Word. */
export function docxStyle(style: EmphasisStyle): DocxStyle {
  const bold = { b: "<w:b/>", bCs: "<w:bCs/>" };
  const fade = { color: `<w:color w:val="${FADE_COLOR}"/>` };
  switch (style) {
    case "bold-fade":
      return { emphasis: bold, rest: fade };
    case "bold":
      return { emphasis: bold, rest: {} };
    case "color":
      return { emphasis: { color: `<w:color w:val="${EMPHASIS_COLOR}"/>` }, rest: {} };
    case "underline":
      return { emphasis: { u: '<w:u w:val="single"/>' }, rest: {} };
    case "fade":
      return { emphasis: {}, rest: fade };
  }
}

function localName(name: string): string {
  return name.slice(name.indexOf(":") + 1);
}

/** Returns the run properties with `props` set, keeping the schema's element order. */
function withProperties(rPr: Element | null, props: Record<string, string>) {
  const children = (rPr?.children ?? []).filter((c): c is Element => typeof c !== "string");
  const rank = (e: Element) => {
    if (!e.name.startsWith("w:")) return 900; // extensions (w14:…) go after the base set
    const i = RPR_ORDER.indexOf(localName(e.name));
    return i === -1 ? 999 : i; // rPrChange and unknowns last
  };
  const out = [...children];
  for (const [name, markup] of Object.entries(props)) {
    const existing = out.findIndex((e) => e.name === `w:${name}`);
    const element: Element = { name: `w:${name}`, open: markup, children: [], close: "" };
    if (existing !== -1) out[existing] = element;
    else out.push(element);
  }
  out.sort((a, b) => rank(a) - rank(b));
  const open = rPr ? rPr.open.replace(/\s*\/>$/, ">") : "<w:rPr>";
  return `${open}${out.map(serialize).join("")}</w:rPr>`;
}

type Emphasizer = ReturnType<typeof createEmphasizer>;

/** Collects the runs of a paragraph; nested paragraphs (text boxes) are handled on their own. */
function collect(element: Element, runs: Run[], nested: Element[]) {
  for (const child of element.children) {
    if (typeof child === "string") continue;
    if (child.name === "w:p") {
      nested.push(child);
    } else if (child.name === "w:r") {
      let rPr: Element | null = null;
      const pieces: Piece[] = [];
      let splittable = true;
      for (const c of child.children) {
        if (typeof c === "string") continue;
        if (c.name === "w:rPr") rPr = c;
        else if (SPLITTABLE[c.name]) pieces.push({ node: c, text: "", start: 0 });
        else splittable = false;
      }
      if (splittable) runs.push({ element: child, parent: element, rPr, pieces });
      else {
        runs.push({ element: child, parent: element, rPr: null, pieces: null });
        collect(child, [], nested); // look for text boxes inside drawings
      }
    } else if (child.name !== "w:del" && child.name !== "w:moveFrom") {
      collect(child, runs, nested);
    }
  }
}

function emphasizeParagraph(paragraph: Element, emphasize: Emphasizer, style: DocxStyle) {
  const runs: Run[] = [];
  const nested: Element[] = [];
  collect(paragraph, runs, nested);
  for (const inner of nested) emphasizeParagraph(inner, emphasize, style);

  let text = "";
  for (const run of runs) {
    if (!run.pieces) {
      text += BOUNDARY;
      continue;
    }
    for (const piece of run.pieces) {
      piece.start = text.length;
      piece.text = (SPLITTABLE[piece.node.name] as (e: Element) => string)(piece.node);
      text += piece.text;
    }
  }
  if (!/\p{L}/u.test(text)) return;

  const marks: Mark[] = [];
  for (const span of emphasize(text)) {
    const mark: Mark = span.emphasis ? "e" : /\p{L}/u.test(span.text) ? "r" : "n";
    for (let i = 0; i < span.text.length; i++) marks.push(mark);
  }

  for (const run of runs) {
    if (!run.pieces?.length) continue;
    // Faded text keeps a colour the author chose on purpose.
    const has = (name: string) =>
      !!run.rPr?.children.some((c) => typeof c !== "string" && c.name === `w:${name}`);
    const rest = Object.fromEntries(Object.entries(style.rest).filter(([name]) => !has(name)));
    const props: Record<Mark, Record<string, string>> = { e: style.emphasis, r: rest, n: {} };
    const at = (index: number): Mark => {
      const mark = marks[index] ?? "n";
      return Object.keys(props[mark]).length ? mark : "n";
    };
    // Consecutive fragments with the same mark become one new run.
    const groups: { mark: Mark; content: string }[] = [];
    const add = (mark: Mark, content: string) => {
      const last = groups[groups.length - 1];
      if (last && last.mark === mark) last.content += content;
      else groups.push({ mark, content });
    };
    for (const piece of run.pieces) {
      if (piece.node.name !== "w:t") {
        // Tabs, breaks and hyphens join the fragment before them.
        const mark = groups[groups.length - 1]?.mark ?? at(piece.start);
        add(mark, serialize(piece.node));
        continue;
      }
      let from = 0;
      for (let i = 1; i <= piece.text.length; i++) {
        const mark = at(piece.start + from);
        if (i < piece.text.length && at(piece.start + i) === mark) continue;
        const fragment = piece.text.slice(from, i);
        add(mark, `<w:t xml:space="preserve">${encode(fragment)}</w:t>`);
        from = i;
      }
    }
    if (groups.every((g) => g.mark === "n")) continue;
    const openRun = run.element.open;
    const replacement = groups
      .map((g) => {
        const rPr =
          g.mark !== "n"
            ? withProperties(run.rPr, props[g.mark])
            : run.rPr
              ? serialize(run.rPr)
              : "";
        return `${openRun}${rPr}${g.content}</w:r>`;
      })
      .join("");
    const index = run.parent.children.indexOf(run.element);
    run.parent.children[index] = replacement;
  }
}

/**
 * Emphasizes one WordprocessingML part. Paragraphs are parsed and rewritten one
 * at a time; markup outside paragraphs is copied as is.
 */
export function emphasizeWordXml(
  xml: string,
  emphasize: Emphasizer,
  style: DocxStyle,
  progress: (fraction: number) => void = () => {},
): string {
  const out: string[] = [];
  const stack: Element[] = [];
  let reported = 0;
  for (const m of xml.matchAll(TOKEN)) {
    const token = m[0];
    const inside = stack.length > 0;
    const name = token[0] === "<" ? NAME.exec(token)?.[1] : undefined;
    const special = !name || token[1] === "!" || token[1] === "?";
    if (!inside) {
      if (name === "w:p" && !special && token[1] !== "/" && !token.endsWith("/>")) {
        stack.push({ name, open: token, children: [], close: "" });
      } else out.push(token);
      continue;
    }
    const top = stack[stack.length - 1] as Element;
    if (special) {
      top.children.push(token);
    } else if (token[1] === "/") {
      top.close = token;
      stack.pop();
      if (stack.length) continue;
      emphasizeParagraph(top, emphasize, style);
      out.push(serialize(top));
      const index = m.index + token.length;
      if (index - reported > 1_000_000) {
        reported = index;
        progress(index / xml.length);
      }
    } else if (token.endsWith("/>")) {
      top.children.push({ name: name as string, open: token, children: [], close: "" });
    } else {
      const element: Element = { name: name as string, open: token, children: [], close: "" };
      top.children.push(element);
      stack.push(element);
    }
  }
  // Unclosed paragraph at the end of a broken file: keep it as it was.
  if (stack.length) out.push(serialize(stack[0] as Element));
  return out.join("");
}

export type OpenDocx = { zip: JSZip; parts: string[]; language?: string };

/** Opens a .docx and lists the parts with text. Refuses encrypted and legacy files. */
export async function openDocx(data: Blob): Promise<OpenDocx> {
  const buffer = await data.arrayBuffer();
  const head = new Uint8Array(buffer, 0, Math.min(8, buffer.byteLength));
  if (OLE.every((b, i) => head[i] === b)) throw new ConvertError("locked");
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(buffer);
  } catch {
    throw new ConvertError("invalid");
  }
  const rels = await zip.file("_rels/.rels")?.async("string");
  const main =
    rels
      ?.match(/<Relationship\b[^>]*officeDocument"[^>]*>/)?.[0]
      .match(/Target\s*=\s*"\/?([^"]+)"/)?.[1] ?? "word/document.xml";
  if (!zip.file(main)) throw new ConvertError("invalid");
  const parts = [main];
  zip.forEach((path) => {
    if (path !== main && TEXT_PART.test(path)) parts.push(path);
  });
  const styles = await zip.file("word/styles.xml")?.async("string");
  const language = styles?.match(/<w:lang\b[^>]*\sw:val="([^"]+)"/)?.[1];
  return language ? { zip, parts, language } : { zip, parts };
}

/** Emphasizes every text part of a .docx, one part at a time, and repackages it. */
export async function convertDocx(
  docx: OpenDocx,
  options: Partial<EmphasisOptions>,
  style: EmphasisStyle,
  progress: Progress,
): Promise<Blob> {
  const emphasize = createEmphasizer(options);
  const word = docxStyle(style);
  const parts = new Set(docx.parts);
  const out = new JSZip();
  const entries: JSZip.JSZipObject[] = [];
  docx.zip.forEach((_, entry) => {
    entries.push(entry);
  });
  let done = 0;
  for (const entry of entries) {
    if (entry.dir) continue;
    if (parts.has(entry.name)) {
      const xml = await entry.async("string");
      const share = 0.8 / parts.size;
      out.file(
        entry.name,
        emphasizeWordXml(xml, emphasize, word, (f) => progress(done * share + f * share)),
      );
      progress(++done * share);
    } else {
      out.file(entry.name, entry.async("uint8array"), { createFolders: false });
    }
  }
  return out.generateAsync(
    {
      type: "blob",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      compression: "DEFLATE",
    },
    (meta) => progress(0.8 + (meta.percent / 100) * 0.2),
  );
}

/** Paragraphs of the start of a document, for the preview: [isHeading, text]. */
export function docxParagraphs(xml: string, limit: number): { heading: boolean; text: string }[] {
  const blocks: { heading: boolean; text: string }[] = [];
  let length = 0;
  for (const m of xml.matchAll(/<w:p[\s>][\s\S]*?<\/w:p>/g)) {
    const p = m[0];
    const text = decode(
      [...p.matchAll(/<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g)].map((t) => t[1]).join(""),
    )
      .replace(/\s+/g, " ")
      .trim();
    if (!text) continue;
    const pStyle = p.match(/<w:pStyle\s+w:val="([^"]+)"/)?.[1] ?? "";
    blocks.push({
      heading: /heading|title|t[ií]tol|t[ií]tulo|berschrift|titre/i.test(pStyle),
      text,
    });
    length += text.length;
    if (length >= limit) break;
  }
  return blocks;
}
