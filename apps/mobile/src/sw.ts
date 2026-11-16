/// <reference lib="webworker" />
// Service worker for the installable web app (not used inside the native shells).
// Compiled on its own by vite.config.ts: no imports. Placeholders are filled at build.
//  - Offline: every file of the build is cached on install and served from the cache.
//  - Share target: books and texts shared to the app arrive as a POST to ./share;
//    they are kept in a local IndexedDB "inbox" that the app empties on start.
// Nothing is ever fetched from or sent to another site.

const sw = self as unknown as ServiceWorkerGlobalScope;
const PRECACHE: string[] = "__PRECACHE__" as unknown as string[];
const CACHE = "__VERSION__";
const INBOX = "__INBOX__";

sw.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => sw.skipWaiting()),
  );
});

sw.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith(CACHE.split("-")[0] ?? "") && k !== CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => sw.clients.claim()),
  );
});

type InboxItem = { name: string; type: string; blob: Blob } | { title: string; text: string };

function saveToInbox(items: InboxItem[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open(INBOX, 1);
    open.onupgradeneeded = () => open.result.createObjectStore("items", { autoIncrement: true });
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const tx = open.result.transaction("items", "readwrite");
      for (const item of items) tx.objectStore("items").add(item);
      tx.oncomplete = () => {
        open.result.close();
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    };
  });
}

async function receiveShare(request: Request): Promise<Response> {
  const scope = sw.registration.scope;
  try {
    const form = await request.formData();
    const items: InboxItem[] = [];
    for (const file of form.getAll("file")) {
      if (file instanceof File) items.push({ name: file.name, type: file.type, blob: file });
    }
    const text = String(form.get("text") ?? "").trim();
    if (!items.length && text) items.push({ title: String(form.get("title") ?? ""), text });
    if (items.length) await saveToInbox(items);
  } catch {
    // Nothing usable was shared: just open the app.
  }
  return Response.redirect(`${scope}#/inbox`, 303);
}

sw.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (url.origin !== sw.location.origin) return;
  if (request.method === "POST" && url.href === new URL("share", sw.registration.scope).href) {
    event.respondWith(receiveShare(request));
    return;
  }
  if (request.method !== "GET") return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const index = new URL("./", sw.registration.scope).href;
      const key = request.mode === "navigate" ? index : request;
      const cached = await cache.match(key, { ignoreSearch: request.mode === "navigate" });
      return cached ?? fetch(request);
    })(),
  );
});
