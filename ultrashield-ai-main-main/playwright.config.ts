import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/test',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:8080',
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
    ignoreHTTPSErrors: true,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
