// App-specific brand values. Everything else comes from packages/core/src/brand.ts.
// Imported by path: build configs load before workspace packages are resolved.
import { BRAND } from "../../packages/core/src/brand.ts";

/** Reverse-domain id derived from the website: fitaread.com → com.fitaread.app. */
const appId = `${new URL(BRAND.website).hostname.split(".").reverse().join(".")}.app`;

export const MOBILE_BRAND = {
  ...BRAND,
  /** Android application id and iOS bundle id. Changing it after a store release makes a new app. */
  appId,
  /** Brand colours, as in the website and the icons. */
  paper: "#f6f7f3",
  ink: "#1d2a2e",
  teal: "#1d6a72",
  night: "#121a1c",
} as const;
