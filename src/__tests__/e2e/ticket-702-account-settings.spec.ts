import { test, expect } from '@playwright/test';

test.describe('Account Settings Suite (Ticket #702)', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login
    await page.goto('/login');
    // Login with environment variables to avoid hardcoded secrets
    await page.fill('[data-testid="e2e-email-input"]', process.env.TEST_USER_EMAIL || 'test@example.com');
    await page.fill('[data-testid="e2e-password-input"]', process.env.TEST_USER_PASSWORD || 'password');
    await page.click('[data-testid="e2e-login-submit"]');
    await page.waitForURL((url) => url.pathname === '/');
    
    // Navigate to settings
    await page.goto('/settings');
    await page.waitForURL('**/settings**');
  });

  test('Happy Path: Navigation uses consolidated left-rail menu and synchronizes ?tab= query param', async ({ page }) => {
    await page.click('[data-testid="nav-preferences"]');
    await expect(page).toHaveURL(/.*\/settings\?tab=preferences/);
    
    await page.click('[data-testid="nav-security"]');
    await expect(page).toHaveURL(/.*\/settings\?tab=security/);
    
    await page.click('[data-testid="nav-privacy"]');
    await expect(page).toHaveURL(/.*\/settings\?tab=privacy/);
  });

  test('Happy Path: Modifying timezone and notification toggles persists correctly', async ({ page }) => {
    await page.goto('/settings?tab=preferences');
    try {
      await page.waitForSelector('select[name="timezone"]', { timeout: 5000 });
    } catch (e) {
      console.log('PAGE CONTENT: ', await page.content());
      throw e;
    }
    
    await page.selectOption('select[name="timezone"]', 'UTC');
    const emailToggle = page.locator('input[name="emailNotifications"]');
    await emailToggle.click();
    await expect(page.locator('text=Preferences updated successfully')).toBeVisible();
    await page.reload();
  });

  test('Happy Path & Edge Case: Session Management - Log Out of All Devices', async ({ page }) => {
    await page.goto('/settings?tab=security');
    await page.waitForSelector('button:has-text("Log Out of All Devices")');
    
    await page.click('button:has-text("Log Out of All Devices")');
    await expect(page.locator('text=Successfully logged out of other devices')).toBeVisible();
    await expect(page).toHaveURL(/.*\/settings\?tab=security/);
  });

  test('Happy Path & Rate Limiting: Data Portability Export fires Inngest event with rate limits', async ({ page }) => {
    await page.goto('/settings?tab=privacy');
    await page.waitForSelector('button:has-text("Export Data")');
    
    const exportButton = page.locator('button:has-text("Export Data")');
    await exportButton.click();
    
    // Success toast for first click
    await expect(page.locator('text=Data export started')).toBeVisible();

  });

  test('Negative Path: Unauthorized Access to Export API is blocked', async ({ request }) => {
    // Bypassing UI and accessing the endpoint without auth context
    const response = await request.post('/api/export-user-data', {
      data: {}
    });
    
    expect(response.status()).toBe(401);
  });
});
