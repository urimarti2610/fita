import { EXTENSION_BRAND } from "../brand.js";
import { RULER_TAG } from "./ruler.js";

/** CSS Custom Highlight name for the word being read aloud. */
export const SPEECH_HIGHLIGHT = `${EXTENSION_BRAND.id}-speaking`;

/** Read-aloud preferences, synced and shared by every site. */
export type SpeechSettings = {
  /** Speaking rate, 0.5–2. */
  rate: number;
  /** Chosen voice (`voiceURI`) per base language ("es", "ca"…); absent means automatic. */
  voices: Record<string, string>;
};
export const DEFAULT_SPEECH: SpeechSettings = { rate: 1, voices: {} };
export const SPEECH_KEY = "speech";
export const MIN_RATE = 0.5;
export const MAX_RATE = 2;

export type SpeechStatus = "idle" | "playing" | "paused";
export type SpeechError = "noVoice" | "noText" | "unsupported";
export type SpeechState = { status: SpeechStatus; lang: string; error?: SpeechError | undefined };
export type SpeechAction = "play" | "pause" | "resume" | "stop" | "toggle" | "state";

export async function loadSpeech(): Promise<SpeechSettings> {
  const stored = (await chrome.storage.sync.get(SPEECH_KEY))[SPEECH_KEY] as
    | Partial<SpeechSettings>
    | undefined;
  return { ...DEFAULT_SPEECH, ...stored, voices: { ...stored?.voices } };
}

export function saveSpeech(settings: SpeechSettings) {
  return chrome.storage.sync.set({ [SPEECH_KEY]: settings });
}

/** "pt-BR" → "pt". */
export function langBase(lang: string): string {
  return lang.trim().toLowerCase().split(/[-_]/)[0] ?? "";
}

type VoiceLike = Pick<SpeechSynthesisVoice, "voiceURI" | "lang" | "localService" | "default">;

/**
 * Only voices that run on the device: some browsers also list online voices that
 * send the text to a server, which this project never does.
 */
export function localVoices<V extends VoiceLike>(voices: readonly V[]): V[] {
  return voices.filter((v) => v.localService);
}

/** Best local voice for a language: the user's choice, then exact region, then default. */
export function pickVoice<V extends VoiceLike>(
  voices: readonly V[],
  lang: string,
  preferred?: string,
): V | null {
  const local = localVoices(voices);
  const chosen = preferred ? local.find((v) => v.voiceURI === preferred) : undefined;
  if (chosen) return chosen;
  const base = langBase(lang);
  const norm = (l: string) => l.toLowerCase().replace("_", "-");
  const same = local.filter((v) => langBase(v.lang) === base);
  return (
    same.find((v) => norm(v.lang) === norm(lang) && v.default) ??
    same.find((v) => norm(v.lang) === norm(lang)) ??
    same.find((v) => v.default) ??
    same[0] ??
    null
  );
}

/** Elements never read aloud. */
const SKIP = [
  "script",
  "style",
  "noscript",
  "template",
  "textarea",
  "input",
  "select",
  "option",
  "svg",
  "math",
  "canvas",
  "iframe",
  "object",
  "title",
  "[hidden]",
  '[aria-hidden="true"]',
  "[inert]",
  RULER_TAG,
].join(",");

/** A run of text inside one block, with where each text node starts in it. */
export type Chunk = {
  text: string;
  lang: string;
  pieces: { node: Text; start: number; offset: number }[];
};

const INLINE_TAGS = new Set(
  "a abbr b bdi bdo cite data dfn em i kbd mark q rp rt ruby s samp small span strong sub sup time u var wbr br font code".split(
    " ",
  ),
);

function isInline(el: Element): boolean {
  const display = el.ownerDocument.defaultView?.getComputedStyle(el).display;
  if (display) return display.startsWith("inline") || display === "contents";
  return INLINE_TAGS.has(el.localName) || el.localName.includes("-");
}

/** Closest ancestor laid out as a block. */
function blockOf(el: Element, cache: WeakMap<Element, Element>): Element {
  const known = cache.get(el);
  if (known) return known;
  const body = el.ownerDocument.body;
  let current = el;
  while (current !== body && current.parentElement && isInline(current))
    current = current.parentElement;
  cache.set(el, current);
  return current;
}

function readable(node: Text): boolean {
  const parent = node.parentElement;
  if (!parent || parent.closest(SKIP)) return false;
  const check = (parent as Element & { checkVisibility?: () => boolean }).checkVisibility;
  return check ? check.call(parent) : true;
}

export type Boundary = { node: Text; offset: number };

/**
 * Walks readable text from a point, one block at a time, so even huge pages are read
 * without building the whole text up front.
 */
