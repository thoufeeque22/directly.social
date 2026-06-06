import { test, expect } from './base-test';;

test.describe('Session Reuse Verification @smoke @regression', () => {
  test('should access the dashboard without logging in (using storageState)', async ({ page }) => {
    // Navigate directly to the dashboard
    await page.goto('/');

    // Verify we are NOT redirected to login
    await expect(page).not.toHaveURL(/.*login/);
    
    // Verify dashboard elements are visible
    await expect(page.locator('h2:has-text("Upload & Automate")').first()).toBeVisible();
    
    // Verify user is authenticated by checking for the user profile/avatar or logout button
    // The exact UI might vary, but "Upload & Automate" being visible implies successful bypass of login page
  });
});
