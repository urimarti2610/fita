import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { conditions: ["@fita/source"] },
  ssr: { resolve: { conditions: ["@fita/source"], externalConditions: ["@fita/source"] } },
  test: { include: ["test/**/*.test.ts"] },
});
