/**
 * Central brand configuration: name, website and repository. Change them here
 * (and in apps/*\/brand.* for app-specific values) and everything else follows.
 * Keep this file free of imports: build configs load it directly.
 */
export const BRAND = {
  /** Human-readable product name. */
  name: "fita",
  /** Lowercase identifier used for custom elements, CSS classes and storage keys. */
  id: "fita",
  /** Public website. */
  website: "https://fitaread.com",
  /** Public source repository. */
  repository: "https://github.com/urimarti2610/fita",
} as const;

/** Custom element wrapping a processed text node. */
export const WRAP_TAG = `${BRAND.id}-w`;
/** Custom element wrapping the emphasized part of a word. */
export const EMPHASIS_TAG = `${BRAND.id}-e`;
