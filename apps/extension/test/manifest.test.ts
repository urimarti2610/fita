import { describe, expect, it } from "vitest";
import { CONTENT_CSS, locales, manifest } from "../src/build-data.js";
import { originPattern, siteOrigin } from "../src/settings.js";

describe("manifest", () => {
  it("uses a service worker on Chrome and background scripts + gecko id on Firefox", () => {
    const chrome = manifest("chrome", "1.2.3");
    const firefox = manifest("firefox", "1.2.3");
    expect(chrome.background).toEqual({ service_worker: "background.js" });
    expect(chrome).not.toHaveProperty("browser_specific_settings");
    expect(firefox.background).toEqual({ scripts: ["background.js"] });
    expect(firefox.browser_specific_settings?.gecko.id).toMatch(/@/);
    expect(firefox.version).toBe("1.2.3");
  });

  it("requests only minimal permissions, host access optional", () => {
    for (const browser of ["chrome", "firefox"] as const) {
      const m = manifest(browser, "0.0.0");
      expect(m.permissions).toEqual(["storage", "contextMenus", "activeTab", "scripting"]);
      expect(m).not.toHaveProperty("host_permissions");
      expect(m.optional_host_permissions).toEqual(["*://*/*"]);
      expect(m.commands["toggle-emphasis"].suggested_key.default).toBe("Alt+B");
    }
    expect(manifest("chrome", "0.0.0", true).host_permissions).toContain("http://127.0.0.1/*");
  });

  it("ships the same message keys in every language, with the brand name filled in", () => {
    const all = locales();
    const keys = Object.keys(all.en ?? {}).sort();
    expect(Object.keys(all).length).toBeGreaterThan(3);
    for (const [lang, messages] of Object.entries(all)) {
      expect(Object.keys(messages).sort(), lang).toEqual(keys);
      for (const { message } of Object.values(messages))
        expect(message, lang).not.toContain("{name}");
    }
  });

  it("includes emphasis and comfort styles", () => {
    expect(CONTENT_CSS).toContain("fita-e");
    expect(CONTENT_CSS).toContain("line-height");
  });
});

describe("sites", () => {
  it("only treats http(s) pages as sites", () => {
    expect(siteOrigin("https://example.com/a?b")).toBe("https://example.com");
    expect(siteOrigin("chrome://extensions")).toBeNull();
    expect(siteOrigin("not a url")).toBeNull();
    expect(siteOrigin(undefined)).toBeNull();
  });

  it("builds match patterns without ports", () => {
    expect(originPattern("http://localhost:8080")).toBe("http://localhost/*");
    expect(originPattern("https://example.com")).toBe("https://example.com/*");
  });
});
