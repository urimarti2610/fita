# Accessibility

Emphasis must never change what assistive technology reads.

## How the text stays intact

- Each processed text node is replaced by one inline `<fita-w>` element containing the same text, with the emphasized parts in `<fita-e>`. No characters are added or removed, no ARIA attributes are needed.
- Automated test (`packages/core/test/dom.test.ts`): the container's `textContent` is identical before and after processing, and undo restores the exact original DOM.
- Text inside form fields, editors, code, `[contenteditable]` and `[aria-hidden="true"]` is never touched.
- Emphasis colours are derived from the text's own colour (`color-mix` with `currentColor`), so contrast holds on light, dark and custom themes. Styles: bold, colour, soft underline, fade the rest of the word.

## Manual screen reader check

Run before every release, on a long article (e.g. a Wikipedia page) with emphasis on and off. The reading must be identical: whole words, no letter-by-letter spelling, no extra pauses inside words.

| Screen reader | Browser | Steps |
| --- | --- | --- |
| NVDA (Windows) | Firefox, Chrome | Browse mode: read all (`NVDA+↓`); read word by word (`Ctrl+←/→`); read by line (`↑/↓`); list links (`NVDA+F7`). |
| VoiceOver (macOS) | Safari is not supported; use Chrome | Read all (`VO+A`); word by word (`VO+→` in word mode); rotor links list (`VO+U`). |
| VoiceOver (iOS) / TalkBack (Android) | Firefox for Android | Swipe through a paragraph; read from top. |

Record the result (date, versions, pass/fail, notes) in the release notes. Known risk: some screen reader/browser pairs announce inline element boundaries inside words. If that appears, report it with versions so we can test alternatives.

## Keyboard

- Extension popup: every control is reachable with `Tab`, toggles with `Space`, sliders with arrow keys. Visible focus ring.
- `Alt+B` toggles emphasis on the current tab (changeable in the browser's shortcut settings).
