import "@fontsource/atkinson-hyperlegible-next/400.css";
import "@fontsource/atkinson-hyperlegible-next/400-italic.css";
import "@fontsource/atkinson-hyperlegible-next/700.css";
import "./styles.css";
import {
  applyToElement,
  BRAND,
  type Controller,
  EMPHASIS_STYLES,
  type EmphasisStyle,
  emphasize,
  MAX_STRENGTH,
  MIN_STRENGTH,
  STYLE_ATTRIBUTE,
} from "@fita/core";
import { ConvertError } from "@web/convert/epub.js";
import {
  loadSettings,
  type ReadingSettings,
  SETTINGS_EVENT,
  saveSettings,
} from "@web/settings/store.js";
import { type Book, openBook, type RenderedChapter } from "./book.js";
import { ACCEPT_ATTRIBUTE, detectFormat } from "./formats.js";
import { h } from "./h.js";
import { format, LANGS, languageName, loadStrings, pickLang, type UIStrings } from "./i18n.js";
import { takeInbox } from "./inbox.js";
import {
  type BookRecord,
  bookProgress,
  createLibrary,
  indexedDBBackend,
  titleFromName,
} from "./library.js";
import { isNative, setupNative } from "./native.js";
import { ID_PREFIX } from "./sanitize.js";
import {
  LINE_HEIGHTS,
  loadPrefs,
  type ReaderPrefs,
  savePrefs,
  TEXT_SIZES,
  THEMES,
  WIDTHS,
} from "./settings.js";

const root = document.documentElement;
const app = document.getElementById("app") as HTMLElement;
const library = createLibrary(indexedDBBackend());

let t: UIStrings;
let prefs = loadPrefs();
let emphasisSettings = loadSettings();

/** The book on screen. */
type Session = {
  id: string;
  record: BookRecord;
  book: Book;
  chapter: number;
  article?: HTMLElement;
  rendered?: RenderedChapter;
  controller?: Controller | null;
};
let session: Session | null = null;

// ─── Messages ────────────────────────────────────────────────────────────────

const status = h("p", { class: "status", role: "status", "aria-live": "polite" });
let statusTimer = 0;
function announce(message: string) {
  status.textContent = message;
  clearTimeout(statusTimer);
  statusTimer = window.setTimeout(() => {
    status.textContent = "";
  }, 8000);
}

// ─── Appearance ──────────────────────────────────────────────────────────────

function applyAppearance() {
  root.dataset.theme = prefs.theme;
  root.style.setProperty("--text-scale", String(TEXT_SIZES[prefs.textSize] ?? 1));
  root.style.setProperty("--reader-line", prefs.lineHeight || "1.6");
  root.style.setProperty("--reader-width", prefs.maxWidth || "none");
  root.setAttribute(STYLE_ATTRIBUTE, emphasisSettings.style);
}

const emphasisOptions = () => ({
  strength: emphasisSettings.strength,
  every: emphasisSettings.every,
});

/** Applies, updates or removes emphasis on the open chapter. */
function refreshEmphasis() {
  if (!session?.article) return;
  if (!prefs.enabled) {
    session.controller?.undo();
    session.controller = null;
  } else if (session.controller) {
    session.controller.update(emphasisOptions());
  } else {
    session.controller = applyToElement(session.article, emphasisOptions());
  }
}

// ─── Settings sheet ──────────────────────────────────────────────────────────

function select(
  name: string,
  label: string,
  options: { value: string; label: string }[],
  current: string,
) {
  const id = `setting-${name}`;
  return h(
    "div",
    { class: "field" },
    h("label", { for: id }, label),
    h(
      "select",
      { id, name },
      options.map((o) => h("option", { value: o.value, selected: o.value === current }, o.label)),
    ),
  );
}

