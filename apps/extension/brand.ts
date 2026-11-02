import { BRAND } from "@fita/core";

/** Extension-specific brand values. The product name itself comes from the core. */
export const EXTENSION_BRAND = {
  ...BRAND,
  /** Firefox add-on ID (email-like format, does not need to be a real address). */
  geckoId: `${BRAND.id}@${new URL(BRAND.website).hostname}`,
} as const;
