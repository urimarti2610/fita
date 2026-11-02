import { defineConfig } from "astro/config";
// Imported by path: the config loads before workspace packages are resolved.
import { BRAND } from "../../packages/core/src/brand.ts";
import { LANGS } from "./src/i18n.ts";

// Served from the site root on the custom domain (GitHub Pages).
export default defineConfig({
  site: BRAND.website,
  base: "/",
  output: "static",
  trailingSlash: "always",
  i18n: {
    locales: LANGS,
    defaultLocale: "es",
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: true },
  },
  build: { inlineStylesheets: "always" },
  vite: { resolve: { conditions: ["@fita/source"] } },
});
