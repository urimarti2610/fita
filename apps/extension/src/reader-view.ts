import { applyToElement, type Controller, EMPHASIS_CSS, STYLE_ATTRIBUTE } from "@fita/core";
import { Readability } from "@mozilla/readability";
import { EXTENSION_BRAND } from "../brand.js";
import type { Settings } from "./settings.js";

/** Host element of the reading view. Lives outside <body>, like the ruler. */
export const READER_TAG = `${EXTENSION_BRAND.id}-reader`;

export type Article = {
  title: string;
  byline: string;
  siteName: string;
  lang: string;
  dir: string;
  /** Cleaned article markup, already parsed and sanitized. */
  content: DocumentFragment;
};

/** Elements dropped from the article even if Readability kept them. */
const UNSAFE =
  "script, style, link, meta, base, iframe, frame, object, embed, form, input, button, select, textarea, template, noscript";
const URL_ATTRS = ["href", "src", "action", "formaction", "xlink:href", "poster"];

/**
 * Removes anything that could run code or load something unexpected: scripts, frames,
 * event handlers and javascript: URLs. Readability already drops most of it.
 */
export function sanitize(root: ParentNode) {
  for (const el of root.querySelectorAll(UNSAFE)) el.remove();
  for (const el of root.querySelectorAll("*")) {
    for (const attr of [...el.attributes]) {
      const name = attr.name.toLowerCase();
      // Browsers ignore control characters and spaces inside URL schemes.
      const value = [...attr.value]
        .filter((c) => c > " ")
        .join("")
        .toLowerCase();
      if (name.startsWith("on") || name === "style" || name === "srcdoc")
        el.removeAttribute(attr.name);
      else if (URL_ATTRS.includes(name) && /^(javascript|vbscript|data:text\/html)/.test(value))
        el.removeAttribute(attr.name);
    }
  }
}

/** Extracts the main article of a document, or null when there is none. Never touches `doc`. */
export function extractArticle(doc: Document): Article | null {
  const clone = doc.cloneNode(true) as Document;
  const parsed = new Readability(clone, { keepClasses: false }).parse();
  if (!parsed?.content || !parsed.textContent?.trim()) return null;
  const parsedDoc = new DOMParser().parseFromString(parsed.content, "text/html");
  sanitize(parsedDoc.body);
  const content = doc.createDocumentFragment();
  for (const node of [...parsedDoc.body.childNodes]) content.append(doc.importNode(node, true));
  return {
    title: parsed.title?.trim() || doc.title,
    byline: parsed.byline?.trim() ?? "",
    siteName: parsed.siteName?.trim() ?? "",
    lang: parsed.lang || doc.documentElement.lang,
    dir: parsed.dir || doc.dir,
    content,
  };
}

const VIEW_CSS = `
:host { all: initial; }
dialog {
  --bg: #fbfaf7; --fg: #1d1d1b; --muted: #5b5a55; --line: #d9d6cc; --accent: #1d6a72; --focus: #2f6fdd;
  position: fixed; inset: 0; width: 100%; height: 100%; max-width: none; max-height: none;
  margin: 0; padding: 0; border: 0; overflow: auto; box-sizing: border-box;
  background: var(--bg); color: var(--fg); color-scheme: light dark;
  font: 1.2rem / var(--lh, 1.7) system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
@media (prefers-color-scheme: dark) {
  dialog { --bg: #1b1c1a; --fg: #ecebe6; --muted: #b3b1a8; --line: #3b3c38; --accent: #7fd0d6; --focus: #8fb7ff; }
}
dialog::backdrop { background: var(--bg, #fbfaf7); }
.bar {
  position: sticky; top: 0; display: flex; justify-content: flex-end;
  padding: 0.6rem 1rem; background: var(--bg); border-bottom: 1px solid var(--line);
}
.close {
  font: inherit; font-size: 0.95rem; font-weight: 600; padding: 0.4rem 0.9rem; cursor: pointer;
  color: var(--fg); background: transparent; border: 1px solid var(--line); border-radius: 10px;
}
:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; border-radius: 6px; }
article { max-width: var(--mw, 65ch); margin: 0 auto; padding: 1.5rem 1.25rem 4rem; overflow-wrap: break-word; }
.site, .byline { color: var(--muted); font-size: 0.95rem; margin: 0 0 0.5rem; }
h1 { font-size: 1.9rem; line-height: 1.25; margin: 0 0 0.75rem; }
h2, h3, h4, h5, h6 { line-height: 1.3; margin: 2rem 0 0.75rem; }
p, ul, ol, dl, blockquote, figure, table, pre { margin: 0 0 1.1rem; }
a { color: var(--accent); }
img, video, picture, svg { max-width: 100%; height: auto; }
figcaption { color: var(--muted); font-size: 0.95rem; }
blockquote { margin-inline: 0; padding-inline-start: 1rem; border-inline-start: 3px solid var(--line); }
pre, code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 0.9em; }
pre { overflow: auto; padding: 0.75rem; border: 1px solid var(--line); border-radius: 8px; }
table { border-collapse: collapse; display: block; overflow-x: auto; }
td, th { border: 1px solid var(--line); padding: 0.3rem 0.5rem; }
${EMPHASIS_CSS}
`;

