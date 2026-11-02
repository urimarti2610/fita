import JSZip from "jszip";
import { describe, expect, it } from "vitest";
import { type ConvertRequest, convert, detectFormat, OUTPUTS } from "../src/convert/convert.js";
import { ConvertError } from "../src/convert/epub.js";
import { emphasizeMarkdown, splitChapters, textToXhtml } from "../src/convert/text.js";
import { makeEpub } from "./fixtures.js";

const request = (file: Blob, name: string, output: ConvertRequest["output"]): ConvertRequest => ({
  file,
  name,
  input: detectFormat(name) ?? "txt",
  output,
  strength: 0.4,
  every: 1,
  style: "bold",
  lang: "es",
  labels: { part: "Parte", contents: "Índice" },
});

async function unzip(blob: Blob) {
  return JSZip.loadAsync(await blob.arrayBuffer());
}

/** Reads the raw zip to check the first local header (OCF: mimetype first, stored). */
async function firstEntry(blob: Blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const view = new DataView(bytes.buffer);
  const method = view.getUint16(8, true);
  const nameLength = view.getUint16(26, true);
  const extraLength = view.getUint16(28, true);
  const name = new TextDecoder().decode(bytes.slice(30, 30 + nameLength));
  return { name, method, extraLength };
}

describe("EPUB", () => {
  it("emphasizes spine chapters, keeps the rest, puts mimetype first and stored", async () => {
    const progress: number[] = [];
    const { blob, name } = await convert(request(await makeEpub(), "Llibre.epub", "epub"), (v) =>
      progress.push(v),
    );
    expect(name).toBe("Llibre.fita.epub");
    expect(await firstEntry(blob)).toEqual({ name: "mimetype", method: 0, extraLength: 0 });
    const zip = await unzip(blob);
    const chapter = await zip.file("OPS/Text/capítol-0.xhtml")?.async("string");
    expect(chapter).toContain(`L'<span class="fita-e">àv</span>ia`);
    expect(chapter).toContain("<pre>codi</pre>");
    expect(chapter).toContain('<style type="text/css">.fita-e { font-weight: bold; }');
    expect(await zip.file("OPS/img/a.png")?.async("uint8array")).toEqual(
      new Uint8Array([137, 80, 78, 71, 1, 2, 3]),
    );
    expect(await zip.file("OPS/book.opf")?.async("string")).toContain(
      "<dc:title>Llibre</dc:title>",
    );
    expect(progress.at(-1)).toBe(1);
  });

  it("refuses books with DRM, but not font obfuscation", async () => {
    const drm = await makeEpub({
      extra: {
        "META-INF/encryption.xml":
          '<encryption><EncryptedData><EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#aes128-cbc"/></EncryptedData></encryption>',
      },
    });
    await expect(convert(request(drm, "a.epub", "epub"), () => {})).rejects.toEqual(
      new ConvertError("drm"),
    );
    const adobe = await makeEpub({ extra: { "META-INF/rights.xml": "<rights/>" } });
    await expect(convert(request(adobe, "a.epub", "epub"), () => {})).rejects.toBeInstanceOf(
      ConvertError,
    );
    const fonts = await makeEpub({
      extra: {
        "META-INF/encryption.xml":
          '<encryption><EncryptedData><EncryptionMethod Algorithm="http://www.idpf.org/2008/embedding"/></EncryptedData></encryption>',
      },
    });
    await expect(convert(request(fonts, "a.epub", "epub"), () => {})).resolves.toBeTruthy();
  });

  it("reports files that are not EPUBs", async () => {
    const notZip = new Blob(["hola"]);
    await expect(convert(request(notZip, "a.epub", "epub"), () => {})).rejects.toEqual(
      new ConvertError("invalid"),
    );
    const zip = new JSZip();
    zip.file("mimetype", "application/epub+zip");
    const empty = await zip.generateAsync({ type: "blob" });
    await expect(convert(request(empty, "a.epub", "epub"), () => {})).rejects.toEqual(
      new ConvertError("invalid"),
    );
  });
});

