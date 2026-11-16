import { createEmphasizer } from "@fita/core";
import JSZip from "jszip";
import { describe, expect, it } from "vitest";
import { type ConvertRequest, convert, detectFormat, OUTPUTS } from "../src/convert/convert.js";
import { docxParagraphs, docxStyle, emphasizeWordXml } from "../src/convert/docx.js";
import { ConvertError } from "../src/convert/epub.js";
import { wordDocument as doc, makeDocx, wordRun as run, W } from "./fixtures.js";

const emphasize = (xml: string, style: Parameters<typeof docxStyle>[0] = "bold") =>
  emphasizeWordXml(xml, createEmphasizer({ strength: 0.5, locale: "ca" }), docxStyle(style));

/** Visible text of the runs, with emphasized (bold) parts in [brackets]. */
function visible(xml: string): string {
  let out = "";
  for (const r of xml.matchAll(/<w:r>([\s\S]*?)<\/w:r>/g)) {
    const body = r[1] as string;
    const text = [...body.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((t) => t[1]).join("");
    out += /<w:b\/>/.test(body) ? `[${text}]` : text;
  }
  return out;
}

/** Throws unless every start tag has its end tag, in order (well-formed nesting). */
function assertBalanced(xml: string) {
  const stack: string[] = [];
  for (const m of xml.matchAll(/<(\/?)([\w:.-]+)[^>]*?(\/?)>/g)) {
    if (m[3]) continue;
    if (m[1]) expect(stack.pop()).toBe(m[2]);
    else stack.push(m[2] as string);
  }
  expect(stack).toEqual([]);
}

describe("DOCX runs", () => {
  it("emphasizes word starts and keeps the run's formatting", () => {
    const xml = emphasize(`<w:p>${run("Hola món", '<w:i/><w:sz w:val="28"/>')}</w:p>`);
    expect(visible(xml)).toBe("[Ho]la [m]ón");
    // Original properties stay, bold goes where the schema wants it (before i and sz).
    expect(xml).toContain('<w:rPr><w:b/><w:bCs/><w:i/><w:sz w:val="28"/></w:rPr>');
    expect(xml).toContain(
      '<w:rPr><w:i/><w:sz w:val="28"/></w:rPr><w:t xml:space="preserve">la </w:t>',
    );
  });

  it("treats a word split across runs as one word", () => {
    // Word often splits "paraula" into runs (spell checking, revisions).
    const xml = emphasize(`<w:p>${run("par")}${run("aula", '<w:u w:val="single"/>')}</w:p>`);
    expect(visible(xml)).toBe("[par][a]ula");
    const xml2 = emphasize(`<w:p>${run("p")}${run("araula")}</w:p>`);
    expect(visible(xml2)).toBe("[p][ara]ula");
  });

  it("follows hyperlinks, insertions and text boxes, but not deleted text or fields", () => {
    const xml = emphasize(
      `<w:p><w:hyperlink r:id="rId5">${run("enllaç")}</w:hyperlink><w:ins>${run(" nou")}</w:ins><w:del><w:r><w:delText>vell</w:delText></w:r></w:del><w:r><w:instrText>PAGE</w:instrText></w:r><w:r><w:drawing><w:txbxContent><w:p>${run("caixa")}</w:p></w:txbxContent></w:drawing></w:r></w:p>`,
    );
    assertBalanced(xml);
    expect(xml).toContain("<w:delText>vell</w:delText>");
    expect(xml).toContain("<w:instrText>PAGE</w:instrText>");
    expect(xml).toMatch(/<w:b\/><w:bCs\/><\/w:rPr><w:t xml:space="preserve">enl<\/w:t>/);
    expect(xml).toMatch(/<w:t xml:space="preserve">n<\/w:t>/);
    expect(xml).toMatch(
      /<w:txbxContent><w:p><w:r><w:rPr><w:b\/><w:bCs\/><\/w:rPr><w:t xml:space="preserve">cai<\/w:t>/,
    );
  });

  it("keeps tabs, breaks, entities and non-text markup intact", () => {
    const xml = emphasize(
      `<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:t>A&amp;B</w:t><w:tab/><w:t>gràcies</w:t><w:br/></w:r><w:bookmarkStart w:id="0" w:name="x"/></w:p>`,
    );
    expect(xml).toContain('<w:pPr><w:jc w:val="center"/></w:pPr>');
    expect(xml).toContain('<w:bookmarkStart w:id="0" w:name="x"/>');
    expect(xml).toContain(">&amp;<");
    expect(xml).toContain("<w:tab/>");
    expect(xml).toContain("<w:br/>");
    expect(visible(xml).replace(/\s/g, "")).toBe("[A]&amp;[Bgràc]ies");
  });

  it("leaves numbers, empty paragraphs and markup outside paragraphs alone", () => {
    const input = doc(
      `<w:p/><w:p>${run("2024")}</w:p><w:tbl><w:tr><w:tc><w:p>${run("cel·la")}</w:p></w:tc></w:tr></w:tbl>`,
    );
    const xml = emphasize(input);
    expect(xml).toContain("<w:p/>");
    expect(xml).toContain(run("2024"));
    expect(xml).toContain("<w:tbl><w:tr><w:tc><w:p>");
    expect(visible(xml)).toBe("2024[cel]·la");
  });

  it("renders every style with run properties", () => {
    const p = `<w:p>${run("Lectura", '<w:color w:val="FF0000"/>')}</w:p>`;
    expect(emphasize(p, "color")).toContain('<w:color w:val="1F5FA8"/>');
    expect(emphasize(p, "underline")).toContain('<w:u w:val="single"/>');
    // Fading keeps a colour the author chose; on plain text it greys the rest.
    expect(emphasize(p, "fade")).toBe(p);
    expect(emphasize(`<w:p>${run("Lectura")}</w:p>`, "bold-fade")).toContain(
      '<w:rPr><w:color w:val="666666"/></w:rPr><w:t xml:space="preserve">ura</w:t>',
    );
    // The original text is unchanged, character for character.
    const text = (x: string) => [...x.matchAll(/<w:t[^>]*>([^<]*)</g)].map((m) => m[1]).join("");
    for (const style of ["bold", "bold-fade", "color", "underline", "fade"] as const) {
      expect(text(emphasize(p, style))).toBe("Lectura");
    }
  });

  it("reads the first paragraphs for the preview", () => {
    const xml = doc(
      `<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr>${run("Títol")}</w:p><w:p>${run("Un ")}${run("text.")}</w:p>`,
    );
    expect(docxParagraphs(xml, 1000)).toEqual([
      { heading: true, text: "Títol" },
      { heading: false, text: "Un text." },
    ]);
  });
});

const request = (file: Blob, name: string): ConvertRequest => ({
  file,
  name,
  input: detectFormat(name) ?? "docx",
  output: "docx",
  strength: 0.5,
  every: 1,
  style: "bold",
  lang: "es",
  labels: { part: "Part", contents: "Índex" },
});

describe("DOCX files", () => {
  it("converts every text part and copies the rest byte for byte", async () => {
    const image = new Uint8Array([137, 80, 78, 71, 9, 9]);
    const file = await makeDocx(`<w:p>${run("Bon dia")}</w:p>`, {
      "word/footnotes.xml": `<w:footnotes ${W}><w:footnote><w:p>${run("Nota")}</w:p></w:footnote></w:footnotes>`,
      "word/header1.xml": `<w:hdr ${W}><w:p>${run("Capçalera")}</w:p></w:hdr>`,
      "word/media/image1.png": image,
    });
    expect(detectFormat("Informe.DOCX")).toBe("docx");
    expect(OUTPUTS.docx).toEqual(["docx"]);
    const progress: number[] = [];
    const { blob, name } = await convert(request(file, "Informe.docx"), (v) => progress.push(v));
    expect(name).toBe("Informe.fita.docx");
    expect(blob.type).toBe(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    expect(visible((await zip.file("word/document.xml")?.async("string")) ?? "")).toBe(
      "[B]on [d]ia",
    );
    expect(visible((await zip.file("word/footnotes.xml")?.async("string")) ?? "")).toBe("[No]ta");
    expect(visible((await zip.file("word/header1.xml")?.async("string")) ?? "")).toBe(
      "[Capça]lera",
    );
    expect(await zip.file("word/media/image1.png")?.async("uint8array")).toEqual(image);
    expect(await zip.file("word/styles.xml")?.async("string")).toContain("ca-ES");
    expect(progress.at(-1)).toBe(1);
  });

  it("explains protected and broken files", async () => {
    const ole = new Blob([new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1, 0])]);
    await expect(convert(request(ole, "secret.docx"), () => {})).rejects.toEqual(
      new ConvertError("locked"),
    );
    await expect(convert(request(new Blob(["nope"]), "a.docx"), () => {})).rejects.toEqual(
      new ConvertError("invalid"),
    );
    const zip = new JSZip();
    zip.file("hello.txt", "hi");
    const notWord = await zip.generateAsync({ type: "blob" });
    await expect(convert(request(notWord, "a.docx"), () => {})).rejects.toEqual(
      new ConvertError("invalid"),
    );
  });

  it("handles a large document paragraph by paragraph", async () => {
    const paragraph = `<w:p>${run("L'àvia llegia cada vespre una història diferent. ")}</w:p>`;
    const file = await makeDocx(paragraph.repeat(50_000));
    const started = performance.now();
    const { blob } = await convert(request(file, "gran.docx"), () => {});
    expect(performance.now() - started).toBeLessThan(30_000);
    const zip = await JSZip.loadAsync(await blob.arrayBuffer());
    const xml = (await zip.file("word/document.xml")?.async("string")) ?? "";
    expect(xml.match(/<w:p>/g)).toHaveLength(50_000);
  }, 60_000);
});