export function createTextSource(root: Element, start?: Boundary, end?: Boundary) {
  const doc = root.ownerDocument;
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (readable(n as Text) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
  });
  const blocks = new WeakMap<Element, Element>();
  let pending: Text | null = null;
  let done = false;

  if (start) {
    walker.currentNode = start.node;
    pending = readable(start.node) ? start.node : (walker.nextNode() as Text | null);
  } else {
    pending = walker.nextNode() as Text | null;
  }

  function slice(node: Text): [number, number] {
    const from = start && node === start.node ? start.offset : 0;
    const to = end && node === end.node ? end.offset : node.length;
    return [from, Math.max(from, to)];
  }

  function isPast(node: Text): boolean {
    if (!end || node === end.node) return false;
    return (end.node.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
  }

  return {
    next(): Chunk | null {
      while (!done && pending) {
        const block = blockOf(pending.parentElement as Element, blocks);
        const lang =
          (pending.parentElement?.closest("[lang]")?.getAttribute("lang") ?? "") ||
          doc.documentElement.lang;
        const chunk: Chunk = { text: "", lang, pieces: [] };
        while (pending && !done) {
          if (isPast(pending)) {
            done = true;
            break;
          }
          if (blockOf(pending.parentElement as Element, blocks) !== block) break;
          const [from, to] = slice(pending);
          chunk.pieces.push({ node: pending, start: chunk.text.length, offset: from });
          chunk.text += pending.data.slice(from, to);
          if (end && pending === end.node) done = true;
          pending = walker.nextNode() as Text | null;
        }
        if (chunk.text.trim()) return chunk;
      }
      return null;
    },
  };
}

/** Splits a block's text into utterances of whole sentences, around `max` characters. */
export function splitText(text: string, lang: string, max = 400): [number, number][] {
  const parts: [number, number][] = [];
  let segmenter: Intl.Segmenter;
  try {
    segmenter = new Intl.Segmenter(lang || undefined, { granularity: "sentence" });
  } catch {
    segmenter = new Intl.Segmenter(undefined, { granularity: "sentence" });
  }
  let from = 0;
  let to = 0;
  for (const { index, segment } of segmenter.segment(text)) {
    const segEnd = index + segment.length;
    if (segEnd - from > max && to > from) {
      parts.push([from, to]);
      from = to;
    }
    // A single overlong sentence: cut at the last space before the limit.
    while (segEnd - from > max * 2) {
      const cut = text.lastIndexOf(" ", from + max);
      const at = cut > from ? cut + 1 : from + max;
      parts.push([from, at]);
      from = at;
    }
    to = segEnd;
  }
  if (to > from) parts.push([from, to]);
  return parts.filter(([a, b]) => text.slice(a, b).trim() !== "");
}

/** Text position of a character of a chunk. */
export function locate(chunk: Chunk, index: number): Boundary | null {
  let found: Chunk["pieces"][number] | undefined;
  for (const piece of chunk.pieces) {
    if (piece.start > index) break;
    found = piece;
  }
  if (!found) return null;
  return {
    node: found.node,
    offset: Math.min(found.offset + index - found.start, found.node.length),
  };
}

/** Range of the word starting at `index` (length from the engine, else up to the next space). */
export function wordRange(
  doc: Document,
  chunk: Chunk,
  index: number,
  length?: number,
): Range | null {
  const at = locate(chunk, index);
  if (!at?.node.isConnected) return null;
  const size =
    length && length > 0 ? length : (/^\S+/.exec(chunk.text.slice(index))?.[0].length ?? 0);
  if (size === 0) return null;
  const range = doc.createRange();
  range.setStart(at.node, at.offset);
  range.setEnd(at.node, Math.min(at.offset + size, at.node.length));
  return range;
}

/** Where reading starts: the selection, the caret (a click in the text), or the top of the view. */
export function startingPoint(doc: Document): { start?: Boundary; end?: Boundary } {
  const selection = doc.getSelection();
  const body = doc.body;
  if (selection && selection.rangeCount > 0 && body.contains(selection.anchorNode)) {
    const range = selection.getRangeAt(0);
    const startText = firstText(range.startContainer, range.startOffset);
    if (!range.collapsed && startText) {
      const endText = lastText(range.endContainer, range.endOffset);
      return endText ? { start: startText, end: endText } : { start: startText };
    }
    if (range.collapsed && startText) return { start: wordStart(startText) };
  }
  const visible = firstVisibleText(body);
  return visible ? { start: { node: visible, offset: 0 } } : {};
}

function wordStart({ node, offset }: Boundary): Boundary {
  let i = offset;
  while (i > 0 && !/\s/.test(node.data[i - 1] ?? "")) i--;
  return { node, offset: i };
}

function firstText(container: Node, offset: number): Boundary | null {
  if (container.nodeType === Node.TEXT_NODE) return { node: container as Text, offset };
  const doc = container.ownerDocument as Document;
  const from = container.childNodes[offset] ?? container;
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  walker.currentNode = from;
  const node =
    from.nodeType === Node.TEXT_NODE ? (from as Text) : (walker.nextNode() as Text | null);
  return node ? { node, offset: 0 } : null;
}

