import { BRAND, EMPHASIS_TAG, WRAP_TAG } from "./brand.js";
import { createEmphasizer, type EmphasisOptions, type Span } from "./emphasize.js";

export type EmphasisStyle = "bold" | "color" | "underline" | "fade";
export const EMPHASIS_STYLES: readonly EmphasisStyle[] = ["bold", "color", "underline", "fade"];

/** Set on an ancestor (usually <html>) to pick the emphasis style. Absent means bold. */
export const STYLE_ATTRIBUTE = `data-${BRAND.id}-style`;
/** Class names used when wrapping with plain spans (EPUB output must be valid XHTML). */
export const WRAP_CLASS = `${BRAND.id}-w`;
export const EMPHASIS_CLASS = `${BRAND.id}-e`;

const e = `${EMPHASIS_TAG}, .${EMPHASIS_CLASS}`;
const sel = (style: EmphasisStyle) =>
  e
    .split(", ")
    .map((s) => `[${STYLE_ATTRIBUTE}="${style}"] ${s}`)
    .join(", ");

/**
 * Emphasis styles. Every style derives its colours from the text's own colour,
 * so contrast holds on light, dark and custom page themes.
 */
export const EMPHASIS_CSS = `
${WRAP_TAG}, ${EMPHASIS_TAG} { all: unset; }
${e} { font-weight: bolder; }
${sel("color")} { font-weight: inherit; color: color-mix(in oklab, currentColor 55%, #2f6fdd); }
${sel("underline")} { font-weight: inherit; text-decoration: underline; text-decoration-thickness: 0.08em; text-underline-offset: 0.18em; text-decoration-color: color-mix(in srgb, currentColor 50%, transparent); }
[${STYLE_ATTRIBUTE}="fade"] ${WRAP_TAG}, [${STYLE_ATTRIBUTE}="fade"] .${WRAP_CLASS} { -webkit-text-fill-color: color-mix(in srgb, currentColor 55%, transparent); }
${sel("fade")} { font-weight: inherit; -webkit-text-fill-color: currentColor; }
`.trim();

/** Elements whose content is never touched. */
export const SKIP_SELECTOR = [
  "script",
  "style",
  "noscript",
  "textarea",
  "input",
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
  '[contenteditable]:not([contenteditable="false"])',
  '[aria-hidden="true"]',
  ".CodeMirror",
  ".monaco-editor",
  ".cm-editor",
  WRAP_TAG,
  `.${WRAP_CLASS}`,
].join(",");

export type ApplyConfig = {
  /**
   * "custom" wraps with <fita-w>/<fita-e>, immune to page CSS (default).
   * "span" wraps with <span class="fita-w">/<span class="fita-e">, valid in XHTML/EPUB.
   */
  elements?: "custom" | "span";
  /** Process everything synchronously before returning (no scheduling, no observer). */
  sync?: boolean;
  /** Watch for added content (infinite scroll, SPAs). Default true unless `sync`. */
  observe?: boolean;
  /** Inject the emphasis stylesheet into the document. Default true. */
  injectStyles?: boolean;
};

export type Controller = {
  /** Stop processing and observing. Already emphasized text stays. */
  stop(): void;
  /** Stop and restore the original text nodes. */
  undo(): void;
  /** Re-render everything with new options. */
  update(options: Partial<EmphasisOptions>): void;
  /** Resolves when the pending queue is empty (it may refill later on mutations). */
  readonly idle: Promise<void>;
};

/** Characters emphasized per unit of work (~300 words): the "batch" size. */
const CHUNK_CHARS = 2000;
/** Upper bound per idle slice, in case the platform reports generous idle time. */
const MAX_SLICE_MS = 12;
// NodeFilter constants, inlined so the module does not depend on a global NodeFilter.
const FILTER_ACCEPT = 1;
const FILTER_REJECT = 2;
const FILTER_SKIP = 3;
const SHOW_ELEMENT_AND_TEXT = 0x1 | 0x4;
const HAS_LETTER = /\p{L}/u;

type PartialWrap = { wrapper: Element; rest: Text };
type IdleDeadline = { timeRemaining(): number };
function schedule(win: typeof globalThis | null, fn: (deadline: IdleDeadline) => void) {
  if (win && typeof win.requestIdleCallback === "function") {
    win.requestIdleCallback(fn, { timeout: 200 });
  } else {
    const start = Date.now();
    setTimeout(() => fn({ timeRemaining: () => Math.max(0, 12 - (Date.now() - start)) }), 0);
  }
}

const sheets = new WeakMap<Document, { sheet?: CSSStyleSheet; style?: HTMLStyleElement }>();

