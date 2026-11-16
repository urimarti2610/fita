# Mobile app (`apps/mobile`)

A small reader for Android and iOS with the same emphasis engine as the extension and the website (`@fita/core`). One code base, three ways to run it:

| Target | How | Status |
| --- | --- | --- |
| **Installable web app (PWA)** | `pnpm --filter @fita/mobile build` → `apps/mobile/dist/`. Deployed with the website at `https://fitaread.com/app/` (`.github/workflows/web.yml`). | Works offline, installable on Android and iOS ("Add to Home Screen"). |
| **Android** | Capacitor shell in `apps/mobile/android/` (committed). | CI builds a debug APK on every push (`android` job, artifact `fita-android-debug`). Not published anywhere. |
| **iOS** | Capacitor shell, generated on a Mac (`ios/` is not committed yet). | Needs a Mac with Xcode. |

## What it does

- Opens **EPUB, TXT, Markdown and HTML** from the device (file picker; on Android also "Open with" from file managers and other apps; on the installed web app, "Share" on Android and "Open with" on desktop Chromium), or a **pasted text**.
- Reads them chapter by chapter in a scrolling reader with the same controls as the website: emphasis on/off, strength, style (5), "1 of every N words", line spacing, line width, plus text size, light/dark/system theme and interface language.
- Remembers the library (IndexedDB), the reading position of each book and the settings (localStorage), **only on the device**. Emphasis settings are shared with the website when both run on the same origin.
- EPUB parsing reuses the website's converter modules (`apps/web/src/convert`): DRM detection, spine, language. Chapters are parsed one at a time; only the current one is in the DOM.
- Book markup is **sanitized** with an allow list (no scripts, styles, forms, frames or event handlers; ids are prefixed) and a strict Content Security Policy blocks any network request: images come only from inside the book (`blob:`) or `data:` URLs, so a book cannot phone home.
- Accessibility: emphasis uses the same `<fita-w>`/`<fita-e>` elements as the extension, so TalkBack and VoiceOver read the text unchanged (checked by tests); 48 px touch targets; keyboard usable; respects the device text size and dark mode.
- Interface in the website's 27 languages: shared strings come from `apps/web/src/locales`, app-only strings from `apps/mobile/src/locales` (`en.ts` defines the shape).

## Development

```sh
pnpm --filter @fita/mobile dev        # http://localhost:5173
pnpm --filter @fita/mobile test       # Vitest (reader logic, sanitizer, i18n)
pnpm --filter @fita/mobile build      # web build (PWA) in dist/
pnpm --filter @fita/mobile e2e        # Playwright smoke test against the build
```

The native shells load a build made with `--mode native` (`pnpm --filter @fita/mobile build:native`). The only difference: Android's Capacitor bridge is injected as an inline script, so the native CSP allows inline scripts.

The Capacitor CLI asks once whether to share anonymous usage data. Answer no, or run `pnpm --filter @fita/mobile exec cap telemetry off` first (CI does).

## Android

Requirements: JDK 21 and Android Studio (or the Android SDK command-line tools with platform 36).

```sh
pnpm install
pnpm --filter @fita/mobile sync                 # build:native + cap sync (copies dist/ into android/)
cd apps/mobile/android
./gradlew assembleDebug                         # app/build/outputs/apk/debug/app-debug.apk
adb install app/build/outputs/apk/debug/app-debug.apk
```

Or open the project in Android Studio with `pnpm --filter @fita/mobile android`.

**Release build (for the Play Store or F-Droid; nothing is published automatically):**

1. Create an upload key once and keep it out of the repository:
   `keytool -genkeypair -v -keystore fita-upload.jks -alias fita -keyalg RSA -keysize 2048 -validity 10000`
2. Raise `versionCode` and `versionName` in `apps/mobile/android/app/build.gradle`.
3. `pnpm --filter @fita/mobile sync`, then in Android Studio: *Build → Generate Signed App Bundle* (`.aab` for Google Play) or APK (F-Droid, direct download).
4. Store listing: the privacy answer is "no data collected". The only permission is `INTERNET`, kept from the Capacitor template; the app makes no network requests (its Content Security Policy blocks them).

Launcher icons and launch screens are rendered from the wordmark by `node apps/web/scripts/og-image.mjs` (it updates `android/app/src/main/res` when the folder exists).

The application id is `com.fitaread.app`, derived from `BRAND.website` in `apps/mobile/brand.ts`. Change it **before** the first store release: a different id is a different app.

## iOS

Requirements: a Mac with Xcode 16 or later (and an Apple Developer account to install on devices or publish).

```sh
pnpm install
pnpm --filter @fita/mobile exec cap add ios     # once: creates apps/mobile/ios/ (commit it)
pnpm --filter @fita/mobile ios                  # build:native + cap sync ios + open Xcode
```

Then in Xcode: set the signing team, and to make "Open in…" work for books add document types to `ios/App/App/Info.plist` (`CFBundleDocumentTypes` for `org.idpf.epub-container`, `public.plain-text`, `net.daringfireball.markdown`, `public.html`, with `LSSupportsOpeningDocumentsInPlace` = `NO`). Opened files arrive through the same `appUrlOpen` handler as on Android. App icons: drag `apps/mobile/public/icons/icon-512.png` (1024 px recommended; re-render it larger with the script) into `Assets.xcassets/AppIcon`.

Without the App Store, iOS users can install the web app from Safari: open `https://fitaread.com/app/`, Share → *Add to Home Screen*. It works offline.

## Not done yet

- Android "Share to" (`ACTION_SEND`) in the native app needs a small native plugin; "Open with" (`ACTION_VIEW`) works. The installed web app on Android does accept shares.
- Paginated (page-turning) mode: the reader scrolls.
- iOS project not generated or tested in CI (needs macOS runners).
