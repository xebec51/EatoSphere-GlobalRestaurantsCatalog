import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 1,
  use: {
    headless: true,
    baseURL: 'http://localhost:8080',
    video: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  expect: {
    timeout: 5000, // Timeout per assertion (ms)
  },
});