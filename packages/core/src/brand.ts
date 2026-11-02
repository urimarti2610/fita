/**
 * Central brand configuration. The project name is provisional: change it here
 * (and in apps/*\/brand.*) and everything else follows.
 */
export const BRAND = {
  /** Human-readable product name. */
  name: "fita",
  /** Lowercase identifier used for custom elements, CSS classes and storage keys. */
  id: "fita",
} as const;

/** Custom element wrapping a processed text node. */
export const WRAP_TAG = `${BRAND.id}-w`;
/** Custom element wrapping the emphasized part of a word. */
export const EMPHASIS_TAG = `${BRAND.id}-e`;
