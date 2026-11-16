/**
 * Minimal stand-in for `Intl.Segmenter`, installed only when the runtime lacks it.
 *
 * Apps Script runs on V8, which ships `Intl.Segmenter`, but Google does not document
 * which ICU features its runtime enables. If it is missing, the core would throw on
 * first use, so this approximates the two granularities the core needs:
 *
 * - "word": letters, marks, digits and connector punctuation, joined across
 *   apostrophes, middle dots and full stops between letters (UAX #29 MidLetter,
 *   enough for Catalan "l·l" and "l'àvia") and across "." / "," between digits.
 * - "grapheme": a base character plus combining marks, variation selectors, emoji
 *   modifiers and ZWJ sequences; regional-indicator pairs (flags); CR LF.
 *
 * It does not split scripts without spaces (Han, Thai…) into words, but the core
 * leaves those untouched anyway.
 */

type Granularity = "grapheme" | "word" | "sentence";
type SegmentData = { segment: string; index: number; input: string; isWordLike?: boolean };

const WORD =
  /[\p{L}\p{M}\p{N}\p{Pc}]+(?:(?:['’·.](?=\p{L})|[.,](?=\p{N}))[\p{L}\p{M}\p{N}\p{Pc}]+)*/uy;
const GRAPHEME =
  /\r\n|\p{RI}\p{RI}|\P{M}(?:\p{M}|[\u{1F3FB}-\u{1F3FF}\u{E0020}-\u{E007F}])*(?:\u{200D}\P{M}(?:\p{M}|[\u{1F3FB}-\u{1F3FF}])*)*|[\s\S]/uy;
const LETTER_OR_DIGIT = /[\p{L}\p{N}]/u;

function* segmentWords(input: string): Generator<SegmentData> {
  let index = 0;
  while (index < input.length) {
    WORD.lastIndex = index;
    const match = WORD.exec(input);
    if (match) {
      const segment = match[0];
      yield { segment, index, input, isWordLike: LETTER_OR_DIGIT.test(segment) };
      index += segment.length;
      continue;
    }
    GRAPHEME.lastIndex = index;
    const segment = (GRAPHEME.exec(input) as RegExpExecArray)[0];
    yield { segment, index, input, isWordLike: false };
    index += segment.length;
  }
}

function* segmentGraphemes(input: string): Generator<SegmentData> {
  let index = 0;
  while (index < input.length) {
    GRAPHEME.lastIndex = index;
    const segment = (GRAPHEME.exec(input) as RegExpExecArray)[0];
    yield { segment, index, input };
    index += segment.length;
  }
}

export class FallbackSegmenter {
  readonly #granularity: Granularity;
  readonly #locale: string;

  constructor(locales?: string | string[], options?: { granularity?: Granularity }) {
    this.#granularity = options?.granularity ?? "grapheme";
    this.#locale = (Array.isArray(locales) ? locales[0] : locales) ?? "en";
  }

  segment(input: string): Iterable<SegmentData> {
    const word = this.#granularity === "word";
    return { [Symbol.iterator]: () => (word ? segmentWords(input) : segmentGraphemes(input)) };
  }

  resolvedOptions() {
    return { locale: this.#locale, granularity: this.#granularity };
  }
}

/** Installs the fallback if the runtime has no `Intl.Segmenter`. Returns true if it did. */
export function ensureSegmenter(intl: { Segmenter?: unknown } = Intl): boolean {
  if (typeof intl.Segmenter === "function") return false;
  intl.Segmenter = FallbackSegmenter;
  return true;
}