function settingsSheet(): HTMLDialogElement {
  const d = t.demo;
  const a = t.app.reader;
  const percent = (s: number) => `${Math.round(s * 100)} %`;
  const strengthOut = h("output", { for: "setting-strength" }, percent(emphasisSettings.strength));
  const form = h(
    "form",
    { method: "dialog", class: "settings" },
    h("h2", { id: "settings-title" }, t.settings.title),
    h(
      "label",
      { class: "switch" },
      h("input", {
        type: "checkbox",
        role: "switch",
        name: "enabled",
        checked: prefs.enabled,
      }),
      h("span", {}, a.emphasis),
    ),
    h(
      "div",
      { class: "field" },
      h("label", { for: "setting-strength" }, d.strength, " ", strengthOut),
      h("input", {
        id: "setting-strength",
        name: "strength",
        type: "range",
        min: MIN_STRENGTH,
        max: MAX_STRENGTH,
        step: 0.05,
        value: emphasisSettings.strength,
      }),
    ),
    h(
      "fieldset",
      { class: "field styles" },
      h("legend", {}, d.style),
      EMPHASIS_STYLES.map((style) =>
        h(
          "label",
          {},
          h("input", {
            type: "radio",
            name: "style",
            value: style,
            checked: style === emphasisSettings.style,
          }),
          h("span", {}, d.styles[style]),
        ),
      ),
    ),
    select(
      "every",
      d.every,
      d.everyOptions.map((label, i) => ({ value: String(i + 1), label })),
      String(emphasisSettings.every),
    ),
    select(
      "textSize",
      a.textSize,
      a.sizes.map((label, i) => ({ value: String(i), label })),
      String(prefs.textSize),
    ),
    select(
      "lineHeight",
      d.lineHeight,
      LINE_HEIGHTS.map((v) => ({ value: v, label: v ? Number(v).toFixed(1) : d.pageDefault })),
      prefs.lineHeight,
    ),
    select(
      "maxWidth",
      d.maxWidth,
      WIDTHS.map((v, i) => ({ value: v, label: v ? (d.widths[i - 1] ?? v) : d.pageDefault })),
      prefs.maxWidth,
    ),
    select(
      "theme",
      a.theme,
      THEMES.map((v) => ({ value: v, label: a.themes[v] })),
      prefs.theme,
    ),
    select(
      "lang",
      a.language,
      [
        { value: "", label: a.deviceLanguage },
        ...LANGS.map((l) => ({ value: l, label: languageName(l) })),
      ],
      prefs.lang ?? "",
    ),
    h("button", { class: "primary", value: "close" }, t.settings.close),
  );

  const onChange = (event: Event) => {
    const data = new FormData(form);
    const target = event.target as HTMLInputElement;
    emphasisSettings = {
      strength: Number(data.get("strength")),
      every: Number(data.get("every")),
      style: String(data.get("style")) as EmphasisStyle,
    };
    strengthOut.textContent = percent(emphasisSettings.strength);
    const lang = String(data.get("lang") ?? "") || null;
    const langChanged = lang !== prefs.lang;
    prefs = {
      enabled: (form.elements.namedItem("enabled") as HTMLInputElement).checked,
      lineHeight: String(data.get("lineHeight")) as ReaderPrefs["lineHeight"],
      maxWidth: String(data.get("maxWidth")) as ReaderPrefs["maxWidth"],
      textSize: Number(data.get("textSize")),
      theme: String(data.get("theme")) as ReaderPrefs["theme"],
      lang,
    };
    savePrefs(prefs);
    saveSettings(emphasisSettings, form);
    applyAppearance();
    refreshEmphasis();
    if (langChanged && target.name === "lang") void changeLanguage();
  };
  form.addEventListener("input", onChange);
  form.addEventListener("change", onChange);

  const dialog = h("dialog", { class: "sheet", "aria-labelledby": "settings-title" }, form);
  return dialog;
}

function openSettings() {
  const dialog = settingsSheet();
  dialog.addEventListener("close", () => dialog.remove());
  document.body.append(dialog);
  dialog.showModal();
}

// ─── Library ─────────────────────────────────────────────────────────────────

/** The brand name with its own emphasis, as on the website. */
function wordmark() {
  return h(
    "span",
    { class: "wordmark" },
    emphasize(BRAND.name, { strength: 0.5 }).map((s) => (s.emphasis ? h("b", {}, s.text) : s.text)),
  );
}

const fileInput = h("input", {
  type: "file",
  accept: ACCEPT_ATTRIBUTE,
  class: "visually-hidden",
  tabindex: -1,
  "aria-hidden": "true",
});
fileInput.addEventListener("change", () => {
  const file = fileInput.files?.[0];
  fileInput.value = "";
  if (file) void importFile(file, file.name, file.type);
});