function lastText(container: Node, offset: number): Boundary | null {
  if (container.nodeType === Node.TEXT_NODE) return { node: container as Text, offset };
  const doc = container.ownerDocument as Document;
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  walker.currentNode = container.childNodes[offset] ?? container;
  const node = walker.previousNode() as Text | null;
  return node ? { node, offset: node.length } : null;
}

function firstVisibleText(body: HTMLElement): Text | null {
  const doc = body.ownerDocument;
  const walker = doc.createTreeWalker(body, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) =>
      readable(n as Text) && (n as Text).data.trim()
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT,
  });
  let first: Text | null = null;
  const range = doc.createRange();
  for (let node = walker.nextNode() as Text | null; node; node = walker.nextNode() as Text | null) {
    first ??= node;
    range.selectNodeContents(node);
    const rect = range.getBoundingClientRect();
    if (rect.height > 0 && rect.bottom > 0) return node;
  }
  return first;
}

type SynthLike = Pick<SpeechSynthesis, "speak" | "cancel" | "pause" | "resume" | "getVoices">;

export type ReaderEnv = {
  synth: SynthLike;
  createUtterance: (text: string) => SpeechSynthesisUtterance;
  settings: () => SpeechSettings;
  /** Marks the word being read (null clears). */
  highlight?: (range: Range | null) => void;
  /** Brings the text being read into view. */
  reveal?: (range: Range) => void;
  onState?: (state: SpeechState) => void;
  /** Resolves once the browser has listed its voices (Chrome loads them lazily). */
  waitForVoices?: () => Promise<void>;
};

/** Reads the page aloud with the browser's own on-device voices. */
export function createReader(doc: Document, env: ReaderEnv) {
  let status: SpeechStatus = "idle";
  let error: SpeechError | undefined;
  let source: ReturnType<typeof createTextSource> | null = null;
  let queue: { chunk: Chunk; from: number; to: number }[] = [];
  /** Bumped on every stop so late events from cancelled utterances are ignored. */
  let run = 0;
  let spoken = false;

  const pageLang = () => doc.documentElement.lang || doc.defaultView?.navigator.language || "";
  const state = (): SpeechState => ({ status, lang: pageLang(), error });
  const emit = () => env.onState?.(state());

  function voiceFor(lang: string) {
    const voices = env.synth.getVoices();
    const { voices: chosen } = env.settings();
    const wanted = lang || pageLang();
    return (
      pickVoice(voices, wanted, chosen[langBase(wanted)]) ??
      pickVoice(voices, pageLang(), chosen[langBase(pageLang())])
    );
  }

  function finish(reason?: SpeechError) {
    run++;
    env.synth.cancel();
    env.highlight?.(null);
    source = null;
    queue = [];
    status = "idle";
    error = reason;
    emit();
  }

  function speakNext(current: number) {
    if (current !== run) return;
    while (queue.length === 0) {
      const chunk = source?.next();
      if (!chunk) {
        finish(spoken ? undefined : "noText");
        return;
      }
      queue = splitText(chunk.text, chunk.lang).map(([from, to]) => ({ chunk, from, to }));
    }
    const part = queue.shift() as (typeof queue)[number];
    const voice = voiceFor(part.chunk.lang);
    if (!voice) {
      finish("noVoice");
      return;
    }
    const utterance = env.createUtterance(part.chunk.text.slice(part.from, part.to));
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.rate = Math.min(MAX_RATE, Math.max(MIN_RATE, env.settings().rate));
    utterance.onboundary = (event) => {
      if (current !== run || (event.name && event.name !== "word")) return;
      const range = wordRange(doc, part.chunk, part.from + event.charIndex, event.charLength);
      if (!range) return;
      env.highlight?.(range);
      env.reveal?.(range);
    };
    utterance.onend = () => speakNext(current);
    utterance.onerror = (event) => {
      if (current !== run) return;
      if (event.error === "interrupted" || event.error === "canceled") return;
      speakNext(current);
    };
    const first = wordRange(doc, part.chunk, part.from);
    if (first) {
      env.highlight?.(first);
      env.reveal?.(first);
    }
    spoken = true;
    env.synth.speak(utterance);
  }

  const reader = {
    async play() {
      finish();
      const current = run;
      await env.waitForVoices?.();
      if (current !== run) return;
      if (localVoices(env.synth.getVoices()).length === 0) {
        finish("noVoice");
        return;
      }
      const { start, end } = startingPoint(doc);
      source = createTextSource(doc.body, start, end);
      spoken = false;
      status = "playing";
      error = undefined;
      emit();
      speakNext(current);
    },
    pause() {
      if (status !== "playing") return;
      env.synth.pause();
      status = "paused";
      emit();
    },
    resume() {
      if (status !== "paused") return;
      env.synth.resume();
      status = "playing";
      emit();
    },
    stop() {
      finish();
    },
    toggle() {
      if (status === "playing") reader.pause();
      else if (status === "paused") reader.resume();
      else reader.play();
    },
    get state() {
      return state();
    },
  };
  return reader;
}
