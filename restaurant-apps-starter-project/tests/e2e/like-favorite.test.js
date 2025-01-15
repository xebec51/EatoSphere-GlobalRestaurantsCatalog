import { test, expect } from '@playwright/test';

test.describe('Favorite Restaurants E2E Test', () => {
  test('should add a restaurant to favorite and remove it', async ({ page }) => {
    console.log('Navigating to the main page...');
    await page.goto('http://localhost:8080/');

    console.log('Checking mock data response...');
    const response = await page.waitForResponse('**/restaurant-api.dicoding.dev/list');
    console.log('Mock response received:', await response.json());

    console.log('Validating restaurant list is visible...');
    const restaurantList = await page.waitForSelector('.restaurant-list', { timeout: 20000 });
    if (!restaurantList) {
      throw new Error('Restaurant list not found.');
    }

    const restaurantCards = page.locator('.restaurant-card');
    const restaurantCount = await restaurantCards.count();
    console.log('Number of restaurants:', restaurantCount);
    expect(restaurantCount).toBeGreaterThan(0);

    console.log('Navigating to restaurant details...');
    const detailLink = restaurantCards.first().locator('.restaurant-detail-link');
    await detailLink.click();

    console.log('Validating favorite button...');
    const favoriteButton = page.locator('#favoriteButton');
    await expect(favoriteButton).toBeVisible();

    console.log('Adding to favorites...');
    await favoriteButton.click();
    await expect(favoriteButton).toHaveText(/Hapus dari Favorit/);

    console.log('Removing from favorites...');
    await favoriteButton.click();
    await expect(favoriteButton).toHaveText(/Tambahkan ke Favorit/);

    console.log('Test completed.');
  });
});
