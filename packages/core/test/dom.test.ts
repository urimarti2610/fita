// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from "vitest";
import {
  type ApplyConfig,
  applyToElement,
  EMPHASIS_CSS,
  type EmphasisOptions,
  STYLE_ATTRIBUTE,
} from "../src/index.js";
import { CLASSIC } from "./helpers.js";

const apply = (root: Element, options: Partial<EmphasisOptions> = {}, config?: ApplyConfig) =>
  applyToElement(root, { ...CLASSIC, ...options }, config);

const tick = () => new Promise((r) => setTimeout(r, 0));

function setup(html: string) {
  document.body.innerHTML = `<main>${html}</main>`;
  return document.querySelector("main") as HTMLElement;
}

afterEach(() => {
  document.body.innerHTML = "";
  document.adoptedStyleSheets = [];
  for (const s of document.querySelectorAll("style")) s.remove();
});

describe("applyToElement", () => {
  it("wraps words and keeps textContent identical", async () => {
    const root = setup("<p>Hola <a href='#'>mundo</a> bonito</p>");
    const before = root.textContent;
    const c = apply(root);
    await c.idle;
    expect(root.textContent).toBe(before);
    expect(root.querySelector("p")?.innerHTML).toBe(
      '<fita-w><fita-e>Ho</fita-e>la </fita-w><a href="#"><fita-w><fita-e>mu</fita-e>ndo</fita-w></a><fita-w> <fita-e>bo</fita-e>nito</fita-w>',
    );
    c.stop();
  });

  it("never touches skipped elements", async () => {
    const skipped = [
      "<pre>texto pre</pre>",
      "<code>texto code</code>",
      "<kbd>tecla</kbd>",
      "<samp>salida</samp>",
      "<script>var texto</script>",
      "<style>.texto{}</style>",
      "<noscript>texto</noscript>",
      "<textarea>texto</textarea>",
      "<select><option>opción</option></select>",
      "<div contenteditable='true'>editable</div>",
      "<div contenteditable>editable</div>",
      "<div aria-hidden='true'>oculto</div>",
      "<div class='CodeMirror'>editor</div>",
      "<div class='monaco-editor'>editor</div>",
      "<div class='cm-editor'>editor</div>",
      "<svg><text>gráfico</text></svg>",
    ];
    const root = setup(skipped.join(""));
    const before = root.innerHTML;
    const c = apply(root);
    await c.idle;
    expect(root.innerHTML).toBe(before);
    c.stop();
  });

  it("processes contenteditable=false and leaves empty/whitespace nodes alone", async () => {
    const root = setup("<div contenteditable='false'>texto</div><p>  </p><p>123</p>");
    const c = apply(root);
    await c.idle;
    expect(root.querySelectorAll("fita-w")).toHaveLength(1);
    c.stop();
  });

  it("undo leaves the DOM identical", async () => {
    const html =
      "<h1 class='t'>Títol</h1><p>L'àvia <em>col·lecciona</em> llibres &amp; <b>discos</b>.</p><ul><li>u</li><li>dos</li></ul>";
    const root = setup(html);
    const before = root.innerHTML;
    const childCounts = [...root.querySelectorAll("*")].map((el) => el.childNodes.length);
    const c = apply(root);
    await c.idle;
    expect(root.innerHTML).not.toBe(before);
    c.undo();
    expect(root.innerHTML).toBe(before);
    expect([...root.querySelectorAll("*")].map((el) => el.childNodes.length)).toEqual(childCounts);
  });

  it("injects and removes the stylesheet", async () => {
    const root = setup("<p>hola</p>");
    const c = apply(root);
    const hasSheet = () =>
      document.adoptedStyleSheets.length > 0 ||
      [...document.querySelectorAll("style")].some((s) => s.textContent === EMPHASIS_CSS);
    expect(hasSheet()).toBe(true);
    await c.idle;
    c.undo();
    expect(hasSheet()).toBe(false);
  });

  it("can skip style injection", async () => {
    const root = setup("<p>hola</p>");
    const c = apply(root, {}, { injectStyles: false, sync: true });
    expect(document.adoptedStyleSheets).toHaveLength(0);
    expect(document.querySelectorAll("style")).toHaveLength(0);
    c.undo();
  });

  it("supports span elements for XHTML output, synchronously", () => {
    const root = setup("<p>Hola mundo</p>");
    const c = apply(root, {}, { elements: "span", sync: true, injectStyles: false });
    expect(root.querySelector("p")?.innerHTML).toBe(
      '<span class="fita-w"><span class="fita-e">Ho</span>la <span class="fita-e">mu</span>ndo</span>',
    );
    c.undo();
    expect(root.innerHTML).toBe("<p>Hola mundo</p>");
  });

  it("uses the document language", async () => {
    const root = setup("<p lang='ca'>l'àvia</p>");
    const p = root.querySelector("p") as HTMLElement;
    const c = apply(p);
    await c.idle;
    expect(p.innerHTML).toBe("<fita-w>l'<fita-e>àv</fita-e>ia</fita-w>");
    c.stop();
  });

  it("ignores an invalid lang attribute", async () => {
    const root = setup("<p lang='%%'>hola</p>");
    const c = apply(root.querySelector("p") as HTMLElement);
    await c.idle;
    expect(root.querySelector("fita-e")?.textContent).toBe("ho");
    c.stop();
  });

  it("does nothing when the root itself is skipped", async () => {
    const root = setup("<pre>texto</pre>");
    const c = apply(root.querySelector("pre") as HTMLElement);
    await c.idle;
    expect(root.innerHTML).toBe("<pre>texto</pre>");
    c.stop();
  });

  it("processes added content and ignores its own mutations", async () => {
    const root = setup("<p>uno</p>");
    const c = apply(root);
    await c.idle;
    const p = document.createElement("p");
    p.textContent = "nuevo párrafo";
    root.append(p);
    root.append(document.createTextNode("texto suelto"));
    const pre = document.createElement("pre");
    root.querySelector("p")?.append(pre);
    pre.append(document.createTextNode("código"));
    await tick();
    await c.idle;
    expect(p.querySelector("fita-e")?.textContent).toBe("nu");
    expect(root.lastChild?.nodeName).toBe("FITA-W");
    expect(pre.innerHTML).toBe("código");
    // No feedback loop: after settling, nothing else changes.
    const settled = root.innerHTML;
    await tick();
    await tick();
    expect(root.innerHTML).toBe(settled);
    c.stop();
  });

  it("stop keeps emphasis but stops observing", async () => {
    const root = setup("<p>uno</p>");
    const c = apply(root);
    await c.idle;
    c.stop();
    const p = document.createElement("p");
    p.textContent = "después";
    root.append(p);
    await tick();
    expect(root.querySelectorAll("fita-w")).toHaveLength(1);
    expect(p.innerHTML).toBe("después");
    c.update({ strength: 0.7 }); // no-op once stopped
    await tick();
    expect(root.querySelector("fita-e")?.textContent).toBe("u");
  });

  it("update re-renders with new options", async () => {
    const root = setup("<p>elefante</p>");
    const c = apply(root, { strength: 0.2 });
    await c.idle;
    expect(root.querySelector("fita-e")?.textContent).toBe("el");
    c.update({ strength: 0.7 });
    await c.idle;
    expect(root.querySelector("fita-e")?.textContent).toBe("elefan");
    expect(root.querySelectorAll("fita-w")).toHaveLength(1);
    c.undo();
    expect(root.innerHTML).toBe("<p>elefante</p>");
  });

  it("recovers when the page removes nodes while processing", async () => {
    const paragraphs = Array.from({ length: 2000 }, (_, i) => `<p>párrafo ${i}</p>`).join("");
    const root = setup(`<section>${paragraphs}</section><p>final</p>`);
    const c = apply(root);
    await tick();
    root.querySelector("section")?.remove();
    await c.idle;
    expect(root.querySelector("p fita-e")?.textContent).toBe("fi");
    c.stop();
  });

  it("does not block on a 100,000-word page and undoes cleanly", async () => {
    const sentence = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do. ";
    const paragraph = `<p>${sentence.repeat(10)}</p>`; // 100 words
    const root = setup(paragraph.repeat(1000));
    const before = root.innerHTML;

    let maxGap = 0;
    let last = performance.now();
    let monitoring = true;
    const monitor = () => {
      const now = performance.now();
      maxGap = Math.max(maxGap, now - last);
      last = now;
      if (monitoring) setTimeout(monitor, 0);
    };
    setTimeout(monitor, 0);

    const c = apply(root);
    await c.idle;
    monitoring = false;

    expect(root.querySelectorAll("fita-w")).toHaveLength(1000);
    expect(root.querySelectorAll("fita-e")).toHaveLength(100_000);
    // The event loop kept turning: no single task held it for long.
    expect(maxGap).toBeLessThan(250);
    c.undo();
    expect(root.innerHTML).toBe(before);
  });

  it("splits one huge text node into chunks and still undoes 1:1", async () => {
    const text = `${"palabra ".repeat(20_000)}https://example.com/${"x".repeat(5000)}`;
    const root = setup("<p></p>");
    const p = root.querySelector("p") as HTMLElement;
    p.textContent = text;
    const c = apply(root);
    await c.idle;
    expect(p.childNodes).toHaveLength(1);
    expect(p.textContent).toBe(text);
    expect(p.querySelectorAll("fita-e")).toHaveLength(20_000);
    c.update({ strength: 0.7 }); // re-render while chunking restarts
    await c.idle;
    expect(p.querySelector("fita-e")?.textContent).toBe("palab");
    c.undo();
    expect(p.childNodes).toHaveLength(1);
    expect(p.firstChild?.nodeValue).toBe(text);
  });

  it("style attribute selectors cover all non-default styles", () => {
    for (const style of ["bold", "color", "underline", "fade"]) {
      expect(EMPHASIS_CSS).toContain(`[${STYLE_ATTRIBUTE}="${style}"]`);
    }
  });
});
