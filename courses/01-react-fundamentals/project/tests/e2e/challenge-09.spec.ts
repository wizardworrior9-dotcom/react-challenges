import { test, expect } from '@playwright/test';

test.describe('Challenge 09: Search Functionality - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/09-search-functionality');
  });

  test('should display task list', async ({ page }) => {
    await expect(page.locator('#task-list')).toBeVisible();
  });

  test('should display filter bar with search input', async ({ page }) => {
    await expect(page.locator('#filter-bar').or(page.locator('#search-input')).first()).toBeVisible();
  });
});
