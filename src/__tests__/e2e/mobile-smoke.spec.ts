import { test, expect } from '@playwright/test';

test.describe('Mobile Emulation Smoke Test', () => {
  // Only run this suite for mobile projects
  test.skip(({ isMobile }) => !isMobile, 'Skipping on non-mobile devices');

  test('should load dashboard and verify mobile view', async ({ page }) => {
    // Navigate directly to the dashboard
    await page.goto('/');

    // Verify we are NOT redirected to login
    await expect(page).not.toHaveURL(/.*login/);
    
    // Verify dashboard main element is visible
    await expect(page.locator('h2:has-text("Upload & Automate")').first()).toBeVisible();

    // Verify the test user's accounts are loaded (Tester Alpha and Tester Beta)
    const ytBtn = page.getByRole('button', { name: /youtube: @testeralpha/i });
    const tkBtn = page.getByRole('button', { name: /tiktok: @testerbeta/i });
    
    await expect(ytBtn).toBeVisible();
    await expect(tkBtn).toBeVisible();
  });
});
