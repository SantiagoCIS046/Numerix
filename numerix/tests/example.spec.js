import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  // Note: Adjust this to match your actual page title or content.
  await expect(page).toHaveTitle(/Astra Numerology/i);
});

test('get started link', async ({ page }) => {
  await page.goto('/');

  // Click the get started link if it exists, or just verify some content.
  // For now, let's just check if the main container is visible.
  const main = page.locator('#app');
  await expect(main).toBeVisible();
});
