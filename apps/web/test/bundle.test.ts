import JSZip from "jszip";
import { describe, expect, it } from "vitest";
import {
  folderBundle,
  normalizePath,
  pickMarkdown,
  resolveReference,
  zipBundle,
} from "../src/convert/bundle.js";
import { type ConvertRequest, convert, detectFormat, OUTPUTS } from "../src/convert/convert.js";
import { ConvertError } from "../src/convert/epub.js";

const PNG = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 1, 2, 3]);
const JPG = new Uint8Array([255, 216, 255, 224, 4, 5, 6]);

const MARKDOWN = `# Viaje

Una foto del mar: ![El mar](img/mar.png "Mar")

Otra vez la misma: ![](./img/mar.png)

![Faro](../fuera.png) ![Remota](https://example.com/a.png) ![Falta](img/no.png)

![Con espacio](img/la%20playa.JPG) <img src="img/Mapa.PNG" alt="Mapa">

## Segunda parte

Texto final.
`;

const request = (
  file: Blob,
  name: string,
  output: ConvertRequest["output"],
  extra: Partial<ConvertRequest> = {},
): ConvertRequest => ({
  file,
  name,
  input: detectFormat(name) ?? "folder",
  output,
  strength: 0.4,
  every: 1,
  style: "bold",
  lang: "es",
  labels: { part: "Parte", contents: "Índice" },
  ...extra,
});

async function makeZip(files: Record<string, string | Uint8Array>) {
  const zip = new JSZip();
  for (const [path, data] of Object.entries(files)) zip.file(path, data);
  return zip.generateAsync({ type: "blob" });
}

const FILES = {
  "libro.md": MARKDOWN,
  "img/mar.png": PNG,
  "img/la playa.jpg": JPG,
  "img/mapa.png": PNG,
};

describe("paths", () => {
  it("normalizes and refuses to leave the root", () => {
    expect(normalizePath("a/./b//c")).toBe("a/b/c");
    expect(normalizePath("a\\b\\..\\c")).toBe("a/c");
    expect(normalizePath("../etc/passwd")).toBeNull();
    expect(normalizePath("a/../../b")).toBeNull();
  });

  it("resolves references relative to the document", () => {
    expect(resolveReference("doc/book.md", "img/a.png")).toBe("doc/img/a.png");
    expect(resolveReference("doc/book.md", "../a.png#x")).toBe("a.png");
    expect(resolveReference("doc/book.md", "../../a.png")).toBeNull();
    expect(resolveReference("doc/book.md", "/root.png")).toBe("root.png");
    expect(resolveReference("book.md", "a%20b.png?v=2")).toBe("a b.png");
    expect(resolveReference("book.md", "100%.png")).toBe("100%.png");
    for (const remote of ["https://x.org/a.png", "//x.org/a.png", "data:image/png;base64,AA", ""]) {
      expect(resolveReference("book.md", remote)).toBeNull();
    }
  });

  it("picks the shallowest Markdown file, preferring index and readme", () => {
    expect(pickMarkdown(["a/b/c.md", "z.markdown", "img/a.png"])).toBe("z.markdown");
    expect(pickMarkdown(["b.md", "README.md", "a.md"])).toBe("README.md");
    expect(pickMarkdown(["cap10.md", "cap2.md"])).toBe("cap2.md");
    expect(pickMarkdown(["__MACOSX/._a.md", ".git/x.md", "img/a.png"])).toBeNull();
  });
});

