import JSZip from "jszip";
import { describe, expect, it } from "vitest";
import { type ConvertRequest, convert, detectFormat, OUTPUTS } from "../src/convert/convert.js";
import { ConvertError } from "../src/convert/epub.js";
import { readPdf } from "../src/convert/pdf.js";
import { blocksToXhtml, type PdfItem, Reflow } from "../src/convert/reflow.js";
import { makePdf, page } from "./pdf-fixture.js";

const item = (str: string, x: number, y: number, size = 12, hasEOL = true): PdfItem => ({
  str,
  x,
  y,
  width: str.length * size * 0.5,
  size,
  hasEOL,
});

describe("reflow", () => {
  it("joins lines into paragraphs and undoes hyphenation", () => {
    const reflow = new Reflow();
    reflow.addPage([
      item("Primer títol", 72, 780, 20),
      item("La lectura és un viatge que", 72, 740),
      item("comença amb una paraula i acaba amb un ", 72, 726, 12, false),
      item("lli-", 290, 726),
      item("bre.", 72, 712),
      // A bigger gap: a new paragraph.
      item("Segon paràgraf aquí, prou llarg per omplir", 72, 680),
      item("la línia.", 72, 666),
      // An indent: a new paragraph.
      item("Tercer paràgraf.", 90, 652),
      item("12", 290, 40),
    ]);
    expect(reflow.finish()).toEqual([
      { heading: true, text: "Primer títol" },
      {
        heading: false,
        text: "La lectura és un viatge que comença amb una paraula i acaba amb un llibre.",
      },
      { heading: false, text: "Segon paràgraf aquí, prou llarg per omplir la línia." },
      { heading: false, text: "Tercer paràgraf." },
    ]);
  });

  it("continues a paragraph across pages and drops running headers", () => {
    const reflow = new Reflow();
    const header = (n: number) => item(`El meu llibre — ${n}`, 72, 800, 10);
    reflow.addPage([
      header(1),
      item("Una frase que continua", 72, 740),
      item("a la pàgina", 72, 726),
    ]);
    reflow.addPage([header(2), item("següent i acaba.", 72, 740), item("Nou paràgraf.", 90, 726)]);
    expect(reflow.finish()).toEqual([
      { heading: false, text: "El meu llibre — 1" },
      { heading: false, text: "Una frase que continua a la pàgina següent i acaba." },
      { heading: false, text: "Nou paràgraf." },
    ]);
  });

  it("escapes text for XHTML", () => {
    expect(
      blocksToXhtml([
        { heading: true, text: "A & B" },
        { heading: false, text: "<x>" },
      ]),
    ).toBe("<h2>A &amp; B</h2>\n<p>&lt;x&gt;</p>");
  });
});

const request = (file: Blob, output: ConvertRequest["output"]): ConvertRequest => ({
  file,
  name: "Informe.pdf",
  input: "pdf",
  output,
  strength: 0.5,
  every: 1,
  style: "bold",
  lang: "es",
  labels: { part: "Part", contents: "Índex" },
});

const BOOK = makePdf(
  [
    page([
      { text: "La història", y: 770, size: 22 },
      { text: "L'àvia llegia cada vespre una història", y: 730 },
      "diferent, i la casa s'omplia de veus.",
    ]),
    page(["Segona pàgina del llibre."]),
  ],
  { title: "Contes de l'àvia", lang: "ca" },
);

describe("PDF files", () => {
  it("offers EPUB and HTML", () => {
    expect(detectFormat("Llibre.PDF")).toBe("pdf");
    expect(OUTPUTS.pdf).toEqual(["epub", "html"]);
  });

  it("reads text, title and language", async () => {
    const progress: number[] = [];
    const text = await readPdf(BOOK, (v) => progress.push(v));
    expect(text.title).toBe("Contes de l'àvia");
    expect(text.blocks).toEqual([
      { heading: true, text: "La història" },
      {
        heading: false,
        text: "L'àvia llegia cada vespre una història diferent, i la casa s'omplia de veus.",
      },
      { heading: false, text: "Segona pàgina del llibre." },
    ]);
    expect(progress).toEqual([0.5, 1]);
  });

  it("stops early for a preview", async () => {
    const text = await readPdf(BOOK, () => {}, { chars: 10 });
    expect(text.blocks.map((b) => b.text)).not.toContain("Segona pàgina del llibre.");
  });

  it("becomes an EPUB with emphasis", async () => {
    const { blob, name } = await convert(request(BOOK, "epub"), () => {});
    expect(name).toBe("Informe.fita.epub");
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    const opf = (await zip.file("OEBPS/content.opf")?.async("string")) ?? "";
    expect(opf).toContain("<dc:title>Contes de l'àvia</dc:title>");
    const chapter = (await zip.file("OEBPS/chapter-0001.xhtml")?.async("string")) ?? "";
    expect(chapter).toContain(
      '<h2><span class="fita-e">L</span>a <span class="fita-e">hist</span>òria</h2>',
    );
    expect(chapter).toContain(`L'<span class="fita-e">àv</span>ia`);
  });

  it("becomes an HTML page", async () => {
    const { blob, name } = await convert(request(BOOK, "html"), () => {});
    expect(name).toBe("Informe.fita.html");
    expect(await blob.text()).toContain('<span class="fita-e">Seg</span>ona');
  });

  it("explains scanned and broken PDFs", async () => {
    const empty = makePdf([[]]);
    await expect(convert(request(empty, "epub"), () => {})).rejects.toEqual(
      new ConvertError("noText"),
    );
    await expect(
      convert(request(new Blob(["%PDF-1.7 nothing here"]), "epub"), () => {}),
    ).rejects.toEqual(new ConvertError("invalid"));
  });

  it("converts a long document page by page", async () => {
    const pages = Array.from({ length: 300 }, (_, n) =>
      page(
        Array.from({ length: 45 }, (_, i) =>
          i % 9 === 8 ? `Fi del paràgraf ${n}.${i}.` : "una línia de text que continua sense parar",
        ),
      ),
    );
    const { blob } = await convert(request(makePdf(pages), "epub"), () => {});
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    expect(Object.keys(zip.files).filter((f) => f.endsWith(".xhtml")).length).toBeGreaterThan(1);
  }, 60_000);
});
