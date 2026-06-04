import { test, expect } from './base-test';;
import { execSync } from 'child_process';

/**
 * Ticket #538: Security: Separate Admin and Tester Account Roles & Cleanup
 * 
 * This test verifies:
 * 1. Tester account (USER role) is denied access to admin routes and cannot see admin links.
 * 2. Admin role (verified by elevating tester to ADMIN) can access admin routes and see admin links.
 * 3. Deleted routes (/roadmap, /launch) return 404.
 * 
 * Note: admin@directly.social is not currently supported in the E2E credentials provider,
 * so we verify the role logic using the tester@directly.social account with toggled roles.
 */

test.describe('Ticket #538: Security Roles and Cleanup', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeAll(async () => {
    console.log('[E2E] Resetting DB state...');
    try {
      execSync('npx tsx src/__tests__/scripts/seed-e2e-user.ts');
    } catch (error) {
      console.error('[E2E] Failed to seed database:', error);
    }
  });

  test('Tester account (USER) is denied access to admin analytics', async ({ page }) => {
    console.log('[E2E] Testing Tester (USER) access...');
    
    // Ensure tester is USER
    execSync('npx tsx src/__tests__/scripts/seed-e2e-user.ts');

    // Login as Tester
    await page.goto('/login');
    await page.getByTestId('e2e-email-input').fill('tester@directly.social');
    await page.getByTestId('e2e-password-input').fill('directly-e2e-secret');
    await page.getByTestId('e2e-login-submit').click();
    
    // Wait for redirect to dashboard
    await expect(page.locator('h2:has-text("Upload & Automate")').first()).toBeVisible({ timeout: 15000 });
    console.log('[E2E] Logged in as Tester.');

    // 1. Verify Sidebar does NOT show Analytics
    await expect(page.getByRole('link', { name: 'Analytics' })).not.toBeVisible();
    console.log('[E2E] Analytics link NOT visible in sidebar for Tester.');
    
    // Take screenshot of Sidebar for Tester
    await page.screenshot({ path: 'verification/tester-sidebar.png' });
    
    // 2. Try to access /admin/analytics directly
    console.log('[E2E] Attempting direct access to /admin/analytics...');
    await page.goto('/admin/analytics');
    
    // 3. Verify redirect to / (as per authorized callback in auth.config.ts)
    await page.waitForURL('/', { timeout: 10000 });
    expect(page.url()).toContain('://127.0.0.1:3005/');
    console.log('[E2E] Direct access denied and redirected to home.');
  });

  test('Account with ADMIN role can access admin analytics', async ({ page }) => {
    console.log('[E2E] Testing ADMIN access...');

    // Login again to get new session with ADMIN role
    await page.goto('/login');
    await page.getByTestId('e2e-email-input').fill('admin@directly.social');
    await page.getByTestId('e2e-password-input').fill('directly-e2e-secret');
    await page.getByTestId('e2e-login-submit').click();
    
    await expect(page.locator('h2:has-text("Upload & Automate")').first()).toBeVisible({ timeout: 15000 });
    console.log('[E2E] Logged in as Admin.');

    // 1. Verify Sidebar SHOWS Analytics
    const analyticsLink = page.getByRole('link', { name: 'Analytics' });
    await expect(analyticsLink).toBeVisible();
    console.log('[E2E] Analytics link IS visible in sidebar for Admin.');
    
    // Take screenshot of Sidebar for Admin
    await page.screenshot({ path: 'verification/admin-sidebar.png' });

    // 2. Access /admin/analytics
    await analyticsLink.scrollIntoViewIfNeeded();
    await analyticsLink.click();
    await page.waitForURL('/admin/analytics');
    
    // 3. Verify Admin Analytics Dashboard is visible
    await expect(page.getByTestId('admin-analytics-dashboard')).toBeVisible();
    console.log('[E2E] Admin Analytics dashboard is visible.');
    
    // Take screenshot of Admin Analytics Page
    await page.screenshot({ path: 'verification/admin-analytics-page.png' });
  });

  test('Cleanup: Deleted routes return 404', async ({ page }) => {
    const deletedRoutes = [
      '/roadmap',
      '/launch',
      '/api/roadmap',
      '/api/launch'
    ];

    for (const route of deletedRoutes) {
      console.log(`[E2E] Checking deleted route: ${route}`);
      const response = await page.goto(route);
      // Next.js might return 404 for missing routes
      expect(response?.status()).toBe(404);
      console.log(`[E2E] Route ${route} returned 404 as expected.`);
    }
  });


});
