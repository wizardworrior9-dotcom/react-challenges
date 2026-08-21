import { test, expect } from '@playwright/test';

test.describe('Challenge 20: Error Boundaries - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/20-error-boundaries');
  });

  test('should display task list or main content', async ({ page }) => {
    const taskList = page.locator('#task-list');
    const main = page.locator('main');
    await expect(taskList.or(main).first()).toBeVisible();
  });
});