function injectStyles(doc: Document) {
  if (sheets.has(doc)) return;
  const win = doc.defaultView;
  try {
    if (win && "adoptedStyleSheets" in doc && typeof win.CSSStyleSheet === "function") {
      const sheet = new win.CSSStyleSheet();
      sheet.replaceSync(EMPHASIS_CSS);
      doc.adoptedStyleSheets = [...doc.adoptedStyleSheets, sheet];
      sheets.set(doc, { sheet });
      return;
    }
  } catch {
    // Some contexts (e.g. Firefox content scripts) cannot adopt sheets: fall back.
  }
  const style = doc.createElement("style");
  style.textContent = EMPHASIS_CSS;
  (doc.head ?? doc.documentElement).append(style);
  sheets.set(doc, { style });
}

function removeStyles(doc: Document) {
  const entry = sheets.get(doc);
  if (!entry) return;
  if (entry.sheet) doc.adoptedStyleSheets = doc.adoptedStyleSheets.filter((s) => s !== entry.sheet);
  entry.style?.remove();
  sheets.delete(doc);
}

/** Language of the closest ancestor with a `lang` attribute, if any. */
function documentLocale(root: Element): string | undefined {
  const lang = root.closest("[lang]")?.getAttribute("lang")?.trim();
  if (!lang) return undefined;
  try {
    return Intl.getCanonicalLocales(lang)[0];
  } catch {
    return undefined;
  }
}

/**
 * Emphasizes every text node under `root`, in idle-time batches so that pages of any
 * size stay responsive. Returns a controller to stop, undo or re-render.
 */
