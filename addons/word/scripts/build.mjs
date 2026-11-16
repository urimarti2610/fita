// Builds the Word add-in into dist/: task pane (HTML, CSS, bundled JS), icons and
// manifest.xml. The website build copies dist/ to https://<website>/addins/word/.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(root, "../..");
const dist = join(root, "dist");
const { version } = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const conditions = ["@fita/source"];

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

await esbuild.build({
  entryPoints: [join(root, "src/taskpane.ts")],
  outfile: join(dist, "taskpane.js"),
  bundle: true,
  format: "iife",
  target: "es2020",
  minify: true,
  legalComments: "none",
  conditions,
});

// Evaluate the manifest generator (TypeScript) at build time.
const data = await esbuild.build({
  entryPoints: [join(root, "src/manifest.ts")],
  bundle: true,
  format: "esm",
  platform: "node",
  write: false,
  conditions,
});
const { manifest } = await import(
  `data:text/javascript;base64,${Buffer.from(data.outputFiles[0].text).toString("base64")}`
);
writeFileSync(join(dist, "manifest.xml"), manifest(version));

cpSync(join(root, "static"), dist, { recursive: true });
for (const size of [32, 128]) {
  cpSync(
    join(repo, "apps/extension/static/icons", `icon-${size}.png`),
    join(dist, `icon-${size}.png`),
  );
}
for (const file of ["LICENSE", "NOTICE"]) cpSync(join(repo, file), join(dist, file));
