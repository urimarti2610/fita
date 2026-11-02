/**
 * Worksheet texts in Markdown: the format of src/worksheet/texts/<lang>/README.md,
 * also used to export and import "my texts" on the website.
 *
 *   ## Title
 *   - Level: Ages 6–7      (optional; any "Key: value" list item)
 *
 *   Paragraph one.
 *
 *   Paragraph two.
 */
export type WorksheetText = { title: string; level?: string; text: string };

export function parseTexts(markdown: string): WorksheetText[] {
  const texts: WorksheetText[] = [];
  const sections = markdown
    .replace(/\r\n?/g, "\n")
    .split(/^##[ \t]+/m)
    .slice(1);
  for (const section of sections) {
    const newline = section.indexOf("\n");
    const title = (newline === -1 ? section : section.slice(0, newline)).trim();
    let body = newline === -1 ? "" : section.slice(newline + 1);
    const meta = body.match(/^\s*[-*][ \t]+[^:\n]+:[ \t]*(.+)\n/);
    const level = meta?.[1]?.trim();
    if (meta) body = body.slice(meta[0].length);
    // A level-1 heading would start a new document: stop there.
    const text = body.split(/^#[ \t]/m)[0]?.trim() ?? "";
    if (!title || !text) continue;
    texts.push(level ? { title, level, text } : { title, text });
  }
  return texts;
}

/** Plain text files hold one text: the first line is the title when it is short. */
export function parsePlainText(content: string, fallbackTitle: string): WorksheetText[] {
  const text = content.replace(/\r\n?/g, "\n").trim();
  if (!text) return [];
  const [first = "", ...rest] = text.split("\n");
  const titled = first.length <= 80 && rest.join("\n").trim() !== "";
  return [
    titled ? { title: first.trim(), text: rest.join("\n").trim() } : { title: fallbackTitle, text },
  ];
}

export function serializeTexts(heading: string, levelKey: string, texts: WorksheetText[]): string {
  const sections = texts.map((t) => {
    const level = t.level ? `- ${levelKey}: ${t.level}\n` : "";
    // A line starting with "#" inside a text would read as a heading: escape it.
    const text = t.text.trim().replace(/^#/gm, "\\#");
    return `## ${t.title.replace(/\n/g, " ").trim()}\n${level}\n${text}\n`;
  });
  return `# ${heading}\n\n${sections.join("\n")}`;
}
