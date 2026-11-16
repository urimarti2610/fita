import { BRAND } from "@fita/core";

export const WEB_BRAND = {
  ...BRAND,
  /** Store listings; null until published, and the button points to GitHub releases instead. */
  chromeStore: "https://chromewebstore.google.com/detail/fita/oejckcagfphojldhbdgedgpdfpkajpej" as
    | string
    | null,
  firefoxStore: null as string | null,
  get releases() {
    return `${this.repository}/releases/latest`;
  },
} as const;
