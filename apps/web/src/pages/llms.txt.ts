import { BRAND } from "@fita/core";
import type { APIRoute } from "astro";
import { LANG_NAMES, LANGS, STRINGS } from "../i18n";
import { absolute, DEFAULT_LANG, description } from "../seo";

// llms.txt (https://llmstxt.org): a short, plain map of the site for AI assistants.
export const GET: APIRoute = () => {
  const lang = DEFAULT_LANG;
  const t = STRINGS[lang];
  const link = (title: string, page?: Parameters<typeof absolute>[1]) =>
    `- [${title}](${absolute(lang, page)}): ${description(lang, page, Number.POSITIVE_INFINITY)}`;
  const body = `# ${BRAND.name}

> ${t.meta.description}

${t.hero.lede}

Key facts: free and open source (MPL-2.0); runs entirely in the browser, with no servers, accounts, analytics or cookies; no limits on text or file size; several emphasis styles; does not claim to make reading faster, only more comfortable.

## Pages

${link(t.nav.home)}
${link(t.uses.title, "uses")}
${link(t.worksheets.title, "worksheets")}
${link(t.convert.title, "convert")}
${link(t.pages.privacy.title, "privacy")}
${link(t.pages.accessibility.title, "accessibility")}

## Languages

${LANGS.map((l) => `- [${LANG_NAMES[l]}](${absolute(l)})`).join("\n")}

## Optional

- [Full text of the site for LLMs](${BRAND.website}/llms-full.txt): FAQ, use cases, privacy and accessibility in full.
- [Source code](${BRAND.repository}): browser extension, website and the TypeScript core library.
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
