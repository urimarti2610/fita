export type EmphasisOptions = {
  /** Fraction of each word to emphasize, 0.2–0.7. Default 0.45. */
  strength: number;
  /** Words shorter than this (in graphemes) get exactly 1 emphasized grapheme. Default 4. */
  minWordLength: number;
  /** Emphasize 1 of every N processable words. Default 1 (all). */
  every: number;
  /** Leave numbers and words containing digits untouched. Default true. */
  skipNumbers: boolean;
  /** BCP-47 tag used for segmentation. Defaults to the runtime locale. */
  locale?: string;
};

export type Span = { text: string; emphasis: boolean };

export const DEFAULT_OPTIONS: Readonly<EmphasisOptions> = Object.freeze({
  strength: 0.45,
  minWordLength: 4,
  every: 1,
  skipNumbers: true,
});

export const MIN_STRENGTH = 0.2;
export const MAX_STRENGTH = 0.7;

/** Validates and fills in defaults. Out-of-range values are clamped, never rejected. */
export function resolveOptions(options: Partial<EmphasisOptions> = {}): EmphasisOptions {
  const pick = (value: number | undefined, fallback: number) =>
    typeof value === "number" && Number.isFinite(value) ? value : fallback;
  const resolved: EmphasisOptions = {
    strength: Math.min(
      MAX_STRENGTH,
      Math.max(MIN_STRENGTH, pick(options.strength, DEFAULT_OPTIONS.strength)),
    ),
    minWordLength: Math.max(
      1,
      Math.floor(pick(options.minWordLength, DEFAULT_OPTIONS.minWordLength)),
    ),
    every: Math.max(1, Math.floor(pick(options.every, 1))),
    skipNumbers: options.skipNumbers ?? DEFAULT_OPTIONS.skipNumbers,
  };
  if (options.locale) resolved.locale = options.locale;
  return resolved;
}

/**
 * Text that must never be emphasized: URLs, emails, file paths and code.
 * Detected on the raw text before word segmentation, because the segmenter
 * would otherwise split them into ordinary-looking words.
 */
const PROTECTED = new RegExp(
  [
    String.raw`\x60[^\x60\n]+\x60`, // `inline code`
    String.raw`\b[a-z][a-z0-9+.\-]*:\/\/[^\s<>"]+`, // scheme://…
    String.raw`\bwww\.[^\s<>"]+`, // www.…
    String.raw`[\p{L}\p{N}._%+\-]+@[\p{L}\p{N}\-]+(?:\.[\p{L}\p{N}\-]+)+`, // email
    String.raw`(?<![\p{L}\p{N}])(?:~|\.{1,2})?\/[\p{L}\p{N}._\-]+(?:\/[\p{L}\p{N}._\-]*)+`, // /unix/path
    String.raw`\b[A-Za-z]:\\[^\s<>"]+`, // C:\windows\path
    String.raw`[\p{L}_$][\p{L}\p{N}_$]*(?:\.[\p{L}_$][\p{L}\p{N}_$]*)+\([^()\s]*\)`, // a.b(x)
    String.raw`[\p{L}_$][\p{L}\p{N}_$]*\(\)`, // call()
    String.raw`[\p{L}\p{N}]*_[\p{L}\p{N}_]+`, // snake_case
  ].join("|"),
  "giu",
);

/** Scripts written without spaces between words: emphasis would land at arbitrary points. */
const NO_SPACE_SCRIPT =
  /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Thai}\p{Script=Lao}\p{Script=Khmer}\p{Script=Myanmar}]/u;
