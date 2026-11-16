import type { CapacitorConfig } from "@capacitor/cli";
import { MOBILE_BRAND } from "./brand.ts";

// Native shells (android/, ios/) wrap the reader built into dist/ by
// `pnpm build:native`. Nothing is loaded from the network: the app ships its files.
const config: CapacitorConfig = {
  appId: MOBILE_BRAND.appId,
  appName: MOBILE_BRAND.name,
  webDir: "dist",
  backgroundColor: MOBILE_BRAND.paper,
  android: {
    allowMixedContent: false,
    webContentsDebuggingEnabled: false,
  },
};

export default config;
