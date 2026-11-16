import { BRAND } from "@fita/core";
import type { Format } from "./formats.js";

/**
 * The reader's library: files the person opened, kept on this device only
 * (IndexedDB), plus where they stopped reading (localStorage).
 */
export type BookRecord = {
  id: string;
  title: string;
  format: Format;
  size: number;
  added: number;
  opened: number;
};

export type Position = {
  chapter: number;
  /** Scroll position inside the chapter, 0–1. */
  offset: number;
  /** Fraction of the whole book read, 0–1, for the library list. */
  progress: number;
};

/** Storage backend; IndexedDB in the app, a Map in tests. */
export type Backend = {
  list(): Promise<BookRecord[]>;
  get(id: string): Promise<{ record: BookRecord; file: Blob } | undefined>;
  put(record: BookRecord, file?: Blob): Promise<void>;
  delete(id: string): Promise<void>;
};

const DB_NAME = `${BRAND.id}-library`;
const POSITION_KEY = (id: string) => `${BRAND.id}-position-${id}`;

function request<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function indexedDBBackend(): Backend {
  let db: Promise<IDBDatabase> | null = null;
  const open = () => {
    db ??= new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        req.result.createObjectStore("books", { keyPath: "id" });
        req.result.createObjectStore("files");
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return db;
  };
  const tx = async (mode: IDBTransactionMode) =>
    (await open()).transaction(["books", "files"], mode);
  const done = (t: IDBTransaction) =>
    new Promise<void>((resolve, reject) => {
      t.oncomplete = () => resolve();
      t.onerror = () => reject(t.error);
      t.onabort = () => reject(t.error);
    });

  return {
    async list() {
      return request((await tx("readonly")).objectStore("books").getAll()) as Promise<BookRecord[]>;
    },
    async get(id) {
      const t = await tx("readonly");
      const [record, file] = await Promise.all([
        request(t.objectStore("books").get(id)) as Promise<BookRecord | undefined>,
        request(t.objectStore("files").get(id)) as Promise<Blob | undefined>,
      ]);
      return record && file ? { record, file } : undefined;
    },
    async put(record, file) {
      const t = await tx("readwrite");
      t.objectStore("books").put(record);
      if (file) t.objectStore("files").put(file, record.id);
      await done(t);
    },
    async delete(id) {
      const t = await tx("readwrite");
      t.objectStore("books").delete(id);
      t.objectStore("files").delete(id);
      await done(t);
    },
  };
}

export function memoryBackend(): Backend {
  const books = new Map<string, { record: BookRecord; file: Blob }>();
  return {
    list: async () => [...books.values()].map((b) => b.record),
    get: async (id) => books.get(id),
    put: async (record, file) => {
      const blob = file ?? books.get(record.id)?.file;
      if (blob) books.set(record.id, { record, file: blob });
    },
    delete: async (key) => {
      books.delete(key);
    },
  };
}

export function createLibrary(backend: Backend, storage: Storage | null = safeLocalStorage()) {
  /** Files that could not be stored (quota, private mode) stay readable until the app closes. */
  const transient = new Map<string, { record: BookRecord; file: Blob }>();

  return {
    /** Most recently opened first. */
    async list(): Promise<BookRecord[]> {
      let stored: BookRecord[] = [];
      try {
        stored = await backend.list();
      } catch {
        // Storage unavailable: show what is in memory.
      }
      const all = [...stored, ...[...transient.values()].map((t) => t.record)];
      return all.sort((a, b) => b.opened - a.opened);
    },

    /** Adds a file. Resolves to the record and whether it was saved on the device. */
    async add(
      file: Blob,
      meta: { title: string; format: Format },
    ): Promise<{ record: BookRecord; saved: boolean }> {
      const now = Date.now();
      const record: BookRecord = {
        id: crypto.randomUUID(),
        title: meta.title.trim() || "—",
        format: meta.format,
        size: file.size,
        added: now,
        opened: now,
      };
      try {
        await backend.put(record, file);
        return { record, saved: true };
      } catch {
        transient.set(record.id, { record, file });
        return { record, saved: false };
      }
    },

    async get(id: string) {
      const memory = transient.get(id);
      if (memory) return memory;
      try {
        return await backend.get(id);
      } catch {
        return undefined;
      }
    },

    /** Marks a book as just opened and, once known, stores its real title. */
    async touch(record: BookRecord, title?: string | null) {
      const updated = { ...record, opened: Date.now(), title: title?.trim() || record.title };
      const memory = transient.get(record.id);
      if (memory) memory.record = updated;
      else await backend.put(updated).catch(() => undefined);
      return updated;
    },

    async remove(id: string) {
      transient.delete(id);
      await backend.delete(id).catch(() => undefined);
      try {
        storage?.removeItem(POSITION_KEY(id));
      } catch {
        // Nothing to clean.
      }
    },

    position(id: string): Position | null {
      try {
        const raw = JSON.parse(storage?.getItem(POSITION_KEY(id)) ?? "null");
        return sanitizePosition(raw);
      } catch {
        return null;
      }
    },

    savePosition(id: string, position: Position) {
      try {
        storage?.setItem(POSITION_KEY(id), JSON.stringify(position));
      } catch {
        // Storage full or disabled: the position is simply not remembered.
      }
    },
  };
}

export type Library = ReturnType<typeof createLibrary>;

const clamp01 = (n: unknown) => {
  const v = Number(n);
  return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0;
};

export function sanitizePosition(raw: unknown): Position | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  const chapter = Number(value.chapter);
  if (!Number.isInteger(chapter) || chapter < 0) return null;
  return { chapter, offset: clamp01(value.offset), progress: clamp01(value.progress) };
}

/** Overall progress from the chapter index and the offset inside it. */
export function bookProgress(chapter: number, offset: number, chapters: number): number {
  if (chapters <= 0) return 0;
  return clamp01((chapter + clamp01(offset)) / chapters);
}

function safeLocalStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

/** Title from a file name: without extension, with separators as spaces. */
export function titleFromName(name: string): string {
  const stem =
    name
      .split(/[\\/]/)
      .pop()
      ?.replace(/\.[^.]+$/, "") ?? "";
  return stem.replace(/[_]+/g, " ").trim();
}
