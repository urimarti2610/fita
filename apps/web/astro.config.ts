import { cpSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import { defineConfig } from "astro/config";
// Imported by path: the config loads before workspace packages are resolved.
import { BRAND } from "../../packages/core/src/brand.ts";
import { LANGS } from "./src/i18n.ts";

/**
 * Publishes the Word add-in's task pane (built by @fita/word-addin, a dev dependency
 * so pnpm builds it first) at /addins/word/, where its manifest points.
 */
function wordAddin(): AstroIntegration {
  const source = fileURLToPath(new URL("../../addons/word/dist/", import.meta.url));
  return {
    name: "word-addin",
    hooks: {
      "astro:build:done": ({ dir, logger }) => {
        if (!existsSync(source)) {
          logger.warn("addons/word/dist is missing: run the Word add-in build first.");
          return;
        }
        cpSync(source, fileURLToPath(new URL("addins/word/", dir)), { recursive: true });
      },
    },
  };
}

// Served from the site root on the custom domain (GitHub Pages).
export default defineConfig({
  site: BRAND.website,
  base: "/",
  output: "static",
  trailingSlash: "always",
  i18n: {
    locales: LANGS,
    defaultLocale: "es",
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  build: { inlineStylesheets: "always" },
  vite: {
    resolve: { conditions: ["@fita/source"] },
    // ES module workers can load code on demand (pdf.js only when a PDF is converted).
    worker: { format: "es" },
  },
  integrations: [wordAddin()],
});
