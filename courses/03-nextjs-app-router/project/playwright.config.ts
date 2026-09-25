import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for E2E testing
 * Tests visual output and user interactions
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'json',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npx next dev -H 127.0.0.1 -p 3000',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: true,
    timeout: 120 * 1000,
    env: {
      NEXT_IGNORE_INCORRECT_LOCKFILE: '1',
    },
  },
});
