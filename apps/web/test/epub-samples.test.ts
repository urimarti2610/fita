// Writes sample EPUBs for epubcheck (run in CI) when EPUB_SAMPLES_DIR is set.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { type ConvertRequest, convert } from "../src/convert/convert.js";
import { makePdf, page } from "./pdf-fixture.js";

const dir = process.env.EPUB_SAMPLES_DIR;

const base = (file: Blob, name: string, output: ConvertRequest["output"]): ConvertRequest => ({
  file,
  name,
  input: name.endsWith(".epub") ? "epub" : name.endsWith(".md") ? "md" : "txt",
  output,
  strength: 0.4,
  every: 1,
  style: "fade",
  lang: "ca",
  labels: { part: "Part", contents: "Índex" },
});

describe.runIf(dir)("epubcheck samples", () => {
  it("writes generated and converted EPUBs", async () => {
    mkdirSync(dir as string, { recursive: true });
    const md = "# Primer\n\nL'àvia & el nét.<br>\n\n- u\n- dos\n\n# Segon\n\nFi.\n";
    const fromMd = await convert(base(new Blob([md]), "llibre.md", "epub"), () => {});
    const fromTxt = await convert(
      base(new Blob(["Hola.\n\nAdéu <fi>"]), "text.txt", "epub"),
      () => {},
    );
    // Round trip: convert an already valid EPUB.
    const converted = await convert(base(fromTxt.blob, "valid.epub", "epub"), () => {});
    // Markdown with images, from a folder: real 1×1 PNG and GIF files.
    const bytes = (b64: string) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const png = bytes(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
    );
    const gif = bytes("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");
    const withImages = await convert(
      {
        ...base(new Blob(), "llibre", "epub"),
        input: "folder",
        assets: [
          {
            path: "llibre.md",
            file: new Blob([
              "# Fotos\n\n![Mar](img/mar.png) ![Punt](img/punt.gif)\n\n![Lluny](https://example.com/x.png) ![Fora](../x.png)\n\n# Segon\n\n![Mar](img/mar.png)\n",
            ]),
          },
          { path: "img/mar.png", file: new Blob([png]) },
          { path: "img/punt.gif", file: new Blob([gif]) },
        ],
      },
      () => {},
    );
    for (const [name, result] of [
      ["from-markdown-images.epub", withImages],
      [
        "from-pdf.epub",
        await convert(
          {
            ...base(
              makePdf(
                [
                  page([{ text: "Títol", y: 770, size: 20 }, "L'àvia & el nét <fi>."]),
                  page(["Segona."]),
                ],
                {
                  title: "Llibre",
                },
              ),
              "llibre.pdf",
              "epub",
            ),
            input: "pdf",
          },
          () => {},
        ),
      ],
      ["from-markdown.epub", fromMd],
      ["from-text.epub", fromTxt],
      ["converted.epub", converted],
    ] as const) {
      writeFileSync(join(dir as string, name), Buffer.from(await result.blob.arrayBuffer()));
    }
    expect(true).toBe(true);
  });
});
