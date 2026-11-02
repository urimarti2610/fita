import { BRAND } from "@fita/core";

export const WEB_BRAND = {
  ...BRAND,
  /** Store listings; null until published. Until then, buttons point to GitHub releases. */
  chromeStore: null as string | null,
  firefoxStore: null as string | null,
  get releases() {
    return `${this.repository}/releases/latest`;
  },
} as const;
