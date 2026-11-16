import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@web": fileURLToPath(new URL("../web/src", import.meta.url)) },
    conditions: ["@fita/source"],
  },
  ssr: { resolve: { conditions: ["@fita/source"], externalConditions: ["@fita/source"] } },
  test: { include: ["test/**/*.test.ts"], environment: "happy-dom" },
});
