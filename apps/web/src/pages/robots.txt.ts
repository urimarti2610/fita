import { BRAND } from "@fita/core";
import type { APIRoute } from "astro";

// Everything is public and meant to be found, by search engines and AI assistants alike.
export const GET: APIRoute = () =>
  new Response(
    `User-agent: *
Allow: /

Sitemap: ${BRAND.website}/sitemap.xml
`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
