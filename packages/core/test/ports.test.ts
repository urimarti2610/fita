import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { type EmphasisOptions, emphasize } from "../src/index.js";

/**
 * Shared fixtures for the ports of this algorithm (plugins/calibre in Python,
 * plugins/koreader in Lua): each port must give exactly these results.
 * Regenerate after an intended behaviour change: UPDATE_FIXTURES=1 pnpm test:core
 */
const FILE = fileURLToPath(new URL("../../../plugins/fixtures/emphasis.json", import.meta.url));

type Case = { text: string; options: Partial<EmphasisOptions>; expected?: string };

const show = (c: Case) =>
  emphasize(c.text, c.options)
    .map((s) => (s.emphasis ? `[${s.text}]` : s.text))
    .join("");

describe("fixtures shared with the plugin ports", () => {
  const cases: Case[] = JSON.parse(readFileSync(FILE, "utf8"));

  if (process.env.UPDATE_FIXTURES) {
    for (const c of cases) c.expected = show(c);
    writeFileSync(FILE, `${JSON.stringify(cases, null, 2)}\n`);
  }

  it("match the reference implementation", () => {
    expect(cases.length).toBeGreaterThan(100);
    for (const c of cases) expect(show(c), JSON.stringify(c.text)).toBe(c.expected);
  });
});
