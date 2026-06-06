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
  // We must start unauthenticated to test the manual login and role-based redirects
  test.use({ authRole: 'none' });

  test('Tester account (USER) is denied access to admin analytics', async ({ page, workerEmail }) => {
    console.log(`[E2E] Testing Tester (${workerEmail}) access...`);
    
    // Ensure tester is USER
    execSync(`npx tsx src/__tests__/scripts/seed-e2e-user.ts ${workerEmail} USER`);

    // Login as Tester
    await page.goto('/login');
    await page.getByTestId('e2e-email-input').fill(workerEmail);
    await page.getByTestId('e2e-password-input').fill(process.env.E2E_TEST_PASSWORD || 'password');
    await page.waitForTimeout(2000); // Wait for CSRF token fetch
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
    try {
      await page.goto('/admin/analytics', { waitUntil: 'commit' });
    } catch (e) {
      console.log('[E2E] Handled fast redirect abort during goto.');
    }
    
    // 3. Verify redirect to / (as per authorized callback in auth.config.ts)
    await expect(page).toHaveURL(/\/$/, { timeout: 15000 });
    console.log('[E2E] Direct access denied and redirected to home.');
  });

  test('Account with ADMIN role can access admin analytics', async ({ page, isMobile, adminEmail }) => {
    console.log(`[E2E] Testing ADMIN access with ${adminEmail}...`);

    // Login again to get new session with ADMIN role
    await page.goto('/login');
    await page.getByTestId('e2e-email-input').fill(adminEmail);
    await page.getByTestId('e2e-password-input').fill(process.env.E2E_TEST_PASSWORD || 'password');
    await page.waitForTimeout(2000); // Wait for CSRF token fetch
    await page.getByTestId('e2e-login-submit').click();
    
    await expect(page.locator('h2:has-text("Upload & Automate")').first()).toBeVisible({ timeout: 15000 });
    console.log('[E2E] Logged in as Admin.');

    // If on mobile, the sidebar is hidden, so we need to open it
    if (isMobile) {
      const menuButton = page.getByRole('button', { name: '☰' });
      if (await menuButton.isVisible()) {
        await menuButton.click();
        await page.waitForTimeout(500); // Wait for open transition
      }
    }

    // 1. Verify Sidebar SHOWS Analytics
    const analyticsLink = page.getByRole('link', { name: 'Analytics' });
    await expect(analyticsLink).toBeVisible();
    console.log('[E2E] Analytics link IS visible in sidebar for Admin.');
    
    // Take screenshot of Sidebar for Admin
    await page.screenshot({ path: 'verification/admin-sidebar.png' });

    // 2. Access /admin/analytics
    if (isMobile) {
      await analyticsLink.evaluate((el) => (el as HTMLElement).click());
    } else {
      await analyticsLink.scrollIntoViewIfNeeded();
      await analyticsLink.click();
    }
    await page.waitForURL('/admin/analytics');
    
    // 3. Verify Admin Analytics Dashboard is visible
    await expect(page.getByTestId('admin-analytics-dashboard')).toBeVisible();
    console.log('[E2E] Admin Analytics dashboard is visible.');
    
    // Take screenshot of Admin Analytics Page
    await page.locator('.ptr-container').screenshot({ path: 'verification/admin-analytics-page.png' });
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
