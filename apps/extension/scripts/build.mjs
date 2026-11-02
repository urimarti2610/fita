// Builds dist/chrome and dist/firefox from one source, plus ready-to-upload zips.
// Usage: node scripts/build.mjs [--e2e]
import {
  cpSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";
import JSZip from "jszip";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const e2e = process.argv.includes("--e2e");
const dist = join(root, e2e ? "dist-e2e" : "dist");
const { version } = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const conditions = ["@fita/source"];

// Evaluate build-time data (manifest, locales, CSS) from TypeScript.
const data = await esbuild.build({
  entryPoints: [join(root, "src/build-data.ts")],
  bundle: true,
  format: "esm",
  platform: "node",
  write: false,
  conditions,
});
const { manifest, locales, CONTENT_CSS, ARCHIVE_PREFIX } = await import(
  `data:text/javascript;base64,${Buffer.from(data.outputFiles[0].text).toString("base64")}`
);

rmSync(dist, { recursive: true, force: true });

for (const browser of ["chrome", "firefox"]) {
  const out = join(dist, browser);
  mkdirSync(out, { recursive: true });
  await esbuild.build({
    entryPoints: ["background", "content", "popup"].map((n) => join(root, "src", `${n}.ts`)),
    outdir: out,
    bundle: true,
    format: "iife",
    target: browser === "chrome" ? "chrome120" : "firefox128",
    minify: !e2e,
    legalComments: "none",
    conditions,
    define: { "process.env.E2E": JSON.stringify(String(e2e)) },
  });
  cpSync(join(root, "static"), out, { recursive: true });
  // Apache-2.0 §4: ship the licence and the attribution notice with every copy.
  for (const file of ["LICENSE", "NOTICE"]) cpSync(join(root, "../..", file), join(out, file));
  writeFileSync(join(out, "content.css"), CONTENT_CSS);
  writeFileSync(
    join(out, "manifest.json"),
    `${JSON.stringify(manifest(browser, version, e2e), null, 2)}\n`,
  );
  for (const [lang, messages] of Object.entries(locales())) {
    mkdirSync(join(out, "_locales", lang), { recursive: true });
    writeFileSync(join(out, "_locales", lang, "messages.json"), JSON.stringify(messages, null, 2));
  }
  if (!e2e) await zip(out, join(dist, `${ARCHIVE_PREFIX}-${browser}-${version}.zip`));
}

async function zip(dir, file) {
  const archive = new JSZip();
  const walk = (d) => {
    for (const name of readdirSync(d).sort()) {
      const path = join(d, name);
      if (statSync(path).isDirectory()) walk(path);
      else
        archive.file(relative(dir, path), readFileSync(path), {
          date: new Date("2026-01-01T00:00:00Z"),
        });
    }
  };
  walk(dir);
  writeFileSync(file, await archive.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
}

console.log(`Built ${relative(process.cwd(), dist)} (chrome, firefox)`);
