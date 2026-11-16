import type { Span } from "@fita/core";

/** Styles applied through the emphasis character style. */
export const WORD_STYLES = ["bold", "color", "underline"] as const;
export type WordStyle = (typeof WORD_STYLES)[number];

/** Dark blue with at least 7:1 contrast on white paper. */
export const EMPHASIS_COLOR = "#1F4FAE";

/**
 * One emphasized piece of a word range, located the only way Office.js allows:
 * `range.search(text)` and the n-th match.
 */
export type SearchTarget = { text: string; occurrence: number };

/** Counts non-overlapping occurrences of `needle` in `haystack` before `end`. */
function occurrencesBefore(haystack: string, needle: string, end: number): number {
  let count = 0;
  let from = 0;
  for (;;) {
    const at = haystack.indexOf(needle, from);
    if (at < 0 || at >= end) return count;
    count++;
    from = at + needle.length;
  }
}

/**
 * Turns the spans of one word range into search targets. Word's search runs
 * left to right without overlaps, so the n-th match of the span's text is the span.
 */
export function searchTargets(spans: readonly Span[]): SearchTarget[] {
  const text = spans.map((s) => s.text).join("");
  const out: SearchTarget[] = [];
  let offset = 0;
  for (const span of spans) {
    if (span.emphasis) {
      out.push({ text: span.text, occurrence: occurrencesBefore(text, span.text, offset) });
    }
    offset += span.text.length;
  }
  return out;
}

/** Word's search treats "^" as an escape (^p, ^t…); "^^" finds a literal caret. */
export function escapeSearch(text: string): string {
  return text.replace(/\^/g, "^^");
}