async function importFile(file: Blob, name: string, type = "") {
  const head = new Uint8Array(await file.slice(0, 512).arrayBuffer());
  const kind = detectFormat(name, type, head);
  if (!kind) {
    announce(t.convert.errors.unsupported);
    return;
  }
  const { record, saved } = await library.add(file, {
    title: titleFromName(name) || t.app.paste.untitled,
    format: kind,
  });
  if (!saved) announce(t.app.library.notSaved);
  location.hash = `#/read/${record.id}`;
}

async function importText(text: string, title: string) {
  const blob = new Blob([text], { type: "text/plain" });
  const { record, saved } = await library.add(blob, {
    title: title || t.app.paste.untitled,
    format: "txt",
  });
  if (!saved) announce(t.app.library.notSaved);
  location.hash = `#/read/${record.id}`;
}

function pasteDialog() {
  const p = t.app.paste;
  const text = h("textarea", { id: "paste-text", name: "text", rows: 8, required: true });
  const title = h("input", { id: "paste-title", name: "title", type: "text", autocomplete: "off" });
  const form = h(
    "form",
    { method: "dialog", class: "paste" },
    h("h2", { id: "paste-heading" }, p.heading),
    h("div", { class: "field" }, h("label", { for: "paste-text" }, p.text), text),
    h("div", { class: "field" }, h("label", { for: "paste-title" }, p.title), title),
    h(
      "div",
      { class: "actions" },
      h("button", { class: "primary", value: "read" }, p.read),
      h("button", { value: "cancel", formnovalidate: true }, p.cancel),
    ),
  );
  const dialog = h("dialog", { class: "sheet", "aria-labelledby": "paste-heading" }, form);
  dialog.addEventListener("close", () => {
    if (dialog.returnValue === "read" && text.value.trim()) {
      void importText(text.value, title.value.trim());
    }
    dialog.remove();
  });
  document.body.append(dialog);
  dialog.showModal();
}

async function showLibrary() {
  closeSession();
  const l = t.app.library;
  document.title = BRAND.name;
  const list = h("ul", { class: "books", role: "list" });
  const books = await library.list();
  for (const record of books) {
    const progress = Math.round((library.position(record.id)?.progress ?? 0) * 100);
    const remove = h(
      "button",
      {
        class: "icon remove",
        type: "button",
        "aria-label": format(l.remove, { title: record.title }),
      },
      "×",
    );
    remove.addEventListener("click", async () => {
      await library.remove(record.id);
      announce(format(l.removed, { title: record.title }));
      await showLibrary();
    });
    list.append(
      h(
        "li",
        {},
        h(
          "a",
          { class: "book", href: `#/read/${record.id}` },
          h("span", { class: "title" }, record.title),
          h(
            "span",
            { class: "meta" },
            `${record.format.toUpperCase()} · ${format(l.progress, { n: progress })}`,
          ),
        ),
        remove,
      ),
    );
  }
  const openButton = h("button", { class: "primary", type: "button" }, l.open);
  openButton.addEventListener("click", () => fileInput.click());
  const pasteButton = h("button", { type: "button" }, l.paste);
  pasteButton.addEventListener("click", pasteDialog);
  const settingsButton = h("button", { type: "button", class: "ghost" }, t.app.reader.settings);
  settingsButton.addEventListener("click", openSettings);

  app.replaceChildren(
    h("header", { class: "top" }, h("p", { class: "brand" }, wordmark()), settingsButton),
    h(
      "main",
      { id: "main", class: "library", tabindex: -1 },
      h("h1", {}, t.hero.headline),
      h("p", { class: "lede" }, l.intro),
      h("div", { class: "actions" }, openButton, pasteButton),
      h("p", { class: "hint" }, t.convert.formats),
      h("h2", {}, l.heading),
      books.length ? list : h("p", { class: "empty" }, l.empty),
      h("p", { class: "privacy" }, t.privacy.heading),
    ),
    status,
    fileInput,
  );
}

// ─── Reader ──────────────────────────────────────────────────────────────────

function closeSession() {
  if (!session) return;
  savePosition();
  session.controller?.stop();
  session.rendered?.release();
  session = null;
}

function maxScroll() {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
}

function savePosition() {
  if (!session?.article) return;
  const max = maxScroll();
  const offset = max ? window.scrollY / max : 0;
  library.savePosition(session.id, {
    chapter: session.chapter,
    offset,
    progress: bookProgress(session.chapter, offset, session.book.chapters.length),
  });
}

