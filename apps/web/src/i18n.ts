// Languages of the site. Each one lives in src/locales/<lang>.ts (name, URL slugs,
// interface strings); src/locales/es.ts defines the shape the others must match.
import * as bg from "./locales/bg";
import * as ca from "./locales/ca";
import * as cs from "./locales/cs";
import * as da from "./locales/da";
import * as de from "./locales/de";
import * as el from "./locales/el";
import * as en from "./locales/en";
import * as es from "./locales/es";
import * as et from "./locales/et";
import * as eu from "./locales/eu";
import * as fi from "./locales/fi";
import * as fr from "./locales/fr";
import * as ga from "./locales/ga";
import * as gl from "./locales/gl";
import * as hr from "./locales/hr";
import * as hu from "./locales/hu";
import * as it from "./locales/it";
import * as lt from "./locales/lt";
import * as lv from "./locales/lv";
import * as mt from "./locales/mt";
import * as nl from "./locales/nl";
import * as pl from "./locales/pl";
import * as pt from "./locales/pt";
import * as ro from "./locales/ro";
import * as sk from "./locales/sk";
import * as sl from "./locales/sl";
import * as sv from "./locales/sv";

export type { Strings } from "./locales/es";

const LOCALES = {
  bg,
  ca,
  cs,
  da,
  de,
  el,
  en,
  es,
  et,
  eu,
  fi,
  fr,
  ga,
  gl,
  hr,
  hu,
  it,
  lt,
  lv,
  mt,
  nl,
  pl,
  pt,
  ro,
  sk,
  sl,
  sv,
};

export type Lang = keyof typeof LOCALES;
export type PageKey = "uses" | "worksheets" | "convert" | "privacy" | "accessibility";

/** Language codes in menu order: alphabetical by each language's own name. */
export const LANGS = (Object.keys(LOCALES) as Lang[]).sort((a, b) =>
  LOCALES[a].name.localeCompare(LOCALES[b].name, "en"),
);

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
