import { BRAND, escapeHTML, MAX_STRENGTH, MIN_STRENGTH } from "@fita/core";
import type { Messages } from "./i18n.js";
import { DOC_STYLES, type DocStyle, type Settings } from "./plan.js";

const STYLE_LABEL: Record<DocStyle, keyof Messages> = {
  bold: "styleBold",
  color: "styleColor",
  underline: "styleUnderline",
};

/** JSON safe to embed in a <script> element. */
function scriptJSON(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

/**
 * The sidebar page. Self-contained: no external scripts, fonts or styles. It talks to
 * the add-on only through `google.script.run`, which stays inside Google Docs.
 */
export function sidebarHtml(t: Messages, settings: Settings, lang: string): string {
  const h = escapeHTML;
  const styles = DOC_STYLES.map(
    (style) =>
      `<label class="choice"><input type="radio" name="style" value="${style}"${
        style === settings.style ? " checked" : ""
      }> ${h(t[STYLE_LABEL[style]])}</label>`,
  ).join("\n");
  return `<!doctype html>
<html lang="${h(lang)}">
<head>
<meta charset="utf-8">
<title>${h(BRAND.name)}</title>
<style>
:root { color-scheme: light dark; --fg: #1f1f1f; --bg: #ffffff; --muted: #4d4d4d; --accent: #1f4fae; --line: #c7c7c7; }
@media (prefers-color-scheme: dark) { :root { --fg: #ececec; --bg: #1f1f1f; --muted: #bdbdbd; --accent: #8fb3ff; --line: #5a5a5a; } }
body { margin: 0; padding: 16px; font: 14px/1.5 system-ui, sans-serif; color: var(--fg); background: var(--bg); }
p { margin: 0 0 12px; }
.muted { color: var(--muted); font-size: 13px; }
fieldset { border: 1px solid var(--line); border-radius: 8px; margin: 0 0 16px; padding: 8px 12px 12px; }
legend { font-weight: 600; padding: 0 4px; }
.choice { display: block; padding: 4px 0; }
input[type=range] { width: 100%; accent-color: var(--accent); }
.scale { display: flex; justify-content: space-between; font-size: 12px; color: var(--muted); }
button { display: block; width: 100%; margin: 0 0 8px; padding: 8px 12px; font: inherit; border-radius: 6px; border: 1px solid var(--accent); background: var(--accent); color: var(--bg); cursor: pointer; }
button.secondary { background: transparent; color: var(--accent); }
button:focus-visible, input:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }
button:disabled { opacity: 0.6; cursor: progress; }
#status { min-height: 1.5em; font-weight: 600; }
</style>
</head>
<body>
<p>${h(t.intro)}</p>
<fieldset>
<legend><label for="strength">${h(t.strength)}</label></legend>
<input id="strength" type="range" min="${MIN_STRENGTH}" max="${MAX_STRENGTH}" step="0.05" value="${settings.strength}">
<div class="scale" aria-hidden="true"><span>${h(t.lighter)}</span><span>${h(t.stronger)}</span></div>
</fieldset>
<fieldset>
<legend>${h(t.style)}</legend>
${styles}
</fieldset>
<button type="button" data-action="emphasizeDocument">${h(t.menuDocument)}</button>
<button type="button" data-action="emphasizeSelection">${h(t.menuSelection)}</button>
<button type="button" data-action="removeEmphasis" class="secondary">${h(t.menuRemove)}</button>
<p id="status" role="status" aria-live="polite"></p>
<p class="muted">${h(t.help)}</p>
<p class="muted">${h(t.privacy)}</p>
<script>
const t = ${scriptJSON({ working: t.working, error: t.error })};
const status = document.getElementById("status");
const buttons = document.querySelectorAll("button[data-action]");
function settings() {
  return {
    source: "sidebar",
    strength: Number(document.getElementById("strength").value),
    style: document.querySelector("input[name=style]:checked").value,
  };
}
function busy(on) { for (const b of buttons) b.disabled = on; }
for (const button of buttons) {
  button.addEventListener("click", () => {
    busy(true);
    status.textContent = t.working;
    google.script.run
      .withSuccessHandler((message) => { busy(false); status.textContent = message; })
      .withFailureHandler((error) => { busy(false); status.textContent = t.error.replace("{message}", error.message); })
      [button.dataset.action](settings());
  });
}
</script>
</body>
</html>`;
}