export type ReaderView = {
  /** Opens the view with an article; replaces one already open. */
  open(article: Article, settings: Settings): void;
  /** Applies new settings (line spacing, width, style, strength) while open. */
  update(settings: Settings): void;
  close(): void;
  readonly isOpen: boolean;
};

/**
 * Shows an article in a full-page modal dialog inside a closed shadow root, with the
 * emphasis applied. The page underneath is left untouched and becomes inert.
 */
export function createReaderView(doc: Document, labels: { close: string }): ReaderView {
  let host: HTMLElement | null = null;
  let dialog: HTMLDialogElement | null = null;
  let article: HTMLElement | null = null;
  let controller: Controller | null = null;

  function style(settings: Settings) {
    if (!dialog || !article) return;
    dialog.style.setProperty("--lh", settings.lineHeight > 0 ? String(settings.lineHeight) : "1.7");
    dialog.style.setProperty("--mw", settings.maxWidth > 0 ? `${settings.maxWidth}ch` : "65ch");
    article.setAttribute(STYLE_ATTRIBUTE, settings.style);
  }

  function close() {
    controller?.stop();
    controller = null;
    if (dialog?.open) dialog.close();
    host?.remove();
    host = dialog = article = null;
  }

  return {
    open(data, settings) {
      close();
      host = doc.createElement(READER_TAG);
      const root = host.attachShadow({ mode: "closed" });
      const css = doc.createElement("style");
      css.textContent = VIEW_CSS;
      dialog = doc.createElement("dialog");
      dialog.setAttribute("aria-labelledby", "title");
      if (data.lang) dialog.lang = data.lang;
      if (data.dir) dialog.dir = data.dir;

      const bar = doc.createElement("div");
      bar.className = "bar";
      const button = doc.createElement("button");
      button.type = "button";
      button.className = "close";
      button.textContent = labels.close;
      button.addEventListener("click", close);
      bar.append(button);

      article = doc.createElement("article");
      if (data.siteName) article.append(paragraph(doc, "site", data.siteName));
      const h1 = doc.createElement("h1");
      h1.id = "title";
      h1.textContent = data.title;
      article.append(h1);
      if (data.byline) article.append(paragraph(doc, "byline", data.byline));
      article.append(data.content);

      dialog.append(bar, article);
      // Esc closes the dialog natively; tidy up afterwards.
      dialog.addEventListener("close", () => {
        if (host) close();
      });
      root.append(css, dialog);
      doc.documentElement.append(host);
      style(settings);
      dialog.showModal();
      dialog.scrollTop = 0;
      button.focus();
      controller = applyToElement(
        article,
        { strength: settings.strength, every: settings.every },
        { injectStyles: false },
      );
    },
    update(settings) {
      if (!article) return;
      style(settings);
      controller?.update({ strength: settings.strength, every: settings.every });
    },
    close,
    get isOpen() {
      return host !== null;
    },
  };
}

function paragraph(doc: Document, className: string, text: string) {
  const p = doc.createElement("p");
  p.className = className;
  p.textContent = text;
  return p;
}
