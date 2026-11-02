# Privacy tab answers

Paste these into **Privacy** in the Developer Dashboard. The store requires English here.

## Single purpose

> Reading aid: it emphasizes the beginning of each word on web pages to make reading more comfortable for people with ADHD and dyslexia. All processing happens locally in the browser.

## Permission justifications

| Permission | Justification |
| --- | --- |
| `activeTab` | Applies word emphasis to the current tab only when the user turns it on (toolbar button, keyboard shortcut or context menu), without permanent access to any site. |
| `scripting` | Injects the extension's own bundled content script and stylesheet into the current tab to apply and remove the emphasis, and registers them for the sites where the user chose "Always on". No remote code. |
| `storage` | Saves the user's settings (strength, style, sites where it is always on) with chrome.storage.sync. Nothing is sent to us. |
| `contextMenus` | Adds a "Turn on for this site" item to the right-click menu. |
| Host permissions (optional, `*://*/*`) | Requested at runtime, only when the user chooses "Always on this site" (that site only) or "On all sites", so the emphasis can be applied automatically when those pages load. Not requested at install. The user can revoke it at any time. |

## Remote code

**No, I am not using remote code.** All JavaScript is bundled in the package. The extension makes no network requests.

## Data usage

Tick **none** of the data types (personally identifiable information, health information, financial information, authentication information, personal communications, location, web history, user activity, website content).

The extension reads the text of pages only to emphasize it in place, in the browser. That content never leaves the device and is not collected, stored or transmitted.

Then certify all three statements:

- [x] I do not sell or transfer user data to third parties, outside of the approved use cases.
- [x] I do not use or transfer user data for purposes that are unrelated to my item's single purpose.
- [x] I do not use or transfer user data to determine creditworthiness or for lending purposes.

## Privacy policy URL

`https://fitaread.com/en/privacy/` (until the domain resolves: `https://github.com/urimarti2610/fita/blob/main/PRIVACY.md`).
