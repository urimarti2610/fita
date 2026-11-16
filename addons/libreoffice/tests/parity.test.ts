/**
 * Keeps the Python port in step with the TypeScript core: this test checks that
 * tests/cases.json holds the core's real output for every input, and the Python
 * tests (test_emphasis.py) check the port produces the same.
 *
 * After changing the core on purpose, refresh the file with:
 *   UPDATE_CASES=1 pnpm --filter @fita/libreoffice-extension test
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { type EmphasisOptions, emphasize } from "@fita/core";
import { expect, it } from "vitest";

type Case = { text: string; options?: Partial<EmphasisOptions>; expected: string };
const file = join(dirname(fileURLToPath(import.meta.url)), "cases.json");
const cases: Case[] = JSON.parse(readFileSync(file, "utf8"));

const show = (text: string, options?: Partial<EmphasisOptions>) =>
  emphasize(text, options)
    .map((s) => (s.emphasis ? `[${s.text}]` : s.text))
    .join("");

it("cases.json matches the core", () => {
  const actual = cases.map((c) => ({ ...c, expected: show(c.text, c.options) }));
  if (process.env.UPDATE_CASES) writeFileSync(file, `${JSON.stringify(actual, null, 2)}\n`);
  expect(actual).toEqual(cases);
});
