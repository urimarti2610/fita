# Contributing

Thank you for helping! Please read the [Code of Conduct](CODE_OF_CONDUCT.md) first.

## Ground rules

These are not negotiable — pull requests that break them cannot be merged:

1. **Client-side only.** No servers, serverless functions, APIs or databases.
2. **No limits** on words, file sizes, usage or languages. Process large inputs in chunks.
3. **No network requests**, analytics, cookies or third-party CDNs. Bundle everything.
4. **Trademark-safe wording.** Describe the product as "reading aids", "word emphasis" or "anchor points". Do not name or compare with other commercial reading products. Never promise faster reading.
5. **Accessibility.** Processed text must read identically with screen readers, be keyboard-usable, keep good contrast and support dark mode.

## Workflow

- Node 22, pnpm 10. Run `pnpm install`, then `pnpm lint && pnpm typecheck && pnpm test && pnpm build` before opening a PR.
- Code and comments in English. All user-facing strings go through the translation files (`es`, `ca`, `en`).
- Prefer the web platform (`Intl`, `TreeWalker`, `DOMParser`) over new dependencies. Every new dependency must be justified in the commit message.
- The provisional name lives in `packages/core/src/brand.ts` and `apps/*/brand.*`. Never hard-code it elsewhere.
