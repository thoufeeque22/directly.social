import { test, expect } from './base-test';;

test.describe('Global UI/UX Audit (Issue #541)', () => {
  test('Visual Audit: Settings Page', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.glass-card').first()).toBeVisible();
    await page.locator('.ptr-container').screenshot({ path: 'verification/settings-page.png' });
  });

  test('Visual Audit: BYOK Settings Page', async ({ page }) => {
    await page.goto('/settings/byok');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.glass-card').first()).toBeVisible();
    await page.locator('.ptr-container').screenshot({ path: 'verification/settings-byok-page.png' });
  });

  test('Visual Audit: Activity Page', async ({ page }) => {
    await page.goto('/activity');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.glass-card').first()).toBeVisible();
    await page.locator('.ptr-container').screenshot({ path: 'verification/activity-page.png' });
  });
});
