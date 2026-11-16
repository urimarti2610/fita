import JSZip from "jszip";

export const CHAPTER = (body: string, lang = "ca") => `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${lang}" lang="${lang}">
<head><title>Capítol</title></head>
<body>${body}</body>
</html>`;

/** Builds a small EPUB 3 in memory. */
export async function makeEpub(
  options: { chapters?: string[]; extra?: Record<string, string | Uint8Array> } = {},
): Promise<Blob> {
  const chapters = options.chapters ?? [
    CHAPTER("<h1>Primer capítol</h1><p>L'àvia llegia cada vespre.</p><pre>codi</pre>"),
    CHAPTER("<p>Segona part del llibre.</p>"),
  ];
  const zip = new JSZip();
  zip.file("mimetype", "application/epub+zip", { compression: "STORE" });
  zip.file(
    "META-INF/container.xml",
    '<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OPS/book.opf" media-type="application/oebps-package+xml"/></rootfiles></container>',
  );
  const items = chapters
    .map(
      (_, i) =>
        `<item id="c${i}" href="Text/cap%C3%ADtol-${i}.xhtml" media-type="application/xhtml+xml"/>`,
    )
    .join("");
  const spine = chapters.map((_, i) => `<itemref idref="c${i}"/>`).join("");
  zip.file(
    "OPS/book.opf",
    `<?xml version="1.0"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="id">x</dc:identifier><dc:title>Llibre</dc:title><dc:language>ca</dc:language></metadata><manifest>${items}<item id="img" href="img/a.png" media-type="image/png"/></manifest><spine>${spine}</spine></package>`,
  );
  chapters.forEach((c, i) => {
    zip.file(`OPS/Text/capítol-${i}.xhtml`, c);
  });
  zip.file("OPS/img/a.png", new Uint8Array([137, 80, 78, 71, 1, 2, 3]));
  for (const [path, data] of Object.entries(options.extra ?? {})) zip.file(path, data);
  return zip.generateAsync({ type: "blob", compression: "DEFLATE" });
}

export const W = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"';
export const wordDocument = (body: string) =>
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:document ${W}><w:body>${body}<w:sectPr/></w:body></w:document>`;

/** Builds a minimal .docx in memory. */
export async function makeDocx(body: string, extra: Record<string, string | Uint8Array> = {}) {
  const zip = new JSZip();
  zip.file(
    "[Content_Types].xml",
    '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>',
  );
  zip.file(
    "_rels/.rels",
    '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>',
  );
  zip.file("word/document.xml", wordDocument(body));
  zip.file(
    "word/styles.xml",
    `<w:styles ${W}><w:docDefaults><w:rPrDefault><w:rPr><w:lang w:val="ca-ES"/></w:rPr></w:rPrDefault></w:docDefaults></w:styles>`,
  );
  for (const [path, data] of Object.entries(extra)) zip.file(path, data);
  return zip.generateAsync({ type: "blob" });
}

export const wordRun = (text: string, rPr = "") =>
  `<w:r>${rPr ? `<w:rPr>${rPr}</w:rPr>` : ""}<w:t xml:space="preserve">${text}</w:t></w:r>`;
