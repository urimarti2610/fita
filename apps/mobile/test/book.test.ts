import { applyToElement } from "@fita/core";
import JSZip from "jszip";
import { describe, expect, it } from "vitest";
import { CHAPTER, makeEpub } from "../../web/test/fixtures.js";
import { openBook, resolvePath } from "../src/book.js";

async function text(book: Awaited<ReturnType<typeof openBook>>, i: number) {
  const { fragment } = await book.render(i, document);
  const div = document.createElement("div");
  div.append(fragment);
  return div;
}

/** Adds an EPUB 3 navigation document to a fixture book. */
async function withNav(blob: Blob) {
  const zip = await JSZip.loadAsync(await blob.arrayBuffer());
  const opf = (await zip.file("OPS/book.opf")?.async("string")) ?? "";
  zip.file(
    "OPS/book.opf",
    opf.replace(
      "<manifest>",
      '<manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>',
    ),
  );
  zip.file(
    "OPS/nav.xhtml",
    '<?xml version="1.0"?><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops"><body><nav epub:type="toc"><ol><li><a href="Text/cap%C3%ADtol-0.xhtml">Primer capítol</a></li><li><a href="Text/cap%C3%ADtol-1.xhtml#s">Segon</a></li></ol></nav></body></html>',
  );
  return zip.generateAsync({ type: "blob" });
}

describe("resolvePath", () => {
  it("resolves relative hrefs inside the zip", () => {
    expect(resolvePath("OPS/Text/a.xhtml", "../img/b.png")).toBe("OPS/img/b.png");
    expect(resolvePath("OPS/Text/a.xhtml", "c%C3%A0.xhtml#x")).toBe("OPS/Text/cà.xhtml");
    expect(resolvePath("a.xhtml", "./b.xhtml")).toBe("b.xhtml");
  });
});

describe("openBook", () => {
  it("reads an EPUB chapter by chapter, with titles from the table of contents", async () => {
    const book = await openBook(await withNav(await makeEpub()), "epub");
    expect(book.title).toBe("Llibre");
    expect(book.lang).toBe("ca");
    expect(book.chapters.map((c) => c.title)).toEqual(["Primer capítol", "Segon"]);
    const first = await text(book, 0);
    expect(first.querySelector("h1")?.textContent).toBe("Primer capítol");
    expect(first.textContent).toContain("L'àvia llegia cada vespre.");
    // The <title> in <head> is not part of the reading text.
    expect(first.textContent).not.toContain("Capítol");
    expect(book.indexOf("OPS/Text/capítol-1.xhtml")).toBe(1);
  });

  it("loads EPUB images from inside the book as object URLs", async () => {
    const epub = await makeEpub({
      chapters: [CHAPTER('<p>Imatge</p><img src="../img/a.png" alt="A"/>')],
    });
    const book = await openBook(epub, "epub");
    const { fragment, release } = await book.render(0, document);
    const img = fragment.querySelector("img");
    expect(img?.getAttribute("src")).toMatch(/^blob:/);
    release();
  });

  it("links between chapters point to the target chapter", async () => {
    const epub = await makeEpub({
      chapters: [
        CHAPTER('<p><a href="capítol-1.xhtml#n1">nota</a></p>'),
        CHAPTER('<p id="n1">x</p>'),
      ],
    });
    const book = await openBook(epub, "epub");
    const a = (await text(book, 0)).querySelector("a");
    expect(a?.getAttribute("data-path")).toBe("OPS/Text/capítol-1.xhtml");
    expect(a?.getAttribute("data-anchor")).toBe("n1");
  });

  it("refuses books with DRM", async () => {
    const epub = await makeEpub({
      extra: {
        "META-INF/encryption.xml":
          '<encryption><EncryptedData><EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#aes128-cbc"/></EncryptedData></encryption>',
      },
    });
    await expect(openBook(epub, "epub")).rejects.toMatchObject({ code: "drm" });
  });

  it("reads plain text as paragraphs", async () => {
    const book = await openBook(new Blob(["Primer paràgraf.\n\nSegon <i>no</i> és HTML."]), "txt");
    expect(book.chapters).toHaveLength(1);
    expect(book.chapters[0]?.title).toBeNull();
    const div = await text(book, 0);
    expect(div.querySelectorAll("p")).toHaveLength(2);
    expect(div.querySelector("i")).toBeNull();
    expect(div.textContent).toContain("Segon <i>no</i> és HTML.");
  });

  it("splits Markdown at headings", async () => {
    const book = await openBook(new Blob(["# Un\n\nText u.\n\n# Dos\n\nText dos."]), "md");
    expect(book.chapters.map((c) => c.title)).toEqual(["Un", "Dos"]);
    expect((await text(book, 1)).querySelector("h1")?.textContent).toBe("Dos");
  });

  it("reads HTML without its scripts, using its title and language", async () => {
    const html =
      '<!doctype html><html lang="es"><head><title>Página</title><script>alert(1)</script></head><body><p onclick="x()">Hola</p><script>alert(2)</script></body></html>';
    const book = await openBook(new Blob([html]), "html");
    expect(book.title).toBe("Página");
    expect(book.lang).toBe("es");
    const div = await text(book, 0);
    expect(div.innerHTML).toBe("<p>Hola</p>");
  });

  it("splits a very long text into chapters and keeps every character", async () => {
    const paragraph = "Una frase llarga per omplir el llibre sense límits. ".repeat(40);
    const source = Array.from({ length: 400 }, () => paragraph.trim()).join("\n\n");
    const book = await openBook(new Blob([source]), "txt");
    expect(book.chapters.length).toBeGreaterThan(1);
    let total = "";
    for (let i = 0; i < book.chapters.length; i++) {
      total += (await text(book, i)).textContent?.replace(/\s+/g, "") ?? "";
    }
    expect(total).toBe(source.replace(/\s+/g, ""));
  });

  it("emphasis leaves the text that screen readers read unchanged", async () => {
    const book = await openBook(await makeEpub(), "epub");
    const div = await text(book, 0);
    document.body.append(div);
    const before = div.textContent;
    const controller = applyToElement(div, { strength: 0.5 }, { sync: true });
    expect(div.querySelectorAll("fita-e").length).toBeGreaterThan(0);
    expect(div.textContent).toBe(before);
    controller.undo();
    expect(div.textContent).toBe(before);
    div.remove();
  });
});
