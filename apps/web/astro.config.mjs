import { defineConfig } from "astro/config";

// GitHub Pages serves project sites under /<repo>/: the deploy workflow sets BASE_PATH.
export default defineConfig({
  site: process.env.SITE_URL ?? "https://oriolmarti.github.io",
  base: process.env.BASE_PATH ?? "/",
  output: "static",
  trailingSlash: "always",
  i18n: {
    locales: ["es", "ca", "en"],
    defaultLocale: "es",
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: true },
  },
  build: { inlineStylesheets: "always" },
  vite: { resolve: { conditions: ["@fita/source"] } },
});
