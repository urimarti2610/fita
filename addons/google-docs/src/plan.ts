import { MAX_STRENGTH, MIN_STRENGTH, type Span } from "@fita/core";

/** Styles a word processor can apply with plain character formatting. */
export const DOC_STYLES = ["bold", "color", "underline"] as const;
export type DocStyle = (typeof DOC_STYLES)[number];

export type Settings = { strength: number; style: DocStyle };
export const DEFAULT_SETTINGS: Readonly<Settings> = Object.freeze({
  strength: 0.45,
  style: "bold",
});

/** Dark blue with at least 7:1 contrast on white paper. */
export const EMPHASIS_COLOR = "#1f4fae";

/** Half-open interval [start, end) in UTF-16 code units. */
export type Interval = [start: number, end: number];

/** Offsets of the emphasized spans. */
export function emphasizedIntervals(spans: readonly Span[]): Interval[] {
  const out: Interval[] = [];
  let offset = 0;
  for (const span of spans) {
    const end = offset + span.text.length;
    if (span.emphasis) out.push([offset, end]);
    offset = end;
  }
  return out;
}

/** Keeps the parts of `intervals` that fall inside `[from, to)`. */
export function clip(intervals: readonly Interval[], from: number, to: number): Interval[] {
  const out: Interval[] = [];
  for (const [start, end] of intervals) {
    const s = Math.max(start, from);
    const e = Math.min(end, to);
    if (s < e) out.push([s, e]);
  }
  return out;
}

/**
 * Removes the parts of `intervals` where `isSet` reports the formatting is already
 * there. Formatting is checked once per run: `runStarts` are the offsets where the
 * text's attributes change (Apps Script `getTextAttributeIndices`), always starting at 0.
 *
 * Only adding formatting where there was none keeps "Remove emphasis" exact: it
 * never strips bold, colour or underline the author had set.
 */
export function withoutExisting(
  intervals: readonly Interval[],
  runStarts: readonly number[],
  length: number,
  isSet: (offset: number) => boolean,
): Interval[] {
  const free: Interval[] = [];
  for (let i = 0; i < runStarts.length; i++) {
    const start = runStarts[i] as number;
    const end = runStarts[i + 1] ?? length;
    if (start < end && !isSet(start)) free.push([start, end]);
  }
  const out: Interval[] = [];
  for (const [fs, fe] of free) out.push(...clip(intervals, fs, fe));
  return out.sort((a, b) => a[0] - b[0]);
}

export function parseSettings(raw: unknown): Settings {
  const value = (raw && typeof raw === "object" ? raw : {}) as Partial<
    Record<keyof Settings, unknown>
  >;
  const strength =
    typeof value.strength === "number" && Number.isFinite(value.strength)
      ? Math.min(MAX_STRENGTH, Math.max(MIN_STRENGTH, value.strength))
      : DEFAULT_SETTINGS.strength;
  const style = DOC_STYLES.includes(value.style as DocStyle)
    ? (value.style as DocStyle)
    : DEFAULT_SETTINGS.style;
  return { strength, style };
}
