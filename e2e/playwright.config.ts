import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: '.',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // Testes de API — sem browser, executados uma única vez
    {
      name: 'api',
      testMatch: '**/tests/api/**/*.spec.ts',
    },
    // Testes E2E — requerem browser, executados em Chromium e Firefox
    {
      name: 'chromium',
      testMatch: '**/tests/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testMatch: '**/tests/*.spec.ts',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
