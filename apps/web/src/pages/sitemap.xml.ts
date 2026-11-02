import type { APIRoute } from "astro";
import { LANGS } from "../i18n";
import { allPages, DEFAULT_LANG } from "../seo";

// Every page in every language, each listing its alternates (hreflang) and x-default.
export const GET: APIRoute = () => {
  const urls = allPages().flatMap(({ urls }) =>
    LANGS.map((lang) => {
      const alternates = LANGS.map(
        (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${urls[l]}"/>`,
      );
      alternates.push(
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${urls[DEFAULT_LANG]}"/>`,
      );
      return `  <url>\n    <loc>${urls[lang]}</loc>\n${alternates.join("\n")}\n  </url>`;
    }),
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
