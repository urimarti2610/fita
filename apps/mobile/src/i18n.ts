import type { Strings } from "@web/locales/es";
import type { AppStrings } from "./locales/en";

/**
 * Interface text: the website's translations (apps/web/src/locales) for everything
 * the two share, plus the app's own strings (./locales). Each language is loaded
 * only when it is used.
 */
export type UIStrings = Strings & { app: AppStrings };

type Loader<T> = () => Promise<T>;
const WEB = import.meta.glob<{ strings: Strings }>("../../web/src/locales/*.ts");
const APP = import.meta.glob<{ strings: AppStrings }>("./locales/*.ts");

const langOf = (path: string) => path.match(/([a-z]+)\.ts$/)?.[1] ?? "";
const byLang = <T>(modules: Record<string, Loader<T>>) =>
  new Map(Object.entries(modules).map(([path, load]) => [langOf(path), load]));
const web = byLang(WEB);
const app = byLang(APP);

/** Languages with both the website's and the app's strings. */
export const LANGS = [...app.keys()].filter((l) => web.has(l)).sort();
export const FALLBACK_LANG = "en";

/** First supported language among the preferred ones (BCP 47 tags), by primary subtag. */
export function pickLang(preferred: readonly string[], supported: readonly string[] = LANGS) {
  for (const tag of preferred) {
    const base = tag.toLowerCase().split(/[-_]/)[0] ?? "";
    if (supported.includes(base)) return base;
  }
  return FALLBACK_LANG;
}

export async function loadStrings(lang: string): Promise<UIStrings> {
  const code = LANGS.includes(lang) ? lang : FALLBACK_LANG;
  const [w, a] = await Promise.all([web.get(code)?.(), app.get(code)?.()]);
  if (!w || !a) throw new Error(`Missing strings for ${code}`);
  return { ...w.strings, app: a.strings };
}

/** Replaces {name} placeholders. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/** A language's name in that language, from the platform (no extra data to ship). */
export function languageName(lang: string): string {
  try {
    const name = new Intl.DisplayNames([lang], { type: "language" }).of(lang) ?? lang;
    return name.charAt(0).toLocaleUpperCase(lang) + name.slice(1);
  } catch {
    return lang;
  }
}
