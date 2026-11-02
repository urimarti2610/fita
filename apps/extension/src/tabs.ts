import type { ContentMessage, ContentReply } from "./settings.js";

export const CONTENT_JS = "content.js";
export const CONTENT_CSS = "content.css";

/** Current state of the content script in a tab, or null if it is not running there. */
export async function getTabState(tabId: number): Promise<ContentReply | null> {
  try {
    const message: ContentMessage = { type: "get" };
    return (await chrome.tabs.sendMessage(tabId, message)) as ContentReply;
  } catch {
    return null;
  }
}

/** Turns emphasis on/off in a tab, injecting the content script if needed. `undefined` toggles. */
export async function setTab(tabId: number, enabled?: boolean): Promise<ContentReply> {
  if ((await getTabState(tabId)) === null) {
    await chrome.scripting.insertCSS({ target: { tabId }, files: [CONTENT_CSS] });
    await chrome.scripting.executeScript({ target: { tabId }, files: [CONTENT_JS] });
  }
  const message: ContentMessage =
    enabled === undefined ? { type: "set" } : { type: "set", enabled };
  return (await chrome.tabs.sendMessage(tabId, message)) as ContentReply;
}