describe("Markdown with images", () => {
  it("offers EPUB and HTML for folders and zips", () => {
    expect(detectFormat("notes.ZIP")).toBe("zip");
    expect(OUTPUTS.zip).toEqual(["epub", "html"]);
    expect(OUTPUTS.folder).toEqual(["epub", "html"]);
  });

  it("bundles each referenced image once into a valid EPUB manifest", async () => {
    const zip = await makeZip(FILES);
    const { blob, name } = await convert(request(zip, "viaje.zip", "epub"), () => {});
    expect(name).toBe("viaje.fita.epub");
    const book = await JSZip.loadAsync(await blob.arrayBuffer());
    const opf = (await book.file("OEBPS/content.opf")?.async("string")) ?? "";
    const chapters = await Promise.all(
      Object.keys(book.files)
        .filter((f) => /chapter-\d+\.xhtml$/.test(f))
        .map((f) => book.file(f)?.async("string") ?? ""),
    );
    const text = chapters.join("\n");

    // mar.png twice, la playa.JPG (case mismatch), Mapa.PNG (raw HTML): three images.
    const images = Object.keys(book.files).filter((f) => f.startsWith("OEBPS/images/"));
    expect(images).toEqual([
      "OEBPS/images/image-0001.png",
      "OEBPS/images/image-0002.jpg",
      "OEBPS/images/image-0003.png",
    ]);
    expect(await book.file("OEBPS/images/image-0001.png")?.async("uint8array")).toEqual(PNG);
    expect(await book.file("OEBPS/images/image-0002.jpg")?.async("uint8array")).toEqual(JPG);
    expect(opf).toContain('<item id="r1" href="images/image-0001.png" media-type="image/png"/>');
    expect(opf).toContain('<item id="r2" href="images/image-0002.jpg" media-type="image/jpeg"/>');
    // Every image the chapters use is in the manifest, and nothing else.
    const used = [...text.matchAll(/<img[^>]*src="([^"]+)"/g)].map((m) => m[1]);
    expect(new Set(used)).toEqual(
      new Set(["images/image-0001.png", "images/image-0002.jpg", "images/image-0003.png"]),
    );
    expect(text.match(/image-0001\.png/g)).toHaveLength(2);
    // Outside the folder, remote or missing: kept as their description.
    expect(text).not.toMatch(/fuera|example\.com|no\.png/);
    expect(text).toContain('<span class="fita-e">Fa</span>ro');
    expect(text).toContain("Re</span>mota");
    expect(text).toContain("Fa</span>lta");
    // Text still gets the emphasis.
    expect(text).toContain('<span class="fita-e">Vi</span>aje');
  });

  it("works with a picked folder too", async () => {
    const assets = Object.entries(FILES).map(([path, data]) => ({
      path,
      file: new Blob([data]),
    }));
    const { blob, name } = await convert(
      request(new Blob(), "viaje", "epub", { input: "folder", assets }),
      () => {},
    );
    expect(name).toBe("viaje.fita.epub");
    const book = await JSZip.loadAsync(await blob.arrayBuffer());
    expect(await book.file("OEBPS/images/image-0001.png")?.async("uint8array")).toEqual(PNG);
  });

  it("embeds images in HTML exports and leaves the rest as written", async () => {
    const zip = await makeZip(FILES);
    const { blob, name } = await convert(request(zip, "viaje.zip", "html"), () => {});
    expect(name).toBe("viaje.fita.html");
    const html = await blob.text();
    const png = `data:image/png;base64,${btoa(String.fromCharCode(...PNG))}`;
    expect(html.split(png)).toHaveLength(4); // mar.png twice and Mapa.PNG
    expect(html).toContain(`data:image/jpeg;base64,${btoa(String.fromCharCode(...JPG))}`);
    expect(html).toContain('src="https://example.com/a.png"');
    expect(html).toContain('src="../fuera.png"');
    expect(html).toContain('src="img/no.png"');
  });

  it("never reaches outside the archive, even with a crafted entry name", async () => {
    // JSZip cleans names on write, so the "../" is patched into the raw bytes.
    const clean = await makeZip({ "doc.md": "![x](../evil.png)", "xxxevil.png": PNG });
    const bytes = new Uint8Array(await clean.arrayBuffer());
    const from = new TextEncoder().encode("xxxevil.png");
    for (let i = 0; i < bytes.length - from.length; i++) {
      if (from.every((b, j) => bytes[i + j] === b)) bytes.set(new TextEncoder().encode("../"), i);
    }
    const bundle = await zipBundle(new Blob([bytes]));
    // The entry lands inside the root, and the reference that climbs out is not followed.
    expect([...bundle.files.keys()].every((p) => !p.includes(".."))).toBe(true);
    const { blob } = await convert(request(new Blob([bytes]), "a.zip", "epub"), () => {});
    const book = await JSZip.loadAsync(await blob.arrayBuffer());
    expect(Object.keys(book.files).some((f) => f.includes("images/"))).toBe(false);
  });

  it("explains when there is no Markdown document", async () => {
    const zip = await makeZip({ "img/a.png": PNG });
    await expect(convert(request(zip, "a.zip", "epub"), () => {})).rejects.toEqual(
      new ConvertError("noMarkdown"),
    );
    await expect(folderBundle([{ path: "a.png", file: new Blob([PNG]) }])).rejects.toEqual(
      new ConvertError("noMarkdown"),
    );
    await expect(
      convert(request(new Blob(["not a zip"]), "a.zip", "epub"), () => {}),
    ).rejects.toEqual(new ConvertError("invalid"));
  });
});
