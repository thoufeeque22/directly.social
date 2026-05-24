import { test, expect } from '@playwright/test';

test.describe('Visual Regression @visual', () => {
  test('Home page baseline', async ({ page }) => {
    await page.goto('/');
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('home-page.png', { maxDiffPixelRatio: 0.05 });
  });

  test('Settings page baseline', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    // Ensure the settings content is visible
    await page.waitForSelector('main', { state: 'visible' });
    await expect(page).toHaveScreenshot('settings-page.png', { maxDiffPixelRatio: 0.05 });
  });

  test('Schedule page baseline', async ({ page }) => {
    await page.goto('/schedule');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('schedule-page.png', { maxDiffPixelRatio: 0.05 });
  });
});
