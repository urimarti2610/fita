import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { conditions: ["@fita/source"] },
  test: { include: ["test/**/*.test.ts"] },
});
