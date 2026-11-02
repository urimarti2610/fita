import { BRAND } from "@fita/core";
import { href, LANGS, type Lang, PAGES, type PageKey, STRINGS } from "./i18n";

/** Absolute URL of a page on the live site. */
export function absolute(lang: Lang, page?: PageKey): string {
  return new URL(href(lang, page), BRAND.website).href;
}

/** Language used for x-default: the broadest audience among the site's languages. */
export const DEFAULT_LANG: Lang = (LANGS as readonly string[]).includes("en")
  ? ("en" as Lang)
  : (LANGS[0] as Lang);

/** Every page of the site, in every language: one entry per page with its alternates. */
export function allPages(): { page?: PageKey; urls: Record<Lang, string> }[] {
  return [undefined, ...PAGES].map((page) => ({
    ...(page ? { page } : {}),
    urls: Object.fromEntries(LANGS.map((l) => [l, absolute(l, page)])) as Record<Lang, string>,
  }));
}

/** Search engines show about 155 characters: cut at a word boundary. */
export function clip(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.]$/, "")}…`;
}

/**
 * Description of each page, from the page's own introduction. Clipped for search
 * results by default; pass `Number.POSITIVE_INFINITY` for the full text.
 */
export function description(lang: Lang, page?: PageKey, max = 158): string {
  const t = STRINGS[lang];
  switch (page) {
    case "uses":
      return clip(t.uses.intro, max);
    case "worksheets":
      return clip(t.worksheets.intro, max);
    case "convert":
      return clip(t.convert.intro, max);
    case "privacy":
    case "accessibility":
      return clip(t.pages[page].body.slice(0, 2).join(" "), max);
    default:
      return clip(t.meta.description, max);
  }
}

/** Open Graph wants language_TERRITORY. */
const OG_LOCALES: Record<string, string> = {
  bg: "bg_BG",
  ca: "ca_ES",
  cs: "cs_CZ",
  da: "da_DK",
  de: "de_DE",
  el: "el_GR",
  en: "en_GB",
  es: "es_ES",
  et: "et_EE",
  eu: "eu_ES",
  fi: "fi_FI",
  fr: "fr_FR",
  ga: "ga_IE",
  gl: "gl_ES",
  hr: "hr_HR",
  hu: "hu_HU",
  it: "it_IT",
  lt: "lt_LT",
  lv: "lv_LV",
  mt: "mt_MT",
  nl: "nl_NL",
  pl: "pl_PL",
  pt: "pt_PT",
  ro: "ro_RO",
  sk: "sk_SK",
  sl: "sl_SI",
  sv: "sv_SE",
};
export const ogLocale = (lang: string) => OG_LOCALES[lang] ?? lang;

/** Structured data: the site and the free application it offers. */
export function jsonLd(lang: Lang, page?: PageKey): object {
  const t = STRINGS[lang];
  const graph: object[] = [
    {
      "@type": "WebSite",
      "@id": `${BRAND.website}/#website`,
      name: BRAND.name,
      url: BRAND.website,
      inLanguage: LANGS,
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${BRAND.website}/#app`,
      name: BRAND.name,
      url: absolute(lang),
      description: t.meta.description,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web, Chrome, Edge, Firefox",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      license: "https://www.mozilla.org/MPL/2.0/",
      codeRepository: BRAND.repository,
    },
  ];
  if (!page) {
    graph.push({
      "@type": "FAQPage",
      inLanguage: lang,
      mainEntity: t.faq.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a.join(" ") },
      })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
