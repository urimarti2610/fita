import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createContext, runInContext } from "node:vm";
import { BRAND } from "@fita/core";
import { describe, expect, it } from "vitest";
import { format, MESSAGES, messagesFor } from "../src/i18n.js";
import { parseSettings } from "../src/plan.js";
import { sidebarHtml } from "../src/sidebar.js";
import { FakeDoc, FakeParagraph, FakeText, TEXT } from "./fake-doc.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("i18n", () => {
  it("has the same keys in every language", () => {
    const keys = Object.keys(MESSAGES.en as object).sort();
    for (const [lang, messages] of Object.entries(MESSAGES)) {
      expect(Object.keys(messages).sort(), lang).toEqual(keys);
      for (const value of Object.values(messages)) expect(value.trim(), lang).not.toBe("");
    }
    expect(Object.keys(MESSAGES).sort()).toEqual(["ca", "en", "es"]);
  });

  it("picks the language from the account locale", () => {
    expect(messagesFor("ca_ES")).toBe(MESSAGES.ca);
    expect(messagesFor("es-419")).toBe(MESSAGES.es);
    expect(messagesFor("ja")).toBe(MESSAGES.en);
    expect(messagesFor(null)).toBe(MESSAGES.en);
    expect(format("{count} of {total} {missing}", { count: 2, total: 3 })).toBe("2 of 3 {missing}");
  });
});

describe("settings", () => {
  it("clamps and validates", () => {
    expect(parseSettings({ strength: 2, style: "color" })).toEqual({
      strength: 0.7,
      style: "color",
    });
    expect(parseSettings({ strength: "x", style: "blink" })).toEqual({
      strength: 0.45,
      style: "bold",
    });
    expect(parseSettings(null)).toEqual({ strength: 0.45, style: "bold" });
  });
});

describe("sidebar", () => {
  it("is translated, escaped and self-contained", () => {
    const t = { ...MESSAGES.ca, intro: "<b>&</b>", working: "</script>" } as typeof MESSAGES.en;
    const html = sidebarHtml(t, { strength: 0.3, style: "underline" }, "ca");
    expect(html).toContain('<html lang="ca">');
    expect(html).toContain("&lt;b&gt;&amp;&lt;/b&gt;");
    expect(html).not.toContain('</script>"');
    expect(html).toContain('value="underline" checked');
    expect(html).toContain('value="0.3"');
    expect(html).not.toMatch(/<(script|link)[^>]+(src|href)=/);
  });
});

/** Runs the built dist/Code.js the way Apps Script does: one global script. */
describe("built script", () => {
  execFileSync(process.execPath, [join(root, "scripts/build.mjs")]);
  const code = readFileSync(join(root, "dist/Code.js"), "utf8");
  const manifest = JSON.parse(readFileSync(join(root, "dist/appsscript.json"), "utf8"));

  function load(locale = "es") {
    const run = new FakeText("Hello brave world");
    const document = new FakeDoc([new FakeParagraph([run])]);
    const calls: {
      menu: string[][];
      alerts: string[];
      sidebar: string[];
      props: Map<string, string>;
    } = {
      menu: [],
      alerts: [],
      sidebar: [],
      props: new Map(),
    };
    const menu = {
      addItem: (caption: string, fn: string) => {
        calls.menu.push([caption, fn]);
        return menu;
      },
      addSeparator: () => menu,
      addToUi: () => {},
    };
    const context = createContext({
      Intl,
      DocumentApp: {
        getActiveDocument: () => document,
        getUi: () => ({
          createAddonMenu: () => menu,
          showSidebar: (html: { html: string }) => calls.sidebar.push(html.html),
          alert: (m: string) => calls.alerts.push(m),
        }),
        ElementType: { TEXT },
      },
      HtmlService: {
        createHtmlOutput: (html: string) => ({ setTitle: () => ({ html }) }),
      },
      PropertiesService: {
        getUserProperties: () => ({
          getProperty: (k: string) => calls.props.get(k) ?? null,
          setProperty: (k: string, v: string) => calls.props.set(k, v),
        }),
      },
      Session: { getActiveUserLocale: () => locale },
    });
    runInContext(code, context);
    return { context: context as Record<string, (arg?: unknown) => string>, run, document, calls };
  }

  it("asks only for the current document and the add-on UI", () => {
    expect(manifest.oauthScopes).toEqual([
      "https://www.googleapis.com/auth/documents.currentonly",
      "https://www.googleapis.com/auth/script.container.ui",
    ]);
    expect(code).toContain("Apache License");
  });

  it("builds a translated menu", () => {
    const { context, calls } = load("ca");
    context.onInstall?.();
    expect(calls.menu.map(([, fn]) => fn)).toEqual([
      "emphasizeDocument",
      "emphasizeSelection",
      "removeEmphasis",
      "showSidebar",
    ]);
    expect(calls.menu[0]?.[0]).toBe(MESSAGES.ca?.menuDocument);
  });

  it("emphasizes and removes from the menu, with alerts", () => {
    const { context, run, calls } = load("es");
    context.emphasizeDocument?.();
    expect(run.marked()).toBe("[He]llo [br]ave [wo]rld");
    expect(calls.alerts[0]).toBe(format(MESSAGES.es?.done ?? "", { count: 3 }));
    context.removeEmphasis?.();
    expect(run.marked()).toBe("Hello brave world");
    context.emphasizeSelection?.();
    expect(calls.alerts.at(-1)).toBe(MESSAGES.es?.noSelection);
  });

  it("saves sidebar settings and reports without alerts", () => {
    const { context, run, calls, document } = load("en");
    const message = context.emphasizeDocument?.({
      source: "sidebar",
      strength: 0.7,
      style: "underline",
    });
    expect(message).toBe("Done: 3 words emphasized.");
    expect(calls.alerts).toHaveLength(0);
    expect(run.marked(run.underline)).toBe("[Hell]o [brav]e [worl]d");
    expect(JSON.parse(calls.props.get(`${BRAND.id}.settings`) ?? "")).toEqual({
      strength: 0.7,
      style: "underline",
    });
    document.select([run, 0, 4]);
    context.emphasizeSelection?.({ source: "sidebar", strength: 0.7, style: "bold" });
    expect(run.marked()).toBe("[Hell]o brave world");
    context.showSidebar?.();
    expect(calls.sidebar[0]).toContain('value="bold" checked');
    expect(context.removeEmphasis?.({ source: "sidebar" })).toBe("Emphasis removed.");
  });
});
