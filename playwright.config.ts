import { defineConfig, devices } from "@playwright/test";

// Runs against the production build (`npm run build` first).
// :3100 builds every message with nodemailer's jsonTransport (nothing is sent).
// :3101 points at a closed SMTP port to exercise the real provider-failure path.
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  use: { baseURL: "http://localhost:3100", locale: "de-AT" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] }, testMatch: /(responsive|contact-links)\.spec\.ts/ },
  ],
  webServer: [
    {
      command: "npx next start -p 3100",
      url: "http://localhost:3100",
      reuseExistingServer: true,
      env: { MAIL_TRANSPORT: "json", ANFRAGE_RATE_LIMIT: "1000" },
    },
    {
      command: "npx next start -p 3101",
      url: "http://localhost:3101",
      reuseExistingServer: true,
      env: { SMTP_HOST: "127.0.0.1", SMTP_PORT: "9", SMTP_USER: "test@example.invalid", SMTP_PASSWORD: "x" },
    },
  ],
});
