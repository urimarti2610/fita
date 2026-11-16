// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from "vitest";
import { createReaderView, extractArticle, READER_TAG, sanitize } from "../src/reader-view.js";
import { DEFAULT_SETTINGS } from "../src/settings.js";

const ARTICLE = `
  <header><nav><a href="/">Inici</a> <a href="/a">Notícies</a></nav></header>
  <main><article>
    <h1>El riu i la ciutat</h1>
    <p class="byline">Per Anna Puig</p>
    ${Array.from(
      { length: 8 },
      (_, i) =>
        `<p>Paràgraf ${i + 1}: la ciutat creix al costat del riu, i cada estiu les famílies hi baixen a passejar, a llegir i a escoltar l'aigua que passa sota els ponts vells de pedra.</p>`,
    ).join("")}
    <p onclick="alert(1)">Final <a href="javascript:alert(1)">enllaç</a>.</p>
    <script>window.hacked = true</script>
  </article></main>
  <footer>Peu de pàgina</footer>`;

afterEach(() => {
  document.body.innerHTML = "";
  document.title = "";
  for (const el of document.querySelectorAll(READER_TAG)) el.remove();
});

describe("sanitize", () => {
  it("removes scripts, frames, handlers and script URLs, keeping text and safe links", () => {
    const root = document.createElement("div");
    root.innerHTML = `<p onclick="x()" style="color:red">Text <a href=" java\tscript:x()">a</a>
      <a href="https://example.com/">b</a><img src="data:text/html,x" onerror="x()"></p>
      <iframe src="https://example.com"></iframe><script>x()</script><form><input></form>`;
    sanitize(root);
    expect(root.querySelector("script, iframe, form, input")).toBeNull();
    const p = root.querySelector("p");
    expect(p?.hasAttribute("onclick")).toBe(false);
    expect(p?.hasAttribute("style")).toBe(false);
    const [bad, good] = [...root.querySelectorAll("a")];
    expect(bad?.hasAttribute("href")).toBe(false);
    expect(good?.getAttribute("href")).toBe("https://example.com/");
    expect(root.querySelector("img")?.hasAttribute("src")).toBe(false);
    expect(root.querySelector("img")?.hasAttribute("onerror")).toBe(false);
  });
});

describe("extractArticle", () => {
  it("keeps the article and drops navigation, without touching the page", () => {
    document.documentElement.lang = "ca";
    document.title = "El riu i la ciutat | Diari";
    document.body.innerHTML = ARTICLE;
    const before = document.body.innerHTML;
    const article = extractArticle(document);
    expect(article).not.toBeNull();
    expect(article?.title).toContain("El riu i la ciutat");
    expect(article?.lang).toBe("ca");
    const holder = document.createElement("div");
    holder.append(article?.content as DocumentFragment);
    expect(holder.textContent).toContain("Paràgraf 8");
    expect(holder.textContent).not.toContain("Peu de pàgina");
    expect(holder.querySelector("script, [onclick]")).toBeNull();
    expect(document.body.innerHTML).toBe(before);
  });

  it("returns null when there is nothing to read", () => {
    document.body.innerHTML = "";
    expect(extractArticle(document)).toBeNull();
  });
});

describe("createReaderView", () => {
  it("opens a modal view outside the body, follows settings and closes cleanly", () => {
    document.body.innerHTML = ARTICLE;
    const before = document.body.innerHTML;
    const article = extractArticle(document);
    if (!article) throw new Error("no article");
    const view = createReaderView(document, { close: "Tanca" });

    view.open(article, { ...DEFAULT_SETTINGS, lineHeight: 2, maxWidth: 50 });
    expect(view.isOpen).toBe(true);
    const host = document.querySelector(READER_TAG);
    expect(host?.parentElement).toBe(document.documentElement);
    expect(document.body.innerHTML).toBe(before);

    view.update({ ...DEFAULT_SETTINGS, style: "underline" });
    view.close();
    expect(view.isOpen).toBe(false);
    expect(document.querySelector(READER_TAG)).toBeNull();
    expect(document.body.innerHTML).toBe(before);
    // Closing twice is harmless.
    view.close();
  });
});
