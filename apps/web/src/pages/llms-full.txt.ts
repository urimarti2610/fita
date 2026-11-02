import { BRAND } from "@fita/core";
import type { APIRoute } from "astro";
import { STRINGS } from "../i18n";
import { absolute, DEFAULT_LANG } from "../seo";

// The site's own words in one plain document, for AI assistants (see /llms.txt).
export const GET: APIRoute = () => {
  const lang = DEFAULT_LANG;
  const t = STRINGS[lang];
  const sections = [
    `# ${BRAND.name}: ${t.hero.headline}\n\n${t.hero.lede}\n\nWebsite: ${absolute(lang)}\nSource: ${BRAND.repository}`,
    `## ${t.privacy.heading}\n\n${t.privacy.body.join("\n\n")}`,
    `## ${t.faq.heading}\n\n${t.faq.items.map((i) => `### ${i.q}\n\n${i.a.join("\n\n")}`).join("\n\n")}`,
    `## ${t.uses.title}\n\n${t.uses.intro}\n\n${t.uses.cases
      .map(
        (c) =>
          `### ${c.title}\n\n${c.lede}\n\n${t.uses.how}:\n${c.steps.map((s) => `- ${s}`).join("\n")}\n\n${t.uses.care}:\n${c.notes.map((n) => `- ${n}`).join("\n")}`,
      )
      .join("\n\n")}`,
    `## ${t.worksheets.title}\n\n${t.worksheets.intro}\n\n${absolute(lang, "worksheets")}`,
    `## ${t.convert.title}\n\n${t.convert.intro}\n\n${absolute(lang, "convert")}`,
    `## ${t.pages.privacy.title}\n\n${t.pages.privacy.body.join("\n\n")}`,
    `## ${t.pages.accessibility.title}\n\n${t.pages.accessibility.body.join("\n\n")}`,
  ];
  return new Response(`${sections.join("\n\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
