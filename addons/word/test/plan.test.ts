import { emphasize } from "@fita/core";
import { describe, expect, it } from "vitest";
import { format, MESSAGES, messagesFor } from "../src/i18n.js";
import { ADDIN_ID, manifest, officeVersion } from "../src/manifest.js";
import { escapeSearch, searchTargets } from "../src/plan.js";

describe("searchTargets", () => {
  it("finds the n-th match of each emphasized part", () => {
    expect(searchTargets(emphasize("Hello "))).toEqual([{ text: "He", occurrence: 0 }]);
    // "l'àvia" style elision: the anchor is after the article.
    expect(searchTargets(emphasize("l'àvia "))).toEqual([{ text: "àv", occurrence: 0 }]);
    // The emphasized text also appears earlier inside the same range.
    const spans = [
      { text: "ab-", emphasis: false },
      { text: "ab", emphasis: true },
      { text: "c", emphasis: false },
    ];
    expect(searchTargets(spans)).toEqual([{ text: "ab", occurrence: 1 }]);
    expect(searchTargets(emphasize("2024 "))).toEqual([]);
  });

  it("counts non-overlapping matches like Word's search", () => {
    const spans = [
      { text: "aaa", emphasis: false },
      { text: "aa", emphasis: true },
    ];
    // "aaaaa": matches of "aa" start at 0 and 2; the span starts at 3 -> after 2 matches.
    expect(searchTargets(spans)).toEqual([{ text: "aa", occurrence: 2 }]);
  });

  it("escapes Word's caret codes", () => {
    expect(escapeSearch("a^p")).toBe("a^^p");
  });
});

describe("i18n", () => {
  it("has the same keys in every language", () => {
    const keys = Object.keys(MESSAGES.en).sort();
    for (const [lang, messages] of Object.entries(MESSAGES)) {
      expect(Object.keys(messages).sort(), lang).toEqual(keys);
    }
    expect(messagesFor("ca-ES")).toBe(MESSAGES.ca);
    expect(messagesFor("es-MX")).toBe(MESSAGES.es);
    expect(messagesFor("de-DE")).toBe(MESSAGES.en);
    expect(messagesFor(undefined)).toBe(MESSAGES.en);
    expect(format("{done}/{total} {x}", { done: 1, total: 2 })).toBe("1/2 {x}");
  });
});

describe("manifest", () => {
  it("is a task pane add-in for Word served from the website", () => {
    const xml = manifest("0.1.0");
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    expect(doc.querySelector("parsererror")).toBeNull();
    expect(doc.querySelector("Id")?.textContent).toBe(ADDIN_ID);
    expect(doc.querySelector("Version")?.textContent).toBe("0.1.0.0");
    expect(doc.querySelector("Host")?.getAttribute("Name")).toBe("Document");
    expect(doc.querySelector("Set")?.getAttribute("MinVersion")).toBe("1.5");
    expect(doc.querySelector("SourceLocation")?.getAttribute("DefaultValue")).toBe(
      "https://fitaread.com/addins/word/taskpane.html",
    );
    expect(doc.querySelector("Permissions")?.textContent).toBe("ReadWriteDocument");
    const overrides = [...doc.querySelectorAll("Description Override")].map((o) =>
      o.getAttribute("Locale"),
    );
    expect(overrides).toEqual(["es-ES", "ca-ES"]);
  });

  it("uses four-part versions", () => {
    expect(officeVersion("1.2")).toBe("1.2.0.0");
    expect(officeVersion("1.2.3-beta")).toBe("1.2.3.0");
  });
});