let scrollTimer = 0;
window.addEventListener(
  "scroll",
  () => {
    clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(savePosition, 250);
  },
  { passive: true },
);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") savePosition();
});
window.addEventListener("pagehide", savePosition);

function chapterLabel(book: Book, index: number) {
  return book.chapters[index]?.title ?? `${t.convert.labels.part} ${index + 1}`;
}

function contentsDialog() {
  if (!session) return;
  const { book } = session;
  const titled = book.chapters.some((c) => c.title);
  const list = h("ol", { class: "contents" });
  book.chapters.forEach((chapter, i) => {
    if (titled && !chapter.title) return;
    const button = h(
      "button",
      { type: "button", "aria-current": i === session?.chapter ? "true" : undefined },
      chapterLabel(book, i),
    );
    button.addEventListener("click", () => {
      dialog.close();
      void showChapter(i, { offset: 0, focus: true });
    });
    list.append(h("li", {}, button));
  });
  const close = h("button", { class: "primary", type: "button" }, t.settings.close);
  const dialog = h(
    "dialog",
    { class: "sheet", "aria-labelledby": "contents-title" },
    h("h2", { id: "contents-title" }, t.convert.labels.contents),
    list,
    close,
  );
  close.addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => dialog.remove());
  document.body.append(dialog);
  dialog.showModal();
  dialog.querySelector<HTMLElement>('[aria-current="true"]')?.focus();
}

async function showChapter(
  index: number,
  where: { offset?: number; anchor?: string; focus?: boolean } = {},
) {
  if (!session?.article) return;
  const current = session;
  const article = current.article as HTMLElement;
  const total = current.book.chapters.length;
  const i = Math.min(Math.max(0, index), Math.max(0, total - 1));
  const rendered = await current.book.render(i, document);
  if (session !== current) {
    rendered.release();
    return;
  }
  current.controller?.stop();
  current.rendered?.release();
  current.controller = null;
  current.rendered = rendered;
  current.chapter = i;
  article.replaceChildren(rendered.fragment);
  if (!article.textContent?.trim() && !article.querySelector("img, svg")) {
    article.append(h("p", { class: "empty" }, t.app.reader.empty));
  }
  if (prefs.enabled) current.controller = applyToElement(article, emphasisOptions());
  updatePager();

  const restore = () => {
    const target = where.anchor ? document.getElementById(ID_PREFIX + where.anchor) : null;
    if (target) target.scrollIntoView();
    else window.scrollTo(0, (where.offset ?? 0) * maxScroll());
  };
  restore();
  if (where.focus) article.focus({ preventScroll: true });
  // Emphasis can change line breaks slightly: restore again once it is in place.
  await current.controller?.idle;
  if (session === current && where.offset) restore();
  savePosition();
}

const pager = {
  previous: h("button", { type: "button", class: "previous" }),
  next: h("button", { type: "button", class: "next" }),
  position: h("p", { class: "position" }),
};
pager.previous.addEventListener("click", () => {
  if (session) void showChapter(session.chapter - 1, { offset: 0, focus: true });
});
pager.next.addEventListener("click", () => {
  if (session) void showChapter(session.chapter + 1, { offset: 0, focus: true });
});

function updatePager() {
  if (!session) return;
  const total = session.book.chapters.length;
  pager.previous.textContent = t.app.reader.previous;
  pager.next.textContent = t.app.reader.next;
  pager.previous.disabled = session.chapter <= 0;
  pager.next.disabled = session.chapter >= total - 1;
  pager.position.textContent = format(t.app.reader.position, { n: session.chapter + 1, total });
  // A single text needs no chapter navigation.
  for (const el of [pager.previous, pager.position, pager.next]) el.hidden = total <= 1;
}

function onArticleClick(event: MouseEvent) {
  const link = (event.target as Element).closest?.("a[data-anchor]");
  if (!link || !session) return;
  event.preventDefault();
  const path = link.getAttribute("data-path") ?? "";
  const anchor = link.getAttribute("data-anchor") ?? "";
  if (!path) {
    document.getElementById(ID_PREFIX + anchor)?.scrollIntoView();
    return;
  }
  const index = session.book.indexOf(path);
  if (index >= 0) void showChapter(index, { anchor, focus: true });
}

