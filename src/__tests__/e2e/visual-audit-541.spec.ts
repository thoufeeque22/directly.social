import { test, expect } from '@playwright/test';

test.describe('Global UI/UX Audit (Issue #541)', () => {
  test('Visual Audit: Settings Page', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.glass-card').first()).toBeVisible();
    await page.screenshot({ path: 'verification/settings-page.png', fullPage: true });
  });

  test('Visual Audit: BYOK Settings Page', async ({ page }) => {
    await page.goto('/settings/byok');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.glass-card').first()).toBeVisible();
    await page.screenshot({ path: 'verification/settings-byok-page.png', fullPage: true });
  });

  test('Visual Audit: History Page', async ({ page }) => {
    await page.goto('/history');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.glass-card').first()).toBeVisible();
    await page.screenshot({ path: 'verification/history-page.png', fullPage: true });
  });
});
