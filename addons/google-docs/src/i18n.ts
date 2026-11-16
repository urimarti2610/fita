/**
 * Interface text. Apps Script has no message-file mechanism for editor add-ons, so
 * each language is a plain object here, picked from the user's Google account locale.
 * To add a language, copy `en`, translate the values and register it in MESSAGES.
 */
import ca from "./locales/ca.json" with { type: "json" };
import en from "./locales/en.json" with { type: "json" };
import es from "./locales/es.json" with { type: "json" };

export type Messages = typeof en;
export const MESSAGES = { en, es, ca } as const satisfies Record<string, Messages>;

/** Picks the messages for a locale such as "es", "ca-ES" or "en_GB"; English otherwise. */
export function messagesFor(locale: string | null | undefined): Messages {
  const lang = (locale ?? "").toLowerCase().split(/[-_]/)[0] ?? "";
  return (MESSAGES as Record<string, Messages>)[lang] ?? en;
}

/** Replaces `{name}` placeholders. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (all, key: string) =>
    key in values ? String(values[key]) : all,
  );
}
