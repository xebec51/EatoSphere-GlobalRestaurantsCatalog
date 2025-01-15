import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.test.js',
  timeout: 60000,
  retries: 2,
  use: {
    headless: true,
    baseURL: 'http://localhost:8080',
    viewport: { width: 1280, height: 720 },
    trace: 'off',
    video: 'off',
    screenshot: 'off',
  },
  reporter: 'line',
  hooks: {
    async beforeEach({ page }) {
      // Nonaktifkan Service Worker
      await page.addInitScript(() => {
        navigator.serviceWorker?.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister();
          }
        });
      });

      // Route untuk data mock daftar restoran
      await page.route('**/restaurant-api.dicoding.dev/list', (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            restaurants: [
              { id: 'r1', name: 'Mock Restaurant', city: 'Mock City', rating: 4.5, pictureId: 'mock-img' },
            ],
          }),
        })
      );

      // Route untuk data mock detail restoran
      await page.route('**/restaurant-api.dicoding.dev/detail/*', (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            restaurant: {
              id: 'r1',
              name: 'Mock Restaurant',
              city: 'Mock City',
              rating: 4.5,
              pictureId: 'mock-img',
              menus: { foods: [{ name: 'Mock Food' }], drinks: [{ name: 'Mock Drink' }] },
              customerReviews: [],
            },
          }),
        })
      );
    },
  },
});
