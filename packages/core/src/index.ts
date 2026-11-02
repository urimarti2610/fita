export { BRAND, EMPHASIS_TAG, WRAP_TAG } from "./brand.js";
export {
  type ApplyConfig,
  applyToElement,
  type Controller,
  EMPHASIS_CLASS,
  EMPHASIS_CSS,
  EMPHASIS_STYLES,
  type EmphasisStyle,
  SKIP_SELECTOR,
  STYLE_ATTRIBUTE,
  WRAP_CLASS,
} from "./dom.js";
export {
  createEmphasizer,
  DEFAULT_OPTIONS,
  type EmphasisOptions,
  emphasisCount,
  emphasize,
  escapeHTML,
  MAX_STRENGTH,
  MIN_STRENGTH,
  resolveOptions,
  type Span,
  toHTML,
} from "./emphasize.js";
export {
  createMarkupEmphasizer,
  type MarkupConfig,
  REST_CLASS,
  staticEmphasisCSS,
} from "./markup.js";
