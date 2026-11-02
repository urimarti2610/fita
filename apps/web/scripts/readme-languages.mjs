// Regenerates the "In your language" section of the root README.md from the website's
// locale files, so every language the site speaks is summarised there too.
// Usage: node --experimental-strip-types apps/web/scripts/readme-languages.mjs
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const locales = new URL("../src/locales/", import.meta.url);
const readme = fileURLToPath(new URL("../../../README.md", import.meta.url));
const site = readFileSync(
  new URL("../../../packages/core/src/brand.ts", import.meta.url),
  "utf8",
).match(/website: "([^"]+)"/)?.[1];

const entries = [];
for (const file of readdirSync(locales).filter((f) => f.endsWith(".ts"))) {
  const lang = file.slice(0, -3);
  const locale = await import(new URL(file, locales).href);
  entries.push({ lang, name: locale.name, lede: locale.strings.hero.lede });
}
// Same order as the website's language menu: alphabetical by native name.
entries.sort((a, b) => a.name.localeCompare(b.name, "und"));

const section = entries
  .map(
    ({ lang, name, lede }) =>
      `<details lang="${lang}"><summary><strong>${name}</strong></summary>\n\n${lede}\n\n[${site.replace(/^https:\/\//, "")}/${lang}/](${site}/${lang}/)\n\n</details>`,
  )
  .join("\n");

const START = "<!-- languages:start -->";
const END = "<!-- languages:end -->";
const text = readFileSync(readme, "utf8");
if (!text.includes(START) || !text.includes(END)) throw new Error("README markers missing");
writeFileSync(
  readme,
  `${text.slice(0, text.indexOf(START) + START.length)}\n${section}\n${text.slice(text.indexOf(END))}`,
);
console.log(`README: ${entries.length} languages`);
