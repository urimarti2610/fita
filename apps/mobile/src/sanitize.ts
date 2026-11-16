/**
 * Turns untrusted book markup into safe nodes for the reader. An allow list keeps
 * the text and its structure (headings, paragraphs, lists, tables, images) and drops
 * everything that could run code, load something from the network or restyle the
 * reader: scripts, styles, forms, frames, event handlers, inline styles and classes.
 * Elements outside the list are unwrapped, so their text is never lost.
 */

const HTML_NS = "http://www.w3.org/1999/xhtml";
const SVG_NS = "http://www.w3.org/2000/svg";
const XLINK_NS = "http://www.w3.org/1999/xlink";

/** Removed together with their content. */
const DROP = new Set([
  "script",
  "style",
  "link",
  "meta",
  "base",
  "head",
  "title",
  "iframe",
  "frame",
  "frameset",
  "object",
  "embed",
  "applet",
  "form",
  "input",
  "button",
  "select",
  "option",
  "textarea",
  "noscript",
  "template",
  "audio",
  "video",
  "source",
  "track",
  "canvas",
  "dialog",
  "portal",
]);

const HTML_TAGS = new Set([
  "a",
  "abbr",
  "address",
  "article",
  "aside",
  "b",
  "bdi",
  "bdo",
  "blockquote",
  "br",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "dd",
  "del",
  "details",
  "dfn",
  "div",
  "dl",
  "dt",
  "em",
  "figcaption",
  "figure",
  "footer",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hr",
  "i",
  "img",
  "ins",
  "kbd",
  "li",
  "main",
  "mark",
  "nav",
  "ol",
  "p",
  "pre",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "section",
  "small",
  "span",
  "strong",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "time",
  "tr",
  "u",
  "ul",
  "var",
  "wbr",
]);

/** Enough SVG for cover pages (an <image> inside an <svg>) and simple drawings. */
const SVG_TAGS = new Set([
  "svg",
  "g",
  "image",
  "path",
  "rect",
  "circle",
  "ellipse",
  "line",
  "polyline",
  "polygon",
  "text",
  "tspan",
]);

const ATTRIBUTES = new Set([
  "id",
  "lang",
  "dir",
  "alt",
  "title",
  "colspan",
  "rowspan",
  "headers",
  "scope",
  "start",
  "reversed",
  "value",
  "datetime",
  "abbr",
  "role",
  "aria-label",
  "aria-hidden",
  "width",
  "height",
]);

const SVG_ATTRIBUTES = new Set([
  "viewBox",
  "preserveAspectRatio",
  "x",
  "y",
  "width",
  "height",
  "d",
  "points",
  "cx",
  "cy",
  "r",
  "rx",
  "ry",
  "x1",
  "x2",
  "y1",
  "y2",
  "fill",
  "stroke",
  "stroke-width",
  "transform",
]);

/** Prefix for ids from the book, so they can never clash with the reader's own. */
export const ID_PREFIX = "book-";

export type LinkTarget =
  /** Another place in the book: a document path (empty for the current one) and an anchor. */
  { kind: "internal"; path: string; anchor: string } | { kind: "external"; href: string } | null;

export type SanitizeHooks = {
  /** Resolves an image source; return null to drop it. Async loading is up to the caller. */
  image?(src: string): string | null;
  /** Classifies a link target; null turns the link into plain text. */
  link?(href: string): LinkTarget;
};

/** Images that need loading after sanitizing (e.g. from inside a zip). */
export type PendingImage = { element: Element; attribute: string; source: string };

const EXTERNAL = /^(?:https?:|mailto:)/i;
const DATA_IMAGE = /^data:image\/(?:png|jpe?g|gif|webp|avif|svg\+xml);/i;

/** Default link classification: web and mail links leave the app, fragments stay. */
export function classifyLink(href: string): LinkTarget {
  if (EXTERNAL.test(href)) return { kind: "external", href };
  if (href.startsWith("#")) return { kind: "internal", path: "", anchor: href.slice(1) };
  return null;
}

/**
 * Copies the safe part of `source`'s children into a fragment of `target`.
 * Returns the fragment and the images whose `source` the caller must load.
 */
export function sanitize(
  source: Node,
  target: Document,
  hooks: SanitizeHooks = {},
): { fragment: DocumentFragment; images: PendingImage[] } {
  const fragment = target.createDocumentFragment();
  const images: PendingImage[] = [];
  const link = hooks.link ?? classifyLink;

  function copyAttributes(from: Element, to: Element, allowed: Set<string>) {
    for (const attr of Array.from(from.attributes)) {
      const name = attr.localName;
      if (attr.name === "xml:lang") to.setAttribute("lang", attr.value);
      else if (!attr.prefix && allowed.has(name)) {
        to.setAttribute(name, name === "id" ? ID_PREFIX + attr.value : attr.value);
      }
    }
  }

  function addImage(to: Element, raw: string | null, attribute: string) {
    const src = raw?.trim();
    if (!src) return;
    if (DATA_IMAGE.test(src)) {
      to.setAttribute(attribute, src);
      return;
    }
    const resolved = hooks.image?.(src);
    if (resolved) images.push({ element: to, attribute, source: resolved });
  }

  function copy(node: Node, parent: Node) {
    if (node.nodeType === 3 || node.nodeType === 4) {
      parent.appendChild(target.createTextNode((node as CharacterData).data));
      return;
    }
    if (node.nodeType !== 1) return;
    const el = node as Element;
    const name = el.localName.toLowerCase();
    const ns = el.namespaceURI;
    if (DROP.has(name)) return;

    let out: Element | null = null;
    if (ns === SVG_NS && SVG_TAGS.has(name)) {
      out = target.createElementNS(SVG_NS, name);
      for (const attr of Array.from(el.attributes)) {
        if (!attr.prefix && SVG_ATTRIBUTES.has(attr.localName)) {
          out.setAttribute(attr.localName, attr.value);
        }
      }
      if (name === "image") {
        const href = el.getAttributeNS(XLINK_NS, "href") ?? el.getAttribute("href");
        addImage(out, href, "href");
      }
    } else if ((ns === HTML_NS || ns === null) && HTML_TAGS.has(name)) {
      out = target.createElement(name);
      copyAttributes(el, out, ATTRIBUTES);
      if (name === "img") addImage(out, el.getAttribute("src"), "src");
      if (name === "a") {
        const href = el.getAttribute("href");
        const dest = href ? link(href) : null;
        if (dest?.kind === "external") {
          out.setAttribute("href", dest.href);
          out.setAttribute("target", "_blank");
          out.setAttribute("rel", "noopener noreferrer");
        } else if (dest?.kind === "internal") {
          out.setAttribute("href", `#${ID_PREFIX}${dest.anchor}`);
          out.setAttribute("data-path", dest.path);
          out.setAttribute("data-anchor", dest.anchor);
        }
      }
    }

    const container = out ?? parent;
    for (const child of Array.from(el.childNodes)) copy(child, container);
    if (out) parent.appendChild(out);
  }

  for (const child of Array.from(source.childNodes)) copy(child, fragment);
  return { fragment, images };
}
