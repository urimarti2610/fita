import { defineConfig } from "@playwright/test";

const PORT = 4330;

export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: `http://localhost:${PORT}` },
  webServer: {
    command: `pnpm exec astro preview --port ${PORT} --ignore-lock`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
  },
});
