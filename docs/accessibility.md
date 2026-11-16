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

## Line ruler

An optional reading guide in the extension ("More options" → "Line ruler"): it either highlights the current line or darkens the lines above and below it.

- It follows the pointer (or a tap on touch screens), the text cursor when caret browsing is on (`F7` in Chrome and Firefox: move line by line with `↑/↓`), and keyboard focus (`Tab`).
- It is a fixed overlay in a closed shadow root, outside `<body>`: page text, layout and the accessibility tree are untouched. It is `aria-hidden`, ignores the pointer (`pointer-events: none`) and is removed completely when emphasis is turned off.
- Light and dark colour schemes have their own tints; in forced-colours mode (Windows high contrast) the band becomes a `Highlight` outline. With `prefers-reduced-motion: reduce` it jumps from line to line without animating.

## Read aloud

The extension popup can read the page aloud with the browser's own text-to-speech (`speechSynthesis`), without any server.

- **What it reads:** the selected text; otherwise from the word where you clicked (the text caret); otherwise from the first paragraph in view. It skips scripts, form fields, hidden and `aria-hidden` content, and goes block by block, so very long pages work.
- **Controls:** Start / Pause / Resume and Stop buttons, speed (0.5×–2×) and voice in the popup; "Read aloud" in the right-click menu; an optional keyboard shortcut ("Read aloud, pause or resume"), unassigned by default — set one in the browser's shortcut settings.
- **Voices:** only on-device voices (`localService: true`). Chrome lists online "Google" voices and Edge lists online "Natural" voices that send the text to the vendor's servers; they are never offered or used. The voice is picked by the language of the page (or of the element's `lang`), and you can choose one per language. If the device has no voice for the language, the popup says so: add voices in the operating system's speech settings (Windows: Settings → Time & language → Speech; macOS: System Settings → Accessibility → Spoken content; Android: Text-to-speech output; Linux: speech-dispatcher with e.g. espeak-ng).
- **Following along:** the word being read is marked with the CSS Custom Highlight API (`::highlight`, system colours `Mark`/`MarkText`, so it works in dark and forced-colours modes) and scrolled into view when it leaves the screen (without smooth scrolling under `prefers-reduced-motion`). The page's DOM and text are not modified. Browsers without the Highlight API, or engines that send no word boundaries, still read but without marking words.
- **Screen readers:** if you use one, it already reads the page; this feature is meant for people who read visually and want to hear the text at the same time.

## Reading mode

"More options" → "Reading mode" (or an optional keyboard shortcut, unassigned by default) shows the page's main article in a clean view, extracted on the device with Mozilla's Readability (bundled; no network).

- It is a full-page modal `<dialog>` in a closed shadow root: the page underneath becomes inert, focus moves to the "Close reading mode" button, `Esc` closes it and focus returns to the page. The page's DOM is not modified.
- Emphasis is applied with the same settings as the extension: strength, style, "1 of every N words", line spacing and maximum line width (65 characters when the page default is chosen). Changes in the popup apply while the view is open.
- Its own light and dark themes follow `prefers-color-scheme`; the dialog is labelled by the article title and keeps the article's language and direction (`lang`, `dir`) for screen readers and right-to-left scripts.
- The article is sanitized before display: scripts, frames, forms, inline styles, event handlers and `javascript:` links are removed.
- Known limits: the line ruler and read aloud work on the page, not inside the reading view; pages without a recognisable article show "No article found on this page."
