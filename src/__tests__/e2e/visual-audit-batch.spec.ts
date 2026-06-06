import { test } from './base-test';;

test.describe('Visual Audit Mandate @visual', () => {
  test('Capture Home Page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.locator('.ptr-container').screenshot({ path: 'verification/home-page.png' });
  });

  test('Capture Settings Page', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    await page.locator('.ptr-container').screenshot({ path: 'verification/settings-page.png' });
  });

  test('Capture Schedule Page', async ({ page }) => {
    await page.goto('/schedule');
    await page.waitForLoadState('networkidle');
    await page.locator('.ptr-container').screenshot({ path: 'verification/schedule-page.png' });
  });

  test('Capture Activity Page', async ({ page }) => {
    await page.goto('/activity');
    await page.waitForLoadState('networkidle');
    await page.locator('.ptr-container').screenshot({ path: 'verification/activity-page.png' });
  });
});
