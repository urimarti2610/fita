import type { APIRoute } from "astro";
import notice from "../../../../NOTICE?raw";
// The licences of third-party code and fonts that the website sends to browsers.
import notices from "../../../../THIRD_PARTY_NOTICES.md?raw";

export const GET: APIRoute = () =>
  new Response(`${notice}\n\n${notices}`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
