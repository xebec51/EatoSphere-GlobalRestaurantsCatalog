import { test, expect } from '@playwright/test';

test.describe('Favorite Restaurants E2E Test', () => {
  test('should add a restaurant to favorite and remove it', async ({ page }) => {
    console.log('Navigating to the main page...');
    await page.goto('http://localhost:8080/');

    console.log('Waiting for the restaurant list...');
    await page.waitForSelector('.restaurant-card');

    // Klik restoran pertama
    console.log('Clicking on the first restaurant...');
    const firstRestaurant = await page.locator('.restaurant-card').first();
    await firstRestaurant.click();

    console.log('Adding restaurant to favorite...');
    const favoriteButton = await page.locator('#favoriteButton');
    await favoriteButton.click();

    // Verifikasi tombol berubah menjadi "Hapus dari Favorit"
    const buttonTextAfterAdd = await favoriteButton.textContent();
    expect(buttonTextAfterAdd).toBe('Hapus dari Favorit');

    console.log('Navigating to favorite page...');
    await page.goto('http://localhost:8080/#/favorite');
    await page.waitForSelector('.restaurant-card');

    // Verifikasi restoran favorit muncul
    const favoriteRestaurant = await page.locator('.restaurant-card').first();
    const restaurantName = await favoriteRestaurant.locator('h3').textContent();
    console.log('Favorite Restaurant Name:', restaurantName);
    expect(restaurantName).toBeTruthy();

    console.log('Removing restaurant from favorite...');
    await favoriteButton.click();

    // Verifikasi tombol berubah menjadi "Tambahkan ke Favorit"
    const buttonTextAfterRemove = await favoriteButton.textContent();
    expect(buttonTextAfterRemove).toBe('Tambahkan ke Favorit');
  });
});
