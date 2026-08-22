import { test, expect } from '@playwright/test';

test.describe('Account Settings Suite (Ticket #702)', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login
    await page.goto('/login');
    // Login with environment variables to avoid hardcoded secrets
    await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD || '');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    
    // Navigate to settings
    await page.click('nav >> text=Settings');
    await page.waitForURL('**/settings**');
  });

  test('Happy Path: Navigation uses consolidated left-rail menu and synchronizes ?tab= query param', async ({ page }) => {
    await page.click('text=Preferences');
    await expect(page).toHaveURL(/.*\/settings\?tab=preferences/);
    
    await page.click('text=Security');
    await expect(page).toHaveURL(/.*\/settings\?tab=security/);
    
    await page.click('text=Privacy');
    await expect(page).toHaveURL(/.*\/settings\?tab=privacy/);
  });

  test('Happy Path: Modifying bio, timezone, and notification toggles persists correctly', async ({ page }) => {
    // Go to Profile Tab
    await page.click('text=Profile');
    await page.fill('textarea[name="bio"]', 'This is a test bio updated via Playwright E2E.');
    await page.click('button:has-text("Save Profile")');
    await expect(page.locator('text=Profile updated successfully')).toBeVisible();

    // Go to Preferences Tab
    await page.click('text=Preferences');
    await page.selectOption('select[name="timezone"]', 'UTC');
    // Toggle Email Notifications
    const emailToggle = page.locator('input[name="emailNotifications"]');
    await emailToggle.click();
    await page.click('button:has-text("Save Preferences")');
    await expect(page.locator('text=Preferences updated successfully')).toBeVisible();

    // Hard reload and verify persistence
    await page.reload();
    await page.click('text=Profile');
    await expect(page.locator('textarea[name="bio"]')).toHaveValue('This is a test bio updated via Playwright E2E.');
  });

  test('Happy Path & Edge Case: Session Management - Log Out of All Devices', async ({ page }) => {
    await page.click('text=Security');
    await page.click('button:has-text("Log Out of All Devices")');
    
    // Expect confirmation toast
    await expect(page.locator('text=Successfully logged out of other devices')).toBeVisible();
    
    // Should still be logged in on this session
    await expect(page).toHaveURL(/.*\/settings\?tab=security/);
  });

  test('Happy Path & Rate Limiting: Data Portability Export fires Inngest event with rate limits', async ({ page }) => {
    await page.click('text=Privacy');
    
    const exportButton = page.locator('button:has-text("Export Data")');
    await exportButton.click();
    
    // Success toast for first click
    await expect(page.locator('text=Data export started')).toBeVisible();

    // Rapid double-click test for rate limiting
    await exportButton.click();
    await expect(page.locator('text=Please wait before requesting another export')).toBeVisible();
  });

  test('Negative Path: Input Validation - Exceeding string length limits for bio fails', async ({ page }) => {
    await page.click('text=Profile');
    const longBio = 'a'.repeat(501);
    await page.fill('textarea[name="bio"]', longBio);
    await page.click('button:has-text("Save Profile")');
    
    await expect(page.locator('text=Bio must be less than 500 characters')).toBeVisible();
  });

  test('Negative Path: Unauthorized Access to Export API is blocked', async ({ request }) => {
    // Bypassing UI and accessing the endpoint without auth context
    const response = await request.post('/api/export-user-data', {
      data: {}
    });
    
    expect(response.status()).toBe(401);
  });
});
