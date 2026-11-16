import { BRAND } from "@fita/core";

/**
 * Books and texts shared to the installed web app arrive through the service
 * worker (see sw.ts), which keeps them in this IndexedDB "inbox" until the app
 * takes them out.
 */
export type InboxItem =
  | { name: string; type: string; blob: Blob }
  | { title: string; text: string };

export function takeInbox(): Promise<InboxItem[]> {
  return new Promise((resolve) => {
    if (typeof indexedDB === "undefined") return resolve([]);
    const open = indexedDB.open(`${BRAND.id}-inbox`, 1);
    open.onupgradeneeded = () => open.result.createObjectStore("items", { autoIncrement: true });
    open.onerror = () => resolve([]);
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction("items", "readwrite");
      const store = tx.objectStore("items");
      const all = store.getAll();
      all.onsuccess = () => store.clear();
      tx.oncomplete = () => {
        db.close();
        resolve((all.result ?? []) as InboxItem[]);
      };
      tx.onerror = () => resolve([]);
    };
  });
}
