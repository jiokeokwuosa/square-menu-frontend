import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  use: {
    baseURL: "http://localhost:3002",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command:
      "NEXT_PUBLIC_API_BASE_URL=http://localhost:4010/api npm run dev -- --port 3002",
    url: "http://localhost:3002",
    reuseExistingServer: true,
    timeout: 120000,
  },
});
