// Languages of the site. Each one lives in src/locales/<lang>.ts (name, URL slugs,
// interface strings); src/locales/es.ts defines the shape the others must match.
import * as ca from "./locales/ca";
import * as en from "./locales/en";
import * as es from "./locales/es";

export type { Strings } from "./locales/es";

const LOCALES = { es, ca, en };

export type Lang = keyof typeof LOCALES;
export type PageKey = "uses" | "worksheets" | "convert" | "privacy" | "accessibility";

/** Language codes in menu order: Spanish first (the default), then by language name. */
export const LANGS = Object.keys(LOCALES) as Lang[];

const pick = <T>(get: (locale: (typeof LOCALES)[Lang]) => T) =>
  Object.fromEntries(LANGS.map((l) => [l, get(LOCALES[l])])) as Record<Lang, T>;

/** Localized slugs for each page. */
export const SLUGS = pick((l) => l.slugs);
/** Each language's name, written in that language. */
export const LANG_NAMES = pick((l) => l.name);
export const STRINGS = pick((l) => l.strings);

export function isLang(value: string | undefined): value is Lang {
  return (LANGS as readonly string[]).includes(value ?? "");
}

/** URL for a page in a language, honouring the configured base path. */
export function href(lang: Lang, page?: PageKey, anchor?: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");
  const path = page ? `${base}${lang}/${SLUGS[lang][page]}/` : `${base}${lang}/`;
  return anchor ? `${path}#${anchor}` : path;
}

/** Pages rendered by [lang]/[page].astro. */
export const PAGES = [
  "uses",
  "worksheets",
  "convert",
  "privacy",
  "accessibility",
] as const satisfies PageKey[];