export function applyToElement(
  root: Element,
  options: Partial<EmphasisOptions> = {},
  config: ApplyConfig = {},
): Controller {
  const doc = root.ownerDocument;
  const win = doc.defaultView;
  const useSpans = config.elements === "span";
  const wrapSelector = useSpans ? `span.${WRAP_CLASS}` : WRAP_TAG;
  const sync = config.sync ?? false;

  let opts = options;
  if (!opts.locale) {
    const locale = documentLocale(root);
    if (locale) opts = { ...opts, locale };
  }
  let emphasizer = createEmphasizer(opts);
  let stopped = false;
  let running = false;
  /** Subtrees still to walk, in order. */
  const pending: Node[] = [root];
  /** Existing wrappers to re-render after update(). */
  let rerender: Element[] = [];
  /** Wrappers whose text is still being emphasized, chunk by chunk. */
  let partials: PartialWrap[] = [];
  let walker: TreeWalker | null = null;
  let walkerRoot: Node | null = null;
  let lookahead: Node | null = null;
  let resolveIdle: (() => void) | null = null;
  let idle = Promise.resolve();

  if (config.injectStyles !== false) injectStyles(doc);

  const filter = (node: Node) => {
    if (node.nodeType === 1) {
      return (node as Element).matches(SKIP_SELECTOR) ? FILTER_REJECT : FILTER_SKIP;
    }
    return HAS_LETTER.test((node as Text).data) ? FILTER_ACCEPT : FILTER_SKIP;
  };

  function isSkipped(node: Node): boolean {
    const parent = node.nodeType === 1 ? (node as Element) : node.parentElement;
    return !parent || parent.closest(SKIP_SELECTOR) !== null;
  }

  function fill(target: Node, spans: Span[]) {
    for (const span of spans) {
      if (!span.emphasis) {
        target.appendChild(doc.createTextNode(span.text));
        continue;
      }
      const em = doc.createElement(useSpans ? "span" : EMPHASIS_TAG);
      if (useSpans) em.className = EMPHASIS_CLASS;
      em.textContent = span.text;
      target.appendChild(em);
    }
  }

  /**
   * Starts emphasizing `rest`, a text node inside `wrapper`. Long texts are consumed
   * a chunk at a time (see `advance`), so even one huge text node never blocks.
   */
  function begin(wrapper: Element, rest: Text) {
    partials.push({ wrapper, rest });
  }

  /** Emphasizes the next chunk of a partial wrapper. Returns false when it is complete. */
  function advance({ wrapper, rest }: PartialWrap): boolean {
    if (rest.parentNode !== wrapper) return false;
    const data = rest.data;
    let cut = data.length;
    if (cut > CHUNK_CHARS) {
      // Cut at whitespace so words, URLs and grapheme clusters stay whole.
      // A run without whitespace (a long URL, say) is taken whole.
      const before = data.slice(CHUNK_CHARS / 2, CHUNK_CHARS).search(/\s\S*$/);
      const after = data.slice(CHUNK_CHARS).search(/\s/);
      if (before >= 0) cut = CHUNK_CHARS / 2 + before + 1;
      else if (after >= 0) cut = CHUNK_CHARS + after + 1;
    }
    const fragment = doc.createDocumentFragment();
    fill(fragment, emphasizer(data.slice(0, cut)));
    wrapper.insertBefore(fragment, rest);
    if (cut === data.length) {
      rest.remove();
      return false;
    }
    rest.data = data.slice(cut);
    return true;
  }

  /** Next text node to process, walking the pending subtrees in order. */
  function nextText(): Text | null {
    for (;;) {
      if (walker) {
        // Recover if the page removed the node we were about to visit.
        if (lookahead && walkerRoot && !walkerRoot.contains(lookahead)) {
          if (!walkerRoot.isConnected) {
            walker = null;
            continue;
          }
          walker = doc.createTreeWalker(walkerRoot, SHOW_ELEMENT_AND_TEXT, {
            acceptNode: filter,
          });
          lookahead = walker.nextNode();
        }
        const current = lookahead;
        if (current) {
          lookahead = walker.nextNode();
          return current as Text;
        }
        walker = null;
      }
      const next = pending.shift();
      if (!next) return null;
      if (!next.isConnected && next !== root) continue;
      if (next.nodeType === 3) {
        if (!isSkipped(next) && filter(next) === FILTER_ACCEPT) return next as Text;
        continue;
      }
      if (next !== root && isSkipped(next)) continue;
      if (next === root && (root as Element).matches(SKIP_SELECTOR)) continue;
      walkerRoot = next;
      walker = doc.createTreeWalker(next, SHOW_ELEMENT_AND_TEXT, {
        acceptNode: filter,
      });
      lookahead = walker.nextNode();
    }
  }

  /** Does one unit of work (at most one chunk). Returns false when nothing is left. */
  function step(): boolean {
    const partial = partials[0];
    if (partial) {
      if (!advance(partial)) partials.shift();
      return true;
    }
    const existing = rerender.shift();
    if (existing) {
      if (existing.isConnected) {
        const rest = doc.createTextNode(existing.textContent ?? "");
        existing.replaceChildren(rest);
        begin(existing, rest);
      }
      return true;
    }
    const text = nextText();
    if (!text) return false;
    const wrapper = doc.createElement(useSpans ? "span" : WRAP_TAG);
    if (useSpans) wrapper.className = WRAP_CLASS;
    const rest = doc.createTextNode(text.data);
    wrapper.appendChild(rest);
    text.replaceWith(wrapper);
    begin(wrapper, rest);
    return true;
  }

  function finish() {
    running = false;
    resolveIdle?.();
    resolveIdle = null;
  }

  function work(deadline: IdleDeadline) {
    if (stopped) return finish();
    const until = Date.now() + MAX_SLICE_MS;
    do {
      if (!step()) return finish();
    } while (deadline.timeRemaining() > 1 && Date.now() < until);
    schedule(win, work);
  }

  function kick() {
    if (stopped) return;
    if (sync) {
      while (step());
      return;
    }
    if (running) return;
    running = true;
    idle = new Promise((resolve) => {
      resolveIdle = resolve;
    });
    schedule(win, work);
  }

  const observer =
    !sync && config.observe !== false && win?.MutationObserver
      ? new win.MutationObserver((records) => {
          for (const record of records) {
            const target = record.target as Element;
            // Ignore our own insertions and edits inside our wrappers.
            if (target.closest?.(wrapSelector)) continue;
            for (const node of record.addedNodes) {
              if (node.nodeType === 1 && (node as Element).matches(wrapSelector)) continue;
              if (node.nodeType === 1 || node.nodeType === 3) pending.push(node);
            }
          }
          kick();
        })
      : null;
  observer?.observe(root, { childList: true, subtree: true });

  function stop() {
    stopped = true;
    observer?.disconnect();
    pending.length = 0;
    rerender = [];
    partials = [];
    walker = null;
    finish();
  }

  kick();

  return {
    stop,
    undo() {
      stop();
      for (const wrapper of root.querySelectorAll(wrapSelector)) {
        wrapper.replaceWith(doc.createTextNode(wrapper.textContent ?? ""));
      }
      if (config.injectStyles !== false) removeStyles(doc);
    },
    update(next) {
      if (stopped) return;
      opts = { ...opts, ...next };
      emphasizer = createEmphasizer(opts);
      partials = [];
      rerender = [...root.querySelectorAll(wrapSelector)];
      kick();
    },
    get idle() {
      return idle;
    },
  };
}
