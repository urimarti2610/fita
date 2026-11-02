// Build-time data (manifest, locales, stylesheet). Bundled and evaluated by scripts/build.mjs.
import { BRAND, EMPHASIS_CSS } from "@fita/core";
import { EXTENSION_BRAND } from "../brand.js";
import ca from "./locales/ca.json";
import en from "./locales/en.json";
import es from "./locales/es.json";

export type Browser = "chrome" | "firefox";

const ICONS = {
  16: "icons/icon-16.png",
  32: "icons/icon-32.png",
  48: "icons/icon-48.png",
  128: "icons/icon-128.png",
};

export function manifest(browser: Browser, version: string, e2e = false) {
  return {
    manifest_version: 3,
    name: "__MSG_extName__",
    description: "__MSG_extDescription__",
    version,
    default_locale: "en",
    icons: ICONS,
    action: { default_popup: "popup.html", default_title: "__MSG_extName__", default_icon: ICONS },
    background:
      browser === "chrome" ? { service_worker: "background.js" } : { scripts: ["background.js"] },
    permissions: ["storage", "contextMenus", "activeTab", "scripting"],
    optional_host_permissions: ["*://*/*"],
    // Test builds only: lets Playwright exercise injection without a permission prompt.
    ...(e2e ? { host_permissions: ["http://localhost/*", "http://127.0.0.1/*"] } : {}),
    commands: {
      "toggle-emphasis": {
        suggested_key: { default: "Alt+B" },
        description: "__MSG_commandToggle__",
      },
    },
    ...(browser === "firefox"
      ? {
          browser_specific_settings: {
            gecko: {
              id: EXTENSION_BRAND.geckoId,
              strict_min_version: "128.0",
              data_collection_permissions: { required: ["none"] },
            },
            gecko_android: { strict_min_version: "128.0" },
          },
        }
      : {}),
  };
}

type Messages = Record<string, { message: string }>;

/** Locale files with the brand name filled in. */
export function locales(): Record<string, Messages> {
  const fill = (messages: Messages): Messages =>
    Object.fromEntries(
      Object.entries(messages).map(([key, value]) => [
        key,
        { ...value, message: value.message.replaceAll("{name}", BRAND.name) },
      ]),
    );
  return { en: fill(en), es: fill(es), ca: fill(ca) };
}

const id = BRAND.id;
/** Emphasis styles plus the extension's reading-comfort options. */
export const CONTENT_CSS = `${EMPHASIS_CSS}
html[data-${id}-lh] :is(p, li, dd, dt, blockquote, td, th, figcaption, h1, h2, h3, h4, h5, h6) { line-height: var(--${id}-lh) !important; }
html[data-${id}-mw] :is(p, li, dd, blockquote, figcaption) { max-width: var(--${id}-mw) !important; }
`;

/** Prefix for release archives. */
export const ARCHIVE_PREFIX = BRAND.id;
