import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  reporter: "list",
  timeout: 45_000,
  use: {
    baseURL: "http://localhost:3100",
    locale: "fr-FR",
  },
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3100",
    reuseExistingServer: true,
    timeout: 240_000,
    env: { SMTP_MOCK: "1", PORT: "3100" },
  },
  // Sur macOS 14, Playwright 1.65 ne pilote plus son WebKit figé : voir PROGRESS.md.
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