const DIGIT = /\p{Nd}/u;
/** Latin, Greek and Cyrillic without combining marks: one UTF-16 unit per grapheme. */
const SIMPLE_GRAPHEMES = /^[\u0020-\u02ff\u0370-\u03ff\u0400-\u0482\u048a-\u04ff]*$/;
/** Elided articles and prepositions such as Catalan/French l', d', qu'. */
const ELISION = /^(\p{L}{1,2})['’]/u;

const segmenters = new Map<string, { word: Intl.Segmenter; grapheme: Intl.Segmenter }>();
function getSegmenters(locale: string | undefined) {
  const key = locale ?? "";
  let entry = segmenters.get(key);
  if (!entry) {
    entry = {
      word: new Intl.Segmenter(locale, { granularity: "word" }),
      grapheme: new Intl.Segmenter(locale, { granularity: "grapheme" }),
    };
    segmenters.set(key, entry);
  }
  return entry;
}

/** Number of UTF-16 code units covered by the first `count` graphemes of `word`. */
function graphemePrefixLength(word: string, count: number, grapheme: Intl.Segmenter): number {
  if (SIMPLE_GRAPHEMES.test(word)) return count;
  let seen = 0;
  for (const { index } of grapheme.segment(word)) {
    if (seen === count) return index;
    seen++;
  }
  return word.length;
}

function graphemeCount(word: string, grapheme: Intl.Segmenter): number {
  if (SIMPLE_GRAPHEMES.test(word)) return word.length;
  let n = 0;
  for (const _ of grapheme.segment(word)) n++;
  return n;
}

/** How many leading graphemes of a word of `length` graphemes to emphasize. */
export function emphasisCount(length: number, options: EmphasisOptions): number {
  if (length <= 0) return 0;
  if (length < options.minWordLength) return 1;
  const n = Math.max(1, Math.round(length * options.strength));
  return length >= 2 ? Math.min(n, length - 1) : n;
}

/**
 * Returns a stateful emphasizer: the `every` counter carries over between calls,
 * so a document processed in pieces (text nodes, chapters) behaves like one text.
 */
export function createEmphasizer(options: Partial<EmphasisOptions> = {}) {
  const opts = resolveOptions(options);
  const { word: wordSegmenter, grapheme } = getSegmenters(opts.locale);
  let processable = 0;

  function emphasizeWord(word: string, out: Span[]) {
    if ((opts.skipNumbers && DIGIT.test(word)) || NO_SPACE_SCRIPT.test(word)) {
      push(out, word, false);
      return;
    }
    if (processable++ % opts.every !== 0) {
      push(out, word, false);
      return;
    }
    // Skip a short elided prefix (l'àvia, d'una) so the anchor falls on the main word.
    let lead = "";
    const elision = ELISION.exec(word);
    if (elision && graphemeCount(word.slice(elision[0].length), grapheme) >= 3) {
      lead = elision[0];
    }
    const body = word.slice(lead.length);
    const count = emphasisCount(graphemeCount(body, grapheme), opts);
    const cut = graphemePrefixLength(body, count, grapheme);
    push(out, lead, false);
    push(out, body.slice(0, cut), true);
    push(out, body.slice(cut), false);
  }

  function emphasizePlain(text: string, out: Span[]) {
    for (const segment of wordSegmenter.segment(text)) {
      if (segment.isWordLike) emphasizeWord(segment.segment, out);
      else push(out, segment.segment, false);
    }
  }

  return function emphasizeChunk(text: string): Span[] {
    const out: Span[] = [];
    let last = 0;
    PROTECTED.lastIndex = 0;
    for (const match of text.matchAll(PROTECTED)) {
      emphasizePlain(text.slice(last, match.index), out);
      push(out, match[0], false);
      last = match.index + match[0].length;
    }
    emphasizePlain(text.slice(last), out);
    return out;
  };
}

/** Appends a span, merging it into the previous one when the emphasis matches. */
function push(out: Span[], text: string, emphasis: boolean) {
  if (!text) return;
  const prev = out[out.length - 1];
  if (prev && prev.emphasis === emphasis) prev.text += text;
  else out.push({ text, emphasis });
}

/** Splits `text` into emphasized and plain spans. Concatenating the spans yields `text`. */
export function emphasize(text: string, options?: Partial<EmphasisOptions>): Span[] {
  return createEmphasizer(options)(text);
}

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
export function escapeHTML(text: string): string {
  return text.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c] as string);
}

const TAG_NAME = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/i;

/** Returns HTML with the emphasized parts wrapped in `<tag>`. All text is escaped. */
export function toHTML(text: string, options?: Partial<EmphasisOptions>, tag = "b"): string {
  if (!TAG_NAME.test(tag)) throw new TypeError(`Invalid tag name: ${tag}`);
  let html = "";
  for (const span of emphasize(text, options)) {
    const escaped = escapeHTML(span.text);
    html += span.emphasis ? `<${tag}>${escaped}</${tag}>` : escaped;
  }
  return html;
}
