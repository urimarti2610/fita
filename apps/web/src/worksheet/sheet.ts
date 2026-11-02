import { DEFAULT_STYLE, type EmphasisStyle, escapeHTML, toHTML } from "@fita/core";

/**
 * Printable reading worksheet. One renderer for the live preview, printing and the
 * downloaded file, so all three look the same.
 */

export const THEMES = ["none", "simple", "clouds", "garden", "stars", "vehicles"] as const;
export type Theme = (typeof THEMES)[number];
/** Font sizes in points, as printed on A4. */
export const SIZES = [18, 22, 26] as const;
export const LINE_COUNTS = [0, 3, 6, 10] as const;
export const ORIENTATIONS = ["portrait", "landscape"] as const;
export type Orientation = (typeof ORIENTATIONS)[number];

/** Page height as a fraction of its width. */
export const pageRatio = (orientation: Orientation) =>
  orientation === "landscape" ? 210 / 297 : 297 / 210;

export type SheetData = {
  title: string;
  text: string;
  theme: Theme;
  orientation: Orientation;
  size: number;
  nameDate: boolean;
  lines: number;
  lang: string;
  labels: { name: string; date: string };
  emphasis: { strength: number; every: number; style: EmphasisStyle };
};

const flower = (x: number, y: number, petal: string) =>
  `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288]
    .map((a) => `<ellipse rx="7" ry="12" cy="-11" fill="${petal}" transform="rotate(${a})"/>`)
    .join("")}<circle r="6" fill="#f6c453"/></g>`;
const star = (x: number, y: number, r: number) => {
  const points = Array.from({ length: 10 }, (_, i) => {
    const radius = i % 2 ? r * 0.45 : r;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    return `${(x + radius * Math.cos(angle)).toFixed(1)},${(y + radius * Math.sin(angle)).toFixed(1)}`;
  });
  return `<polygon points="${points.join(" ")}" fill="#f6c453"/>`;
};
const cloud = (x: number, y: number) =>
  `<g transform="translate(${x} ${y})" fill="#cfe4f7"><circle cx="0" cy="8" r="14"/><circle cx="18" cy="0" r="18"/><circle cx="38" cy="8" r="14"/><rect x="0" y="8" width="38" height="14"/></g>`;

/** Corner decorations: decorative only, hidden from assistive technology. */
const wheel = (x: number, y: number) =>
  `<circle cx="${x}" cy="${y}" r="6" fill="#3b4a4f"/><circle cx="${x}" cy="${y}" r="2.4" fill="#e9ecea"/>`;
const car = (x: number, y: number, color: string) =>
  `<g transform="translate(${x} ${y})"><path d="M8 4 h18 l8 9 h8 a4 4 0 0 1 4 4 v8 h-48 v-8 a4 4 0 0 1 4 -4 h2 z" fill="${color}"/><path d="M11 7 h7 v6 h-12 z M21 7 h4 l6 6 h-10 z" fill="#e8f2fb"/>${wheel(12, 25)}${wheel(36, 25)}</g>`;
const truck = (x: number, y: number) =>
  `<g transform="translate(${x} ${y})"><rect x="0" y="0" width="44" height="24" rx="3" fill="#8ab4f8"/><path d="M46 6 h10 l8 9 v9 h-18 z" fill="#f6c453"/><path d="M50 9 h5 l5 6 h-10 z" fill="#e8f2fb"/>${wheel(10, 26)}${wheel(24, 26)}${wheel(54, 26)}</g>`;

const DECOR: Record<Theme, string> = {
  none: "",
  simple: "",
  clouds: `${cloud(14, 18)}${cloud(140, 30)}`,
  garden: `${flower(26, 30, "#f4a6b7")}${flower(66, 22, "#b9a6f4")}${flower(170, 34, "#f4a6b7")}`,
  stars: `${star(24, 26, 16)}${star(60, 18, 9)}${star(178, 30, 13)}`,
  vehicles: `${car(4, 18, "#f28b82")}${truck(112, 16)}<rect x="0" y="50" width="200" height="3" rx="1.5" fill="#c9d1d4"/>`,
};

/** Paragraphs separated by blank lines; single newlines kept inside the paragraph. */
function paragraphs(text: string, data: SheetData): string {
  return text
    .replace(/\r\n?/g, "\n")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const html = toHTML(p, { ...data.emphasis, locale: data.lang }, "fita-e").replace(
        /\n/g,
        "<br>",
      );
      return `<p><fita-w>${html}</fita-w></p>`;
    })
    .join("");
}

