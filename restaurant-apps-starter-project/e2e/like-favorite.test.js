import { test, expect } from '@playwright/test';

test.describe('Favorite Restaurants E2E Test', () => {
  test('should add a restaurant to favorite and remove it', async ({ page }) => {
    console.log('Navigating to the main page...');
    await page.goto('http://localhost:8080/');

    console.log('Waiting for the restaurant list to load...');
    await page.waitForSelector('.restaurant-list', { timeout: 30000 });

    const restaurantCount = await page.locator('.restaurant-card').count();
    console.log('Number of restaurants:', restaurantCount);
    expect(restaurantCount).toBeGreaterThan(0);

    const restaurantName = await page.locator('.restaurant-card h3').first().textContent();
    console.log('Restaurant Name:', restaurantName);
    expect(restaurantName).toBeTruthy();

    console.log('Clicking on the first restaurant to view details...');
    const restaurantDetailLink = page.locator('.restaurant-card .restaurant-detail-link').first();
    await restaurantDetailLink.waitFor({ state: 'attached' });
    await restaurantDetailLink.waitFor({ state: 'visible' });
    await page.waitForTimeout(500); // Penundaan 500ms untuk memastikan elemen stabil
    await restaurantDetailLink.click();

    console.log('Waiting for the detail page to load...');
    await page.waitForSelector('#favoriteButton', { timeout: 30000 });

    console.log('Adding the restaurant to favorites...');
    const favoriteButton = page.locator('#favoriteButton');
    await favoriteButton.click();
    const buttonTextAfterAdd = (await favoriteButton.textContent()).trim();
    expect(buttonTextAfterAdd).toBe('Hapus dari Favorit');

    console.log('Navigating to the favorites page...');
    await page.goto('http://localhost:8080/#/favorite');
    await page.waitForSelector('.restaurant-card', { timeout: 30000 });

    const favoriteCount = await page.locator('.restaurant-card').count();
    console.log('Number of favorite restaurants:', favoriteCount);
    expect(favoriteCount).toBe(1);

    console.log('Clicking on the favorite restaurant to view details...');
    const favoriteRestaurantLink = page.locator('.restaurant-card .restaurant-detail-link').first();
    await favoriteRestaurantLink.waitFor({ state: 'attached' });
    await favoriteRestaurantLink.waitFor({ state: 'visible' });
    await page.waitForTimeout(500); // Penundaan 500ms untuk memastikan elemen stabil
    await favoriteRestaurantLink.click();

    console.log('Waiting for the detail page to load...');
    await page.waitForSelector('#favoriteButton', { timeout: 30000 });

    console.log('Removing the restaurant from favorites...');
    const favoriteButtonDetail = page.locator('#favoriteButton');
    await favoriteButtonDetail.click();
    const buttonTextAfterRemove = (await favoriteButtonDetail.textContent()).trim();
    expect(buttonTextAfterRemove).toBe('Tambahkan ke Favorit');

    console.log('Navigating back to the favorites page...');
    await page.goto('http://localhost:8080/#/favorite');

    console.log('Ensuring the favorites list is empty...');
    const noFavoritesMessage = page.locator('.no-restaurants-message');
    await noFavoritesMessage.waitFor({ state: 'attached' }); // Tunggu elemen ada di DOM
    await expect(noFavoritesMessage).toBeVisible();

    console.log('Test completed successfully.');
  });
});