async function showReader(id: string) {
  let current = session?.id === id ? session : null;
  if (!current) {
    closeSession();
    app.replaceChildren(
      h("main", { id: "main", class: "loading", "aria-busy": "true" }, t.app.library.opening),
      status,
    );
    const entry = await library.get(id);
    if (!entry) {
      announce(t.app.library.missing);
      location.replace("#/");
      return;
    }
    let book: Book;
    try {
      book = await openBook(entry.file, entry.record.format);
    } catch (error) {
      const code = error instanceof ConvertError ? error.code : "invalid";
      announce(t.convert.errors[code]);
      // A book we cannot open would only get in the way.
      await library.remove(id);
      location.replace("#/");
      return;
    }
    const record = await library.touch(entry.record, book.title);
    current = { id, record, book, chapter: 0 };
    session = current;
  }

  const { book, record } = current;
  document.title = `${record.title} · ${BRAND.name}`;
  const article = h("article", {
    class: "page",
    tabindex: -1,
    lang: book.lang ?? undefined,
    "aria-label": record.title,
  });
  article.addEventListener("click", onArticleClick);
  current.article = article;
  current.controller = null;

  const back = h("a", { class: "back", href: "#/" }, t.app.reader.library);
  const contents = h("button", { type: "button", class: "ghost" }, t.convert.labels.contents);
  contents.addEventListener("click", contentsDialog);
  contents.hidden = book.chapters.length <= 1;
  const settings = h("button", { type: "button", class: "ghost" }, t.app.reader.settings);
  settings.addEventListener("click", openSettings);

  app.replaceChildren(
    h(
      "header",
      { class: "top reader-bar" },
      back,
      h("h1", { class: "book-title" }, record.title),
      h("div", { class: "tools" }, contents, settings),
    ),
    h("main", { id: "main", class: "reader" }, article),
    h(
      "nav",
      { class: "pager", "aria-label": t.convert.labels.contents },
      pager.previous,
      pager.position,
      pager.next,
    ),
    status,
  );
  const position = library.position(id);
  await showChapter(position?.chapter ?? current.chapter, { offset: position?.offset ?? 0 });
}

// ─── Routing and start ───────────────────────────────────────────────────────

async function importInbox() {
  const items = await takeInbox();
  for (const item of items) {
    if ("blob" in item) await importFile(item.blob, item.name, item.type);
    else await importText(item.text, item.title);
  }
  if (!items.length) location.replace("#/");
}

async function route() {
  const read = location.hash.match(/^#\/read\/([\w-]+)$/);
  if (read?.[1]) await showReader(read[1]);
  else if (location.hash === "#/inbox") await importInbox();
  else await showLibrary();
}

async function changeLanguage() {
  const lang = prefs.lang ?? pickLang(navigator.languages ?? [navigator.language]);
  t = await loadStrings(lang);
  root.lang = lang;
  const open = document.querySelector("dialog[open]");
  open?.remove();
  await route();
  if (open) openSettings();
}

/** Closes the top dialog, or leaves the reader. False when there is nowhere to go back to. */
function goBack(): boolean {
  const open = document.querySelector<HTMLDialogElement>("dialog[open]");
  if (open) {
    open.close();
    return true;
  }
  if (location.hash.startsWith("#/read/")) {
    location.hash = "#/";
    return true;
  }
  return false;
}

type LaunchParams = { files?: { getFile(): Promise<File> }[] };
type LaunchQueue = { setConsumer(consumer: (params: LaunchParams) => void): void };

async function start() {
  applyAppearance();
  await changeLanguage();
  window.addEventListener("hashchange", () => void route());
  window.addEventListener(SETTINGS_EVENT, (event) => {
    const { settings, source } = (
      event as CustomEvent<{ settings: ReadingSettings; source: unknown }>
    ).detail;
    if (source instanceof HTMLFormElement) return;
    emphasisSettings = settings;
    applyAppearance();
    refreshEmphasis();
  });

  await setupNative({ open: (file, name) => void importFile(file, name), back: goBack });

  // Installed web app on desktop Chromium: files opened with the app.
  const launchQueue = (window as unknown as { launchQueue?: LaunchQueue }).launchQueue;
  launchQueue?.setConsumer(async ({ files }) => {
    for (const handle of files ?? []) {
      const file = await handle.getFile();
      await importFile(file, file.name, file.type);
    }
  });

  if (!isNative() && "serviceWorker" in navigator && import.meta.env.PROD) {
    navigator.serviceWorker.register("./sw.js").catch(() => undefined);
  }
}

void start();
