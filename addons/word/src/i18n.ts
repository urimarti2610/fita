/**
 * Task pane and manifest text. Office passes the interface language
 * (`Office.context.displayLanguage`, e.g. "ca-ES"); the manifest gets per-locale
 * <Override> entries from the same files at build time.
 */
import ca from "./locales/ca.json" with { type: "json" };
import en from "./locales/en.json" with { type: "json" };
import es from "./locales/es.json" with { type: "json" };

export type Messages = typeof en;
export const MESSAGES = { en, es, ca } as const satisfies Record<string, Messages>;
/** Office locale codes used for the manifest overrides. */
export const MANIFEST_LOCALES: Record<keyof typeof MESSAGES, string> = {
  en: "en-US",
  es: "es-ES",
  ca: "ca-ES",
};

export function messagesFor(locale: string | null | undefined): Messages {
  const lang = (locale ?? "").toLowerCase().split(/[-_]/)[0] ?? "";
  return (MESSAGES as Record<string, Messages>)[lang] ?? en;
}

export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (all, key: string) =>
    key in values ? String(values[key]) : all,
  );
}
