import { Capacitor } from "@capacitor/core";

/**
 * Glue for the Android and iOS shells. In the browser (installed web app) nothing
 * here runs. Plugins are local: they read the file the system hands over and
 * listen to the hardware back button; none of them talks to the network.
 */
export const isNative = () => Capacitor.isNativePlatform();

export type NativeHandlers = {
  /** A file the person opened with the app ("Open with" on Android, document types on iOS). */
  open(file: Blob, name: string): void;
  /** Hardware back button: returns false when there is nothing to go back to. */
  back(): boolean;
};

function base64ToBytes(base64: string): Uint8Array<ArrayBuffer> {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Best guess at a file name from a content:// or file:// URL. */
export function nameFromUrl(url: string): string {
  let path = url.split(/[?#]/)[0] ?? "";
  try {
    path = decodeURIComponent(path);
  } catch {
    // Keep the encoded form.
  }
  return path.split(/[/:]/).filter(Boolean).pop() ?? "";
}

export async function setupNative(handlers: NativeHandlers) {
  if (!isNative()) return;
  const [{ App }, { Filesystem }] = await Promise.all([
    import("@capacitor/app"),
    import("@capacitor/filesystem"),
  ]);

  await App.addListener("backButton", () => {
    if (!handlers.back()) void App.exitApp();
  });

  const openUrl = async (url: string) => {
    if (!/^(?:content|file):/i.test(url)) return;
    try {
      const { data } = await Filesystem.readFile({ path: url });
      const file = typeof data === "string" ? new Blob([base64ToBytes(data)]) : data;
      handlers.open(file, nameFromUrl(url));
    } catch {
      // The other app revoked access or the file is gone: nothing to open.
    }
  };
  await App.addListener("appUrlOpen", ({ url }) => void openUrl(url));
  const launch = await App.getLaunchUrl();
  if (launch?.url) await openUrl(launch.url);
}
