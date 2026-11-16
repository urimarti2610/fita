// Reading mode. Injected on demand only (it bundles Readability), separate from content.js.
import { EXTENSION_BRAND } from "../brand.js";
import { createReaderView, extractArticle } from "./reader-view.js";
import {
  type ContentMessage,
  loadSiteState,
  type ReaderMessage,
  type ReaderReply,
  siteOrigin,
} from "./settings.js";

const LOADED_FLAG = `__${EXTENSION_BRAND.id}ReaderLoaded`;
const scope = globalThis as unknown as Record<string, boolean>;
if (!scope[LOADED_FLAG]) {
  scope[LOADED_FLAG] = true;
  main();
}

function main() {
  const origin = siteOrigin(location.href);
  const view = createReaderView(document, { close: chrome.i18n.getMessage("readerClose") });

  async function open(): Promise<ReaderReply> {
    const { settings } = await loadSiteState(origin);
    const article = extractArticle(document);
    if (!article) return { open: false, error: "noArticle" };
    view.open(article, settings);
    return { open: true };
  }

  chrome.runtime.onMessage.addListener(
    (
      message: ReaderMessage | ContentMessage,
      _sender,
      sendResponse: (reply: ReaderReply) => void,
    ) => {
      // Live preview from the popup; the emphasis content script answers it.
      if (message.type === "preview") {
        view.update(message.settings);
        return;
      }
      if (message.type !== "reader") return;
      if (!(message.open ?? !view.isOpen)) {
        view.close();
        sendResponse({ open: false });
        return;
      }
      open().then(sendResponse);
      return true; // async response
    },
  );

  chrome.storage.onChanged.addListener(async (_changes, area) => {
    if (area === "sync" && view.isOpen) view.update((await loadSiteState(origin)).settings);
  });
}
