import { test } from '@playwright/test';

test.describe('Visual Audit Mandate @visual', () => {
  test('Capture Home Page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'verification/home-page.png', fullPage: true });
  });

  test('Capture Settings Page', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'verification/settings-page.png', fullPage: true });
  });

  test('Capture Schedule Page', async ({ page }) => {
    await page.goto('/schedule');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'verification/schedule-page.png', fullPage: true });
  });

  test('Capture History Page', async ({ page }) => {
    await page.goto('/history');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'verification/history-page.png', fullPage: true });
  });
});
