import { describe, expect, it } from "vitest";
import { createMarkupEmphasizer, type MarkupConfig, staticEmphasisCSS } from "../src/index.js";
import { CLASSIC } from "./helpers.js";

const E = (s: string) => `<span class="fita-e">${s}</span>`;
const run = (
  markup: string,
  options: Parameters<typeof createMarkupEmphasizer>[0] = {},
  config: MarkupConfig = {},
) => createMarkupEmphasizer({ ...CLASSIC, ...options }, { style: "bold", ...config })(markup);

describe("createMarkupEmphasizer", () => {
  it("emphasizes text and keeps tags and attributes byte for byte", () => {
    expect(run('<p class="x" data-a=\'1>2\'>Hola <a href="/m?a=1&amp;b">mundo</a></p>')).toBe(
      `<p class="x" data-a='1>2'>${E("Ho")}la <a href="/m?a=1&amp;b">${E("mu")}ndo</a></p>`,
    );
  });

  it("keeps the text content identical once tags are stripped", () => {
    const xhtml =
      '<?xml version="1.0" encoding="utf-8"?>\n<!DOCTYPE html>\n<html xmlns="http://www.w3.org/1999/xhtml"><head><title>Títol</title><style>p{}</style></head><body><p>L&apos;àvia &amp; el nét &lt;3 &#233;s &#xe9;s</p><!-- comentari --></body></html>';
    const out = run(xhtml);
    const strip = (s: string) => s.replace(/<[^>]+>/g, "");
    expect(
      strip(out)
        .replace("&apos;", "'")
        .replace(/&#x?[\da-f]+;/gi, "é"),
    ).toBe(
      strip(xhtml)
        .replace("&apos;", "'")
        .replace(/&#x?[\da-f]+;/gi, "é"),
    );
    expect(out).toContain("<title>Títol</title>");
    expect(out).toContain("<!-- comentari -->");
    expect(out).toContain(`L'${E("àv")}ia &amp; `);
  });

  it("decodes entities inside words so they are not split", () => {
    expect(run("<p>caf&eacute; Espa&ntilde;a &Ccedil;a</p>")).toBe(
      `<p>${E("ca")}fé ${E("Es")}paña ${E("Ç")}a</p>`,
    );
  });

  it("preserves unknown entities untouched", () => {
    expect(run("<p>a&foo;b palabra</p>")).toBe(`<p>${E("a")}&foo;${E("b")} ${E("pal")}abra</p>`);
  });

  it("skips code, pre, raw-text elements and marked elements", () => {
    const skipped = [
      "<pre>texto <b>pre</b></pre>",
      "<code>x &lt; y</code>",
      "<script>if (a < b) { texto() }</script>",
      "<SCRIPT>a<b</SCRIPT>",
      "<style>p > a { }</style>",
      "<textarea>texto</textarea>",
      "<svg:svg><svg:text>gráfico</svg:text></svg:svg>",
      "<math><mi>x</mi></math>",
      '<div contenteditable="true">edit <div>nested</div> still</div>',
      "<div contenteditable>edit</div>",
      '<span aria-hidden="true">oculto</span>',
      "<pre>a<pre>b</pre>c</pre>",
      "<![CDATA[ texto ]]>",
      "<?pi texto?>",
    ];
    for (const html of skipped) expect(run(html)).toBe(html);
    expect(run('<div contenteditable="false">texto</div>')).toContain(E("te"));
  });

  it("returns to normal text after a skipped element", () => {
    expect(run("<pre>no</pre><p>sí</p>")).toBe(`<pre>no</pre><p>${E("s")}í</p>`);
  });

  it("handles HTML void and self-closing tags", () => {
    expect(run("<p>uno<br>dos<img src=a.png/><hr/>tres</p>")).toBe(
      `<p>${E("u")}no<br>${E("d")}os<img src=a.png/><hr/>${E("tr")}es</p>`,
    );
  });

  it("escapes a stray < in HTML text", () => {
    expect(run("<p>1 < 2 y más</p>")).toBe(`<p>1 &lt; 2 ${E("y")} ${E("m")}ás</p>`);
  });

  it("copies an unterminated comment or raw element to the end", () => {
    expect(run("<p>hola</p><!-- sin cerrar")).toBe(`<p>${E("ho")}la</p><!-- sin cerrar`);
    expect(run("<script>sin cerrar")).toBe("<script>sin cerrar");
  });

  it("carries the every counter across calls", () => {
    const emphasize = createMarkupEmphasizer({ ...CLASSIC, every: 2 }, { style: "bold" });
    expect(emphasize("<p>uno dos</p>")).toBe(`<p>${E("u")}no dos</p>`);
    expect(emphasize("<p>tres cuatro</p>")).toBe(`<p>${E("tr")}es cuatro</p>`);
  });

  it("wraps the rest of each word for the fade style", () => {
    expect(run("<p>Hola, mundo</p>", {}, { style: "fade" })).toBe(
      `<p>${E("Ho")}<span class="fita-r">la, </span>${E("mu")}<span class="fita-r">ndo</span></p>`,
    );
  });

  it("defaults to bold start and faded rest", () => {
    expect(createMarkupEmphasizer()("<p>lectura</p>")).toBe(
      `<p>${E("lectu")}<span class="fita-r">ra</span></p>`,
    );
  });

  it("leaves whitespace-only text alone", () => {
    expect(run("<ul>\n  <li>a</li>\n</ul>")).toBe(`<ul>\n  <li>${E("a")}</li>\n</ul>`);
  });
});

describe("staticEmphasisCSS", () => {
  it("has reader-safe CSS for every style", () => {
    expect(staticEmphasisCSS()).toContain("font-weight: bold");
    expect(staticEmphasisCSS()).toContain(".fita-r { opacity");
    expect(staticEmphasisCSS("bold")).not.toContain("fita-r");
    expect(staticEmphasisCSS("color")).toContain("color:");
    expect(staticEmphasisCSS("underline")).toContain("underline");
    expect(staticEmphasisCSS("fade")).toContain(".fita-r");
    for (const s of ["bold-fade", "bold", "color", "underline", "fade"] as const) {
      expect(staticEmphasisCSS(s)).not.toContain("color-mix");
    }
  });
});