describe("text and Markdown", () => {
  it("offers only outputs that can hold emphasis", () => {
    expect(OUTPUTS.txt).not.toContain("txt" as never);
    expect(detectFormat("libro.MARKDOWN")).toBe("md");
    expect(detectFormat("x.htm")).toBe("html");
    expect(detectFormat("x.pdf")).toBeNull();
  });

  it("turns plain text into an EPUB with chapters and a table of contents", async () => {
    const text = "Hola mundo.\n\nSegundo párrafo\ncon salto & más.";
    const { blob, name } = await convert(request(new Blob([text]), "notas.txt", "epub"), () => {});
    expect(name).toBe("notas.fita.epub");
    const zip = await unzip(blob);
    const chapter = await zip.file("OEBPS/chapter-0001.xhtml")?.async("string");
    expect(chapter).toContain(`<p><span class="fita-e">Ho</span>la`);
    expect(chapter).toContain("<br/>");
    expect(chapter).toContain("&amp;");
    expect(await zip.file("OEBPS/nav.xhtml")?.async("string")).toContain("Parte 1");
    const opf = await zip.file("OEBPS/content.opf")?.async("string");
    expect(opf).toMatch(/dcterms:modified">\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ</);
  });

  it("turns text into a standalone HTML page", async () => {
    const { blob } = await convert(request(new Blob(["Hola <tú>"]), "a.txt", "html"), () => {});
    const html = await blob.text();
    expect(html).toContain("<style>.fita-e { font-weight: bold; }");
    expect(html).toContain(
      `<span class="fita-e">Ho</span>la &lt;<span class="fita-e">t</span>ú&gt;`,
    );
  });

  it("converts HTML in place, honouring its language", async () => {
    const page = '<html lang="ca"><head><title>t</title></head><body><p>l\'àvia</p></body></html>';
    const { blob } = await convert(request(new Blob([page]), "p.html", "html"), () => {});
    const html = await blob.text();
    expect(html).toContain(`l'<span class="fita-e">àv</span>ia`);
    expect(html).toMatch(/<style type="text\/css">[\s\S]*<\/style><\/head>/);
    const bare = await convert(request(new Blob(["<p>hola</p>"]), "p.html", "html"), () => {});
    expect(await bare.blob.text()).toMatch(/^<style>/);
  });

  it("converts Markdown to Markdown without touching code, links or front matter", () => {
    const md = [
      "---",
      "title: Hola mundo",
      "---",
      "# Título del libro",
      "",
      "Texto con `código en línea`, un [enlace](https://ejemplo.com/ruta) y **negrita**.",
      "",
      "```js",
      "const palabra = 1;",
      "```",
      "",
      "    código indentado",
      "",
      "![imagen bonita](a.png) <span>html</span> \\*escapado\\*",
      "[ref]: https://ejemplo.com",
      "",
    ].join("\n");
    const out = emphasizeMarkdown(md, { strength: 0.4, minWordLength: 1 });
    expect(out).toContain("title: Hola mundo");
    expect(out).toContain("# <b>Tí</b>tulo <b>d</b>el <b>li</b>bro");
    expect(out).toContain("`código en línea`");
    expect(out).toContain("[<b>en</b>lace](https://ejemplo.com/ruta)");
    expect(out).toContain("**<b>neg</b>rita**");
    expect(out).toContain("const palabra = 1;");
    expect(out).toContain("    código indentado");
    expect(out).toContain("![imagen bonita](a.png) <span>");
    expect(out).toContain("[ref]: https://ejemplo.com");
  });

  it("converts Markdown to EPUB with chapters at headings", async () => {
    const md = "# Uno\n\nTexto uno.\n\n# Dos\n\nTexto dos.<br>\n\n---\n";
    const { blob } = await convert(request(new Blob([md]), "libro.md", "epub"), () => {});
    const zip = await unzip(blob);
    const nav = await zip.file("OEBPS/nav.xhtml")?.async("string");
    expect(nav).toContain(">Uno</a>");
    expect(nav).toContain(">Dos</a>");
    const second = await zip.file("OEBPS/chapter-0002.xhtml")?.async("string");
    expect(second).toContain("<br/>");
    expect(second).toContain("<hr/>");
  });

  it("converts Markdown to Markdown through convert()", async () => {
    const { blob, name } = await convert(request(new Blob(["Hola"]), "a.md", "md"), () => {});
    expect(name).toBe("a.fita.md");
    expect(await blob.text()).toBe("<b>Ho</b>la");
  });

  it("splits long text by size and escapes it", () => {
    const body = textToXhtml(Array.from({ length: 30 }, (_, i) => `Párrafo ${i} <x>`).join("\n\n"));
    const chapters = splitChapters(body, (n) => `Parte ${n}`, 100);
    expect(chapters.length).toBeGreaterThan(5);
    expect(chapters[0]?.title).toBe("Parte 1");
    expect(splitChapters("", (n) => `P${n}`)).toEqual([{ title: "P1", body: "" }]);
  });
});
