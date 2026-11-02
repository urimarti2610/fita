import type { EmphasisOptions } from "../src/index.js";

/**
 * Fixed parameters for tests about segmentation, languages and mechanics,
 * so they do not change when the product defaults are tuned.
 */
export const CLASSIC: Partial<EmphasisOptions> = { strength: 0.4, minWordLength: 1 };
