import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin, transformWithOxc } from "vite";
import { MOBILE_BRAND } from "./brand.ts";
import { ACCEPT } from "./src/formats.ts";

const web = fileURLToPath(new URL("../web/src", import.meta.url));

/**
 * Content Security Policy: no remote code, images, fonts or connections, ever.
 * Book content is sanitized before display; this is the second line of defence.
 * Android's native shell injects its bridge as an inline script, so the native
 * build has to allow inline scripts.
 */
function csp(native: boolean) {
  return [
    "default-src 'self'",
    `script-src 'self'${native ? " 'unsafe-inline'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self' data:",
    "connect-src 'self' blob: data:",
    "media-src 'none'",
    "object-src 'none'",
    "frame-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
  ].join("; ");
}

/** Web app manifest and offline service worker, so the same build installs as a PWA. */
function pwa(native: boolean): Plugin {
  return {
    name: "fita-pwa",
    transformIndexHtml: {
      order: "pre",
      handler: (html) =>
        html
          .replaceAll("%CSP%", csp(native))
          .replaceAll("%NAME%", MOBILE_BRAND.name)
          .replaceAll("%PAPER%", MOBILE_BRAND.paper)
          .replaceAll("%NIGHT%", MOBILE_BRAND.night),
    },
    async generateBundle(_, bundle) {
      const manifest = {
        name: MOBILE_BRAND.name,
        short_name: MOBILE_BRAND.name,
        id: "./",
        start_url: "./",
        scope: "./",
        display: "standalone",
        background_color: MOBILE_BRAND.paper,
        theme_color: MOBILE_BRAND.paper,
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "icons/icon-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        // Android: "Share" a book or a text to the installed app (handled by sw.js).
        share_target: {
          action: "./share",
          method: "POST",
          enctype: "multipart/form-data",
          params: {
            title: "title",
            text: "text",
            files: [{ name: "file", accept: Object.entries(ACCEPT).flat(2) }],
          },
        },
        // Desktop Chromium: "Open with" the installed app.
        file_handlers: [{ action: "./", accept: ACCEPT }],
      };
      this.emitFile({
        type: "asset",
        fileName: "manifest.webmanifest",
        source: `${JSON.stringify(manifest, null, 2)}\n`,
      });

      // Everything the app needs offline: the whole build plus the static icons.
      const files = [
        "./",
        "manifest.webmanifest",
        "icons/icon-192.png",
        "icons/icon-512.png",
        "icons/icon-maskable-512.png",
        ...Object.keys(bundle).filter((f) => !f.endsWith(".map") && f !== "index.html"),
      ];
      const version = createHash("sha256").update(files.join("\n")).digest("hex").slice(0, 12);
      const source = readFileSync(new URL("./src/sw.ts", import.meta.url), "utf8");
      const { code } = await transformWithOxc(source, "sw.ts", { lang: "ts" });
      this.emitFile({
        type: "asset",
        fileName: "sw.js",
        source: code
          .replace('"__PRECACHE__"', JSON.stringify(files))
          .replace("__VERSION__", `${MOBILE_BRAND.id}-${version}`)
          .replace("__INBOX__", `${MOBILE_BRAND.id}-inbox`),
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  // Relative paths: the same build runs at a site's root, under /app/ or inside the native shell.
  base: "./",
  resolve: {
    alias: { "@web": web },
    conditions: ["@fita/source"],
  },
  plugins: [pwa(mode === "native")],
  build: { target: "es2022", sourcemap: false },
  server: { fs: { allow: ["../.."] } },
  preview: { port: 4340 },
}));
