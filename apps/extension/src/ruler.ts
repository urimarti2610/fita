import { EXTENSION_BRAND } from "../brand.js";

/** "band" highlights the current line; "dim" darkens everything above and below it. */
export type RulerMode = "off" | "band" | "dim";
export const RULER_MODES: readonly RulerMode[] = ["off", "band", "dim"];

/** Host element of the overlay. Lives outside <body>, so emphasis never sees it. */
export const RULER_TAG = `${EXTENSION_BRAND.id}-ruler`;

/** A line box in viewport coordinates. */
export type Line = { top: number; height: number; left: number; width: number };

type Rect = Pick<DOMRect, "top" | "bottom" | "left" | "width" | "height">;

/** Horizontal breathing room around the line, in px. */
const PAD_X = 6;
/** How far (px) the pointer may be from a glyph and still count as on its line. */
const SLACK = 4;

const RULER_CSS = `
:host { all: initial; position: fixed; inset: 0; pointer-events: none; z-index: 2147483646; contain: strict; }
:host([hidden]) { display: none; }
div { position: absolute; left: 0; top: 0; width: 0; height: 0; pointer-events: none; }
.band {
  border-radius: 4px;
  background: rgb(255 214 64 / 0.32);
  box-shadow: 0 -1px 0 rgb(29 106 114 / 0.55), 0 1px 0 rgb(29 106 114 / 0.55);
  mix-blend-mode: multiply;
}
.shade { background: rgb(0 0 0 / 0.4); }
:host([data-mode="band"]) .shade, :host([data-mode="dim"]) .band { display: none; }
@media (prefers-color-scheme: dark) {
  .band { background: rgb(64 140 150 / 0.45); mix-blend-mode: screen; box-shadow: 0 -1px 0 rgb(127 208 214 / 0.7), 0 1px 0 rgb(127 208 214 / 0.7); }
  .shade { background: rgb(0 0 0 / 0.55); }
}
@media (prefers-reduced-motion: no-preference) {
  div { transition: top 90ms ease-out, height 90ms ease-out, left 90ms ease-out, width 90ms ease-out; }
}
@media (forced-colors: active) {
  .band { forced-color-adjust: none; mix-blend-mode: normal; background: transparent; outline: 2px solid Highlight; }
  .shade { forced-color-adjust: none; background: rgb(0 0 0 / 0.5); }
}
`;

/** Pads a glyph rect to the element's line height and spreads it over its block. */
export function lineBox(glyph: Rect, lineHeight: number, block: Rect): Line {
  const height =
    Number.isFinite(lineHeight) && lineHeight > glyph.height ? lineHeight : glyph.height;
  return {
    top: glyph.top + glyph.height / 2 - height / 2,
    height,
    left: block.left - PAD_X,
    width: block.width + 2 * PAD_X,
  };
}

/** Rect among `rects` that contains the vertical position `y`, with a little slack. */
export function rectAtY(rects: ArrayLike<Rect>, y: number): Rect | null {
  for (let i = 0; i < rects.length; i++) {
    const r = rects[i] as Rect;
    if (r.height > 0 && y >= r.top - SLACK && y <= r.bottom + SLACK) return r;
  }
  return null;
}

function isInline(el: Element): boolean {
  const display = el.ownerDocument.defaultView?.getComputedStyle(el).display ?? "";
  return display === "" || display.startsWith("inline") || display === "contents";
}

/** Closest ancestor laid out as a block: the line spans its width. */
function blockOf(el: Element): Element {
  let current: Element = el;
  while (current.parentElement && current !== el.ownerDocument.body && isInline(current))
    current = current.parentElement;
  return current;
}

function lineHeightOf(el: Element): number {
  const value = el.ownerDocument.defaultView?.getComputedStyle(el).lineHeight ?? "";
  return Number.parseFloat(value);
}

function lineFromRect(glyph: Rect, el: Element): Line {
  return lineBox(glyph, lineHeightOf(el), blockOf(el).getBoundingClientRect());
}

type CaretDocument = Document & {
  caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
  caretRangeFromPoint?: (x: number, y: number) => Range | null;
};

/** Text position under a point, using whichever API the browser has. */
function textAt(doc: Document, x: number, y: number): { node: Text; offset: number } | null {
  const d = doc as CaretDocument;
  let node: Node | undefined;
  let offset = 0;
  if (d.caretPositionFromPoint) {
    const pos = d.caretPositionFromPoint(x, y);
    node = pos?.offsetNode;
    offset = pos?.offset ?? 0;
  } else if (d.caretRangeFromPoint) {
    const range = d.caretRangeFromPoint(x, y);
    node = range?.startContainer;
    offset = range?.startOffset ?? 0;
  }
  return node?.nodeType === Node.TEXT_NODE ? { node: node as Text, offset } : null;
}

/** One-character range around a text offset (collapsed ranges often have no rects). */
function charRange(doc: Document, node: Text, offset: number): Range | null {
  if (node.length === 0) return null;
  const start = Math.min(Math.max(offset, 0), node.length - 1);
  const range = doc.createRange();
  range.setStart(node, start);
  range.setEnd(node, start + 1);
  return range;
}

