import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Carrega variáveis de ambiente do arquivo .env no mesmo diretório deste config
dotenv.config({ path: path.join(__dirname, '.env') });

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
