import { BRAND } from "./brand.js";
import { DEFAULT_STYLE, EMPHASIS_CLASS, type EmphasisStyle } from "./dom.js";
import { createEmphasizer, type EmphasisOptions } from "./emphasize.js";

/**
 * Markup-level emphasis for (X)HTML strings: the DOM-free counterpart of
 * applyToElement, for contexts without a DOM such as Web Workers (EPUB conversion).
 * Text between tags is emphasized; tags, attributes, comments and skipped
 * elements pass through byte for byte.
 */

/** Class of the non-emphasized text, for the styles that fade it. */
export const REST_CLASS = `${BRAND.id}-r`;

/** Elements whose content is copied verbatim, as in SKIP_SELECTOR. */
const SKIP_TAGS = new Set([
  "head",
  "script",
  "style",
  "noscript",
  "textarea",
  "select",
  "option",
  "code",
  "pre",
  "kbd",
  "samp",
  "svg",
  "math",
  "canvas",
  "iframe",
  "title",
  "template",
]);
/** Elements whose content is raw text in HTML: it may contain "<" and is skipped wholesale. */
const RAW_TEXT_TAGS = new Set(["script", "style", "textarea", "title", "xmp", "noscript"]);
const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "source",
  "track",
  "wbr",
]);

const OPEN_TAG =
  /<([A-Za-z][^\s/>]*)((?:\s+[^\s=/>]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*(\/?)>/y;
const CLOSE_TAG = /<\/([A-Za-z][^\s/>]*)\s*>/y;
const SKIP_ATTRS =
  /\scontenteditable(?:\s*=\s*(?!["']?false["']?)|\s|$)|\saria-hidden\s*=\s*["']?true/i;

/** Named entities beyond XML's five: the common ones in ebooks and web pages. */
const NAMED: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  shy: "­",
  ndash: "–",
  mdash: "—",
  hellip: "…",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  laquo: "«",
  raquo: "»",
  middot: "·",
  iexcl: "¡",
  iquest: "¿",
  copy: "©",
  reg: "®",
  deg: "°",
  euro: "€",
  thinsp: " ",
  ensp: " ",
  emsp: " ",
  zwj: "‍",
  zwnj: "‌",
};
// Latin-1 letters: &aacute; &Ntilde; &ccedil; &ouml; &szlig; …
for (const [base, marks] of Object.entries({
  a: "grave acute circ tilde uml ring",
  e: "grave acute circ uml",
  i: "grave acute circ uml",
  o: "grave acute circ tilde uml",
  u: "grave acute circ uml",
  y: "acute",
  n: "tilde",
  c: "cedil",
})) {
  for (const mark of marks.split(" ")) {
    const combining = {
      grave: "̀",
      acute: "́",
      circ: "̂",
      tilde: "̃",
      uml: "̈",
      ring: "̊",
      cedil: "̧",
    }[mark] as string;
    NAMED[`${base}${mark}`] = `${base}${combining}`.normalize("NFC");
    NAMED[`${base.toUpperCase()}${mark}`] = `${base.toUpperCase()}${combining}`.normalize("NFC");
  }
}
Object.assign(NAMED, { szlig: "ß", aelig: "æ", AElig: "Æ", oslash: "ø", Oslash: "Ø", yuml: "ÿ" });

/** Stands in for an entity we cannot decode; not a letter, so it never joins a word. */
const OPAQUE = "￼";
const ENTITY = /&(?:#(\d+)|#[xX]([0-9a-fA-F]+)|([A-Za-z][A-Za-z0-9]*));/g;

function decode(text: string, opaque: string[]): string {
  return text.replace(ENTITY, (raw, dec?: string, hex?: string, name?: string) => {
    const code = dec ? Number.parseInt(dec, 10) : hex ? Number.parseInt(hex, 16) : -1;
    if (code > 0 && code <= 0x10ffff) return String.fromCodePoint(code);
    const named = name ? NAMED[name] : undefined;
    if (named) return named;
    opaque.push(raw);
    return OPAQUE;
  });
}

function encode(text: string, opaque: string[]): string {
  const escaped = text.replace(/[&<>]/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : "&gt;",
  );
  return opaque.length ? escaped.replaceAll(OPAQUE, () => opaque.shift() as string) : escaped;
}

export type MarkupConfig = {
  /** Emphasis style; the fading styles also wrap the plain parts. Default DEFAULT_STYLE. */
  style?: EmphasisStyle;
};

/**
 * Returns a stateful markup emphasizer: the `every` counter carries across calls,
 * so a book processed chapter by chapter behaves as one text.
 */
export function createMarkupEmphasizer(
  options: Partial<EmphasisOptions> = {},
  config: MarkupConfig = {},
) {
  const emphasizer = createEmphasizer(options);
  const style = config.style ?? DEFAULT_STYLE;
  const restOpen = style === "fade" || style === "bold-fade" ? `<span class="${REST_CLASS}">` : "";
  const restClose = restOpen ? "</span>" : "";

  function text(raw: string): string {
    if (!/[^\s]/.test(raw)) return raw;
    const opaque: string[] = [];
    const decoded = decode(raw, opaque);
    let out = "";
    for (const span of emphasizer(decoded)) {
      const encoded = encode(span.text, opaque);
      if (span.emphasis) out += `<span class="${EMPHASIS_CLASS}">${encoded}</span>`;
      else out += /\p{L}/u.test(span.text) ? `${restOpen}${encoded}${restClose}` : encoded;
    }
    return out;
  }

  return function emphasizeMarkup(markup: string): string {
    const out: string[] = [];
    const skip: string[] = [];
    let i = 0;
    while (i < markup.length) {
      const lt = markup.indexOf("<", i);
      const end = lt === -1 ? markup.length : lt;
      if (end > i) {
        const chunk = markup.slice(i, end);
        out.push(skip.length ? chunk : text(chunk));
        i = end;
        continue;
      }
      // At "<": comment, CDATA, processing instruction, doctype, or a tag.
      const special = [
        ["<!--", "-->"],
        ["<![CDATA[", "]]>"],
        ["<?", "?>"],
        ["<!", ">"],
      ].find(([open]) => markup.startsWith(open as string, i));
      if (special) {
        const close = markup.indexOf(special[1] as string, i);
        const stop = close === -1 ? markup.length : close + (special[1] as string).length;
        out.push(markup.slice(i, stop));
        i = stop;
        continue;
      }
      CLOSE_TAG.lastIndex = i;
      const closing = CLOSE_TAG.exec(markup);
      if (closing) {
        const name = localName(closing[1] as string);
        if (skip.length && skip[skip.length - 1] === name) skip.pop();
        out.push(closing[0]);
        i = CLOSE_TAG.lastIndex;
        continue;
      }
      OPEN_TAG.lastIndex = i;
      const opening = OPEN_TAG.exec(markup);
      if (!opening) {
        // A stray "<" in HTML text.
        out.push(skip.length ? "<" : "&lt;");
        i++;
        continue;
      }
      out.push(opening[0]);
      i = OPEN_TAG.lastIndex;
      const name = localName(opening[1] as string);
      const selfClosing = opening[3] === "/" || VOID_TAGS.has(name);
      if (selfClosing) continue;
      if (RAW_TEXT_TAGS.has(name)) {
        const close = findClose(markup, name, i);
        out.push(markup.slice(i, close));
        i = close;
        continue;
      }
      const skipped =
        skip.length > 0
          ? skip[skip.length - 1] === name
          : SKIP_TAGS.has(name) || SKIP_ATTRS.test(opening[2] ?? "");
      if (skipped) skip.push(name);
    }
    return out.join("");
  };
}

function localName(qualified: string): string {
  const colon = qualified.indexOf(":");
  return (colon === -1 ? qualified : qualified.slice(colon + 1)).toLowerCase();
}

/** Index of the closing tag of a raw-text element, case-insensitive. */
function findClose(markup: string, name: string, from: number): number {
  const re = new RegExp(`</(?:[A-Za-z][\\w.-]*:)?${name}\\s*>`, "iy");
  for (let i = markup.indexOf("</", from); i !== -1; i = markup.indexOf("</", i + 2)) {
    re.lastIndex = i;
    if (re.test(markup)) return i;
  }
  return markup.length;
}

/**
 * Stylesheet for static documents (ebooks, exported HTML). Uses only CSS that
 * e-readers support: no color-mix, no custom elements.
 */
export function staticEmphasisCSS(style: EmphasisStyle = DEFAULT_STYLE): string {
  const e = `.${EMPHASIS_CLASS}`;
  switch (style) {
    case "bold-fade":
      return `${e} { font-weight: bold; }\n.${REST_CLASS} { opacity: 0.72; }`;
    case "color":
      return `${e} { color: #1f5fa8; }`;
    case "underline":
      return `${e} { text-decoration: underline; }`;
    case "fade":
      return `.${REST_CLASS} { opacity: 0.72; }`;
    case "bold":
      return `${e} { font-weight: bold; }`;
  }
}