/** The text line under a point, or null when the point is not over text. */
export function lineAtPoint(doc: Document, x: number, y: number): Line | null {
  const hit = textAt(doc, x, y);
  if (!hit?.node.parentElement || hit.node.parentElement.closest(RULER_TAG)) return null;
  const range = charRange(doc, hit.node, hit.offset);
  const glyph = range && rectAtY(range.getClientRects(), y);
  return glyph ? lineFromRect(glyph, hit.node.parentElement) : null;
}

/** The line holding the caret or the end of the selection (caret browsing, F7). */
export function lineAtSelection(doc: Document): Line | null {
  const selection = doc.getSelection();
  const node = selection?.focusNode;
  if (!selection || !node || selection.rangeCount === 0) return null;
  if (node.nodeType !== Node.TEXT_NODE) return null;
  const range = charRange(doc, node as Text, selection.focusOffset);
  const glyph = range?.getClientRects()[0];
  return glyph && node.parentElement ? lineFromRect(glyph, node.parentElement) : null;
}

/** The first line of a focused element (links, buttons, form fields). */
export function lineAtElement(el: Element): Line | null {
  if (el === el.ownerDocument.body || el === el.ownerDocument.documentElement) return null;
  const glyph = el.getClientRects()[0];
  return glyph && glyph.height > 0 ? lineFromRect(glyph, el) : null;
}

export type Ruler = {
  /** Shows the ruler in a mode, or removes it with "off". */
  set(mode: RulerMode): void;
  /** Current position (for tests). */
  readonly line: Line | null;
};

/**
 * A translucent line ruler that follows the pointer, the text caret and keyboard focus.
 * It is a fixed overlay in a shadow root: it never changes the page's text or layout,
 * ignores the pointer and is hidden from assistive technology.
 */
export function createRuler(doc: Document = document): Ruler {
  const win = doc.defaultView as Window;
  let mode: RulerMode = "off";
  let host: HTMLElement | null = null;
  let band: HTMLDivElement;
  let above: HTMLDivElement;
  let below: HTMLDivElement;
  let line: Line | null = null;
  /** What the ruler follows, re-measured on scroll and resize. */
  let source: (() => Line | null) | null = null;
  let frame = 0;

  function build() {
    host = doc.createElement(RULER_TAG);
    host.setAttribute("aria-hidden", "true");
    host.hidden = true;
    const root = host.attachShadow({ mode: "closed" });
    const style = doc.createElement("style");
    style.textContent = RULER_CSS;
    band = doc.createElement("div");
    band.className = "band";
    above = doc.createElement("div");
    above.className = "shade";
    below = doc.createElement("div");
    below.className = "shade";
    root.append(style, above, band, below);
    doc.documentElement.append(host);
  }

  function draw() {
    if (!host) return;
    host.hidden = line === null;
    if (!line) return;
    const px = (n: number) => `${Math.round(n)}px`;
    Object.assign(band.style, {
      top: px(line.top),
      height: px(line.height),
      left: px(line.left),
      width: px(line.width),
    });
    Object.assign(above.style, { top: "0px", height: px(Math.max(0, line.top)), width: "100%" });
    Object.assign(below.style, {
      top: px(line.top + line.height),
      height: px(Math.max(0, win.innerHeight - line.top - line.height)),
      width: "100%",
    });
  }

  function follow(next: () => Line | null, keepIfNone: boolean) {
    const measured = next();
    if (!measured && keepIfNone) return;
    source = measured ? next : null;
    line = measured;
    schedule();
  }

  function schedule() {
    if (frame) return;
    frame = win.requestAnimationFrame(() => {
      frame = 0;
      draw();
    });
  }

  let pointer = { x: 0, y: 0 };
  const onPointer = (event: PointerEvent) => {
    pointer = { x: event.clientX, y: event.clientY };
    const at = { ...pointer };
    // Over margins or images the ruler stays on the last line read.
    follow(() => lineAtPoint(doc, at.x, at.y), true);
  };
  const onSelection = () => {
    const selection = doc.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    follow(() => lineAtSelection(doc), true);
  };
  const onFocus = (event: FocusEvent) => {
    const target = event.target;
    if (target && (target as Node).nodeType === Node.ELEMENT_NODE)
      follow(() => lineAtElement(target as Element), true);
  };
  const onScroll = () => {
    if (!source) return;
    line = source();
    schedule();
  };

  const listeners: [EventTarget, string, EventListener, AddEventListenerOptions][] = [
    [doc, "pointermove", onPointer as EventListener, { passive: true, capture: true }],
    [doc, "pointerdown", onPointer as EventListener, { passive: true, capture: true }],
    [doc, "selectionchange", onSelection, { passive: true }],
    [doc, "focusin", onFocus as EventListener, { passive: true, capture: true }],
    [win, "scroll", onScroll, { passive: true, capture: true }],
    [win, "resize", onScroll, { passive: true }],
  ];

  function start() {
    build();
    for (const [target, type, fn, options] of listeners) target.addEventListener(type, fn, options);
  }

  function stop() {
    for (const [target, type, fn, options] of listeners)
      target.removeEventListener(type, fn, options);
    if (frame) win.cancelAnimationFrame(frame);
    frame = 0;
    host?.remove();
    host = null;
    line = null;
    source = null;
  }

  return {
    set(next) {
      if (next === mode) return;
      if (next === "off") stop();
      else if (mode === "off") start();
      mode = next;
      if (host) host.dataset.mode = mode;
    },
    get line() {
      return line;
    },
  };
}
