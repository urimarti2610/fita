import type {
  ContentMessage,
  ContentReply,
  ReaderMessage,
  ReaderReply,
  SpeechMessage,
} from "./settings.js";
import type { SpeechAction, SpeechState } from "./speech.js";

export const CONTENT_JS = "content.js";
export const CONTENT_CSS = "content.css";
export const READER_JS = "reader.js";

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
  await ensureContent(tabId);
  const message: ContentMessage =
    enabled === undefined ? { type: "set" } : { type: "set", enabled };
  return (await chrome.tabs.sendMessage(tabId, message)) as ContentReply;
}

/** Injects the content script (and its stylesheet) unless it already runs in the tab. */
export async function ensureContent(tabId: number) {
  if ((await getTabState(tabId)) !== null) return;
  await chrome.scripting.insertCSS({ target: { tabId }, files: [CONTENT_CSS] });
  await chrome.scripting.executeScript({ target: { tabId }, files: [CONTENT_JS] });
}

/** Read-aloud control. "state" only asks, and never injects anything. */
export async function speakTab(tabId: number, action: SpeechAction): Promise<SpeechState | null> {
  const message: SpeechMessage = { type: "speech", action };
  if (action === "state") {
    try {
      return (await chrome.tabs.sendMessage(tabId, message)) as SpeechState;
    } catch {
      return null;
    }
  }
  await ensureContent(tabId);
  return (await chrome.tabs.sendMessage(tabId, message)) as SpeechState;
}

/** Opens, closes or toggles reading mode, injecting its script on demand. */
export async function setReader(tabId: number, open?: boolean): Promise<ReaderReply> {
  await chrome.scripting.executeScript({ target: { tabId }, files: [READER_JS] });
  const message: ReaderMessage = open === undefined ? { type: "reader" } : { type: "reader", open };
  return (await chrome.tabs.sendMessage(tabId, message)) as ReaderReply;
}
