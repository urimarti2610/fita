import { BRAND } from "@fita/core";

/** Extension-specific brand values. The product name itself comes from the core. */
export const EXTENSION_BRAND = {
  ...BRAND,
  /** Firefox add-on ID (email-like format, does not need to be a real address). */
  geckoId: `${BRAND.id}@${BRAND.id}-reading.extension`,
  /** Public source repository, shown in the popup footer. */
  repository: `https://github.com/oriolmarti/${BRAND.id}`,
} as const;
