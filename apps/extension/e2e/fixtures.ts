import { createServer, type Server } from "node:http";
import { join } from "node:path";
import { type BrowserContext, test as base, chromium, type Worker } from "@playwright/test";

const EXTENSION = join(import.meta.dirname, "..", "dist-e2e", "chrome");

export const PAGE = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Prueba</title></head>
<body><main><h1>Título de prueba</h1><p id="p">Hola mundo, esto es un párrafo de ejemplo.</p>
<pre>código intacto</pre><textarea>no tocar</textarea></main></body></html>`;

type Fixtures = {
  context: BrowserContext;
  worker: Worker;
  extensionId: string;
  baseURL: string;
};

export const test = base.extend<Fixtures, { server: { url: string } }>({
  server: [
    // biome-ignore lint/correctness/noEmptyPattern: Playwright fixture signature
    async ({}, use) => {
      const server: Server = createServer((_req, res) => {
        res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
        res.end(PAGE);
      });
      await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      await use({ url: `http://127.0.0.1:${port}` });
      server.close();
    },
    { scope: "worker" },
  ],
  baseURL: async ({ server }, use) => use(server.url),
  // biome-ignore lint/correctness/noEmptyPattern: Playwright fixture signature
  context: async ({}, use) => {
    const context = await chromium.launchPersistentContext("", {
      channel: "chromium",
      args: [`--disable-extensions-except=${EXTENSION}`, `--load-extension=${EXTENSION}`],
    });
    await use(context);
    await context.close();
  },
  worker: async ({ context }, use) => {
    const worker = context.serviceWorkers()[0] ?? (await context.waitForEvent("serviceworker"));
    await use(worker);
  },
  extensionId: async ({ worker }, use) => use(new URL(worker.url()).host),
});

export const expect = test.expect;

/** Tab id of the page with the given URL, as the extension sees it. */
export function tabIdOf(worker: Worker, url: string): Promise<number> {
  return worker.evaluate(async (u) => {
    const { protocol, hostname } = new URL(u);
    const tabs = await chrome.tabs.query({ url: `${protocol}//${hostname}/*` });
    const tab = tabs.find((t) => t.url?.startsWith(u));
    return tab?.id ?? -1;
  }, url);
}
