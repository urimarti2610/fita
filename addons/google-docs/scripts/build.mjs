// Bundles the add-on and @fita/core into dist/, ready for `clasp push`.
// Apps Script has no modules: everything goes into one script, and the entry points
// are re-declared as top-level functions so menus and google.script.run can find them.
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const GLOBAL = "__addon";
const ENTRY_POINTS = [
  "onOpen",
  "onInstall",
  "showSidebar",
  "emphasizeDocument",
  "emphasizeSelection",
  "removeEmphasis",
];

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const result = await esbuild.build({
  entryPoints: [join(root, "src/main.ts")],
  bundle: true,
  format: "iife",
  globalName: GLOBAL,
  // Apps Script's V8 runtime.
  target: "es2020",
  conditions: ["@fita/source"],
  legalComments: "none",
  write: false,
});

const notice = readFileSync(join(root, "../../NOTICE"), "utf8").trim();
const wrappers = ENTRY_POINTS.map(
  (name) => `function ${name}(arg) {\n  return ${GLOBAL}.${name}(arg);\n}`,
).join("\n\n");
writeFileSync(
  join(dist, "Code.js"),
  `/*\n${notice}\nLicensed under the Apache License 2.0.\n*/\n${result.outputFiles[0].text}\n${wrappers}\n`,
);
copyFileSync(join(root, "appsscript.json"), join(dist, "appsscript.json"));