export function renderSheet(data: SheetData): string {
  const decor = DECOR[data.theme]
    ? `<svg class="decor" viewBox="0 0 200 60" aria-hidden="true" focusable="false">${DECOR[data.theme]}</svg>`
    : "";
  const meta = data.nameDate
    ? `<p class="meta"><span>${escapeHTML(data.labels.name)}:</span><span class="blank"></span><span>${escapeHTML(data.labels.date)}:</span><span class="blank short"></span></p>`
    : "";
  const lines = data.lines
    ? `<div class="write" aria-hidden="true">${'<span class="line"></span>'.repeat(data.lines)}</div>`
    : "";
  return `<article class="sheet theme-${data.theme} ${data.orientation}" lang="${escapeHTML(data.lang)}" data-fita-style="${data.emphasis.style ?? DEFAULT_STYLE}" style="--fs: ${data.size}">${decor}${meta}<h1>${escapeHTML(data.title)}</h1><div class="story">${paragraphs(data.text, data)}</div>${lines}</article>`;
}

/**
 * Sheet styles. Sizes use container units: the sheet always measures as A4,
 * whether it is a small preview, a printed page or the downloaded file.
 * px values below are "pixels on an A4 page at 96 dpi" (794 px wide).
 */
export const SHEET_CSS = `
.sheet-wrap { container-type: inline-size; width: 100%; }
.sheet {
  --u: calc(100cqw / 794);
  --page-ratio: calc(297 / 210);
  position: relative;
  box-sizing: border-box;
  min-height: calc(100cqw * var(--page-ratio));
  /* The top band holds the decorations, so they never cover the text. */
  padding: calc(118 * var(--u)) calc(72 * var(--u)) calc(64 * var(--u));
  background: #ffffff;
  color: #1d2a2e;
  font-family: "Atkinson Hyperlegible Next", system-ui, sans-serif;
  border-radius: calc(4 * var(--u));
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.sheet::before {
  content: "";
  position: absolute;
  inset: calc(24 * var(--u));
  border: calc(3 * var(--u)) solid #3b4a4f;
  border-radius: calc(18 * var(--u));
  pointer-events: none;
}
.sheet .decor { position: absolute; top: calc(34 * var(--u)); right: calc(48 * var(--u)); width: calc(250 * var(--u)); height: auto; }
.theme-simple, .theme-none { padding-top: calc(72 * var(--u)); }
.theme-none::before { display: none; }
.sheet h1 {
  margin: calc(28 * var(--u)) 0 calc(28 * var(--u));
  font-size: calc(var(--fs) * 1.9 * 1.333 * var(--u));
  line-height: 1.15;
  font-weight: 800;
  max-width: 75%;
}
.sheet .meta {
  display: flex;
  align-items: baseline;
  gap: calc(10 * var(--u));
  margin: 0;
  font-size: calc(15 * 1.333 * var(--u));
  font-weight: 700;
}
.sheet .blank { flex: 3; border-bottom: calc(2 * var(--u)) solid #9aa5a8; min-width: calc(80 * var(--u)); }
.sheet .blank.short { flex: 1.4; }
.sheet .story { font-size: calc(var(--fs) * 1.333 * var(--u)); line-height: 1.75; letter-spacing: 0.02em; word-spacing: 0.12em; }
.sheet .story p { margin: 0 0 0.8em; orphans: 2; widows: 2; }
.sheet .write { display: grid; gap: calc(46 * var(--u)); margin-top: calc(36 * var(--u)); }
.sheet .line { display: block; border-bottom: calc(2 * var(--u)) dashed #b7c0c2; }
.theme-clouds { background: #f2f8fd; }
.theme-clouds::before { border-color: #8dbbe6; border-width: calc(5 * var(--u)); border-radius: calc(40 * var(--u)); }
.theme-garden { background: #f5faf2; }
.theme-garden::before { border-color: #8fca8a; border-width: calc(5 * var(--u)); border-style: dashed; border-radius: calc(26 * var(--u)); }
.theme-stars { background: #fffbec; }
.theme-stars::before { border-color: #efc24a; border-width: calc(6 * var(--u)); border-style: dotted; border-radius: calc(30 * var(--u)); }
.theme-vehicles { background: #f3f7fb; }
.theme-vehicles::before { border-color: #f2a65a; border-width: calc(6 * var(--u)); border-radius: calc(22 * var(--u)); }
/* Landscape: same physical sizes on a page 1123 px wide; two columns keep lines short. */
.sheet.landscape { --u: calc(100cqw / 1123); --page-ratio: calc(210 / 297); page: landscape; }
.sheet.landscape .story { columns: 2; column-gap: calc(64 * var(--u)); }
.sheet.landscape .story p { break-inside: avoid; }
@page { size: A4 portrait; margin: 0; }
@page landscape { size: A4 landscape; margin: 0; }
@media print {
  .sheet-wrap { width: 210mm; }
  .sheet-wrap:has(.landscape) { width: 297mm; }
  /* Paper stays white: frames and drawings print, background tints do not (saves ink). */
  .sheet { min-height: 296mm; border-radius: 0; background: #ffffff; }
  .sheet.landscape { min-height: 209mm; }
}
`.trim();
