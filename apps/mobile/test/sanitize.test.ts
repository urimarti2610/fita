import { describe, expect, it } from "vitest";
import { ID_PREFIX, sanitize } from "../src/sanitize.js";

const XHTML = (body: string) =>
  new DOMParser().parseFromString(
    `<?xml version="1.0"?><html xmlns="http://www.w3.org/1999/xhtml" xmlns:xlink="http://www.w3.org/1999/xlink"><head><title>T</title></head><body>${body}</body></html>`,
    "application/xhtml+xml",
  );
const HTML = (body: string) => new DOMParser().parseFromString(body, "text/html");

function render(doc: Document, hooks = {}) {
  const { fragment, images } = sanitize(doc.body, document, hooks);
  const div = document.createElement("div");
  div.append(fragment);
  return { div, images };
}

describe("sanitize", () => {
  it("keeps text and structure, and drops code, styles and handlers", () => {
    const { div } = render(
      HTML(
        `<h1 class="x" style="color:red" onclick="alert(1)">Títol</h1>
         <p>Hola <b>món</b><script>alert(1)</script><style>p{}</style></p>
         <form><input value="x"/><button>Go</button></form>
         <object data="x.swf"></object>
         <custom-thing>dins</custom-thing>`,
      ),
    );
    expect(div.querySelector("h1")?.outerHTML).toBe("<h1>Títol</h1>");
    expect(div.querySelector("p")?.innerHTML).toBe("Hola <b>món</b>");
    expect(
      div.querySelector("script, style, form, input, button, object, custom-thing"),
    ).toBeNull();
    // Unknown elements are unwrapped, never losing their text.
    expect(div.textContent).toContain("dins");
    expect(div.innerHTML).not.toMatch(/onclick|style=|class=/);
  });

  it("handles XHTML documents, prefixes ids and maps xml:lang", () => {
    const { div } = render(XHTML('<p id="p1" xml:lang="ca">L\'àvia</p>'));
    const p = div.querySelector("p");
    expect(p?.id).toBe(`${ID_PREFIX}p1`);
    expect(p?.getAttribute("lang")).toBe("ca");
  });

  it("opens web links outside and never loads remote images", () => {
    const { div, images } = render(
      HTML(
        `<a href="https://example.com/x">web</a><a href="javascript:alert(1)">bad</a>
         <img src="https://tracker.example/pixel.gif" alt="remote"/>
         <img src="data:image/png;base64,iVBORw0KGgo=" alt="inline"/>`,
      ),
    );
    const [web, bad] = div.querySelectorAll("a");
    expect(web?.getAttribute("href")).toBe("https://example.com/x");
    expect(web?.getAttribute("target")).toBe("_blank");
    expect(web?.getAttribute("rel")).toBe("noopener noreferrer");
    expect(bad?.hasAttribute("href")).toBe(false);
    const [remote, inline] = div.querySelectorAll("img");
    expect(remote?.hasAttribute("src")).toBe(false);
    expect(inline?.getAttribute("src")).toMatch(/^data:image\/png/);
    expect(images).toEqual([]);
  });

  it("reports book images for the caller to load, including SVG covers", () => {
    const { div, images } = render(
      XHTML(
        '<img src="../img/a.png" alt="A"/><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><image xlink:href="../img/cover.jpg" width="10" height="10"/></svg>',
      ),
      { image: (src: string) => `OPS/${src.replace("../", "")}` },
    );
    expect(images.map((i) => [i.attribute, i.source])).toEqual([
      ["src", "OPS/img/a.png"],
      ["href", "OPS/img/cover.jpg"],
    ]);
    const svg = div.getElementsByTagNameNS("http://www.w3.org/2000/svg", "svg")[0];
    expect(div.innerHTML).toContain("viewBox");
    expect(svg?.getAttribute("viewBox")).toBe("0 0 10 10");
  });

  it("turns internal links into reader links", () => {
    const { div } = render(HTML('<a href="#note-1">1</a>'));
    const a = div.querySelector("a");
    expect(a?.getAttribute("data-anchor")).toBe("note-1");
    expect(a?.getAttribute("data-path")).toBe("");
    expect(a?.getAttribute("href")).toBe(`#${ID_PREFIX}note-1`);
  });
});
