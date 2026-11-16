/** A line of text placed on a PDF page, in points from the bottom left. */
/** `cjk` lines use a non-embedded Chinese font whose encoding needs one of pdf.js's CMaps. */
export type PdfLine = { text: string; x?: number; y: number; size?: number; cjk?: boolean };

/** UTF-16BE hex string, for the UniGB-UCS2-H encoding. */
const hex = (text: string) =>
  `<${[...text].map((c) => (c.codePointAt(0) ?? 0).toString(16).padStart(4, "0")).join("")}>`;

/** Escapes a string for a PDF literal; non-ASCII Latin-1 as octal (WinAnsiEncoding). */
function literal(text: string): string {
  let out = "";
  for (const char of text) {
    const code = char.codePointAt(0) ?? 63;
    if (char === "(" || char === ")" || char === "\\") out += `\\${char}`;
    else if (code >= 32 && code < 127) out += char;
    else out += `\\${(code < 256 ? code : 63).toString(8).padStart(3, "0")}`;
  }
  return `(${out})`;
}

/**
 * Builds a small, valid PDF with Helvetica text, one entry per page.
 * Options: a document title and language.
 */
export function makePdf(pages: PdfLine[][], options: { title?: string; lang?: string } = {}) {
  const objects: string[] = [];
  const add = (body: string) => objects.push(body); // the new length is the 1-based object number
  const catalog = add("");
  const pagesId = add("");
  const font = add(
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
  );
  const cidFont = add(
    "<< /Type /Font /Subtype /CIDFontType0 /BaseFont /STSong-Light /CIDSystemInfo << /Registry (Adobe) /Ordering (GB1) /Supplement 4 >> /DW 1000 >>",
  );
  const cjkFont = add(
    `<< /Type /Font /Subtype /Type0 /BaseFont /STSong-Light /Encoding /UniGB-UCS2-H /DescendantFonts [${cidFont} 0 R] >>`,
  );
  const kids: number[] = [];
  for (const lines of pages) {
    const stream = lines
      .map(
        (l) =>
          `BT /${l.cjk ? "F2" : "F1"} ${l.size ?? 12} Tf ${l.x ?? 72} ${l.y} Td ${l.cjk ? hex(l.text) : literal(l.text)} Tj ET`,
      )
      .join("\n");
    const content = add(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    kids.push(
      add(
        `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${font} 0 R /F2 ${cjkFont} 0 R >> >> /Contents ${content} 0 R >>`,
      ),
    );
  }
  objects[catalog - 1] =
    `<< /Type /Catalog /Pages ${pagesId} 0 R${options.lang ? ` /Lang ${literal(options.lang)}` : ""} >>`;
  objects[pagesId - 1] =
    `<< /Type /Pages /Kids [${kids.map((k) => `${k} 0 R`).join(" ")}] /Count ${kids.length} >>`;
  const info = add(`<< /Title ${literal(options.title ?? "")} /Producer (fita tests) >>`);

  let pdf = "%PDF-1.7\n%\xE2\xE3\xCF\xD3\n";
  const offsets: number[] = [];
  objects.forEach((body, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalog} 0 R /Info ${info} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  // Every character is a single byte (Latin-1), so string offsets are byte offsets.
  return new Blob([Uint8Array.from(pdf, (c) => c.charCodeAt(0))], { type: "application/pdf" });
}

/** Lines of a page: `y` from the top margin down, one line every `leading` points. */
export function page(
  texts: (string | PdfLine)[],
  options: { top?: number; leading?: number } = {},
) {
  const top = options.top ?? 770;
  const leading = options.leading ?? 15;
  let y = top;
  return texts.map((t) => {
    const line = typeof t === "string" ? { text: t, y } : { ...t, y: t.y || y };
    y = line.y - leading;
    return line;
  });
}
