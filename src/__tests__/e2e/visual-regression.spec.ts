import { test, expect } from './base-test';;
test.describe('Structural & Visual Audit @visual', () => {
  test('Home page structural audit', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 1. Structural Assertions (Check for core layout)
    await expect(page.locator('aside').first()).toBeVisible(); // Sidebar
    await expect(page.getByText('Directly').first()).toBeVisible(); // App Logo/Header
    await expect(page.locator('h1:has-text("Dashboard Overview")')).toBeVisible();
    await expect(page.locator('h2:has-text("Upload & Automate")')).toBeVisible();

    // 2. Save artifact for manual review
    await page.locator('.ptr-container').screenshot({ path: 'verification/audit-home-page.png' });
  });

  test('Settings page structural audit', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('main', { state: 'visible' });

    // 1. Structural Assertions
    await expect(page.locator('aside').first()).toBeVisible();
    await expect(page.getByText('Directly').first()).toBeVisible();
    await expect(page.getByRole('link', { name: /destinations/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /ai providers/i })).toBeVisible();

    // 2. Save artifact
    await page.locator('.ptr-container').screenshot({ path: 'verification/audit-settings-page.png' });
  });

  test('Schedule page structural audit', async ({ page }) => {
    await page.goto('/schedule');
    await page.waitForLoadState('networkidle');

    // 1. Structural Assertions
    await expect(page.locator('aside').first()).toBeVisible();
    await expect(page.getByText('Directly').first()).toBeVisible();
    await expect(page.locator('h1:has-text("Scheduled Posts")')).toBeVisible();

    // 2. Save artifact
    await page.locator('.ptr-container').screenshot({ path: 'verification/audit-schedule-page.png' });
  });
});
