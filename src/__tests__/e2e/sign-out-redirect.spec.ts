import { test, expect } from '@playwright/test';

test.describe('Sign Out Flow @regression', () => {
  test('should redirect to landing page with success message after sign out', async ({ page }) => {
    // 1. Login first
    await page.goto('/login');
    await page.getByTestId('e2e-email-input').fill('tester-0@directly.social');
    await page.getByTestId('e2e-password-input').fill(process.env.E2E_TEST_PASSWORD || 'password');
    
    // Wait for CSRF token to initialize (as seen in base-test.ts)
    await page.waitForTimeout(2000);
    
    await page.getByTestId('e2e-login-submit').click();

    // 2. Wait for dashboard to load
    await expect(page).toHaveURL('/');
    await expect(page.getByTestId('profile-menu-button')).toBeVisible();

    // 3. Open user menu
    await page.getByTestId('profile-menu-button').click();

    // 4. Click Sign Out
    await page.getByTestId('sign-out-button').click();

    // 5. Verify redirection to landing page
    await expect(page).toHaveURL(/\/$/); // Should be at root
    
    // 6. Verify Snackbar message
    await expect(page.getByText('Successfully signed out.')).toBeVisible();

    // 7. Verify URL cleanup (loggedOut=true should be gone)
    await expect(page).toHaveURL(/^(?!.*loggedOut=true).*$/);
    
    // 8. Verify landing page content is visible
    await expect(page.getByRole('heading', { name: 'The Local-First Creator Studio', level: 1 })).toBeVisible();

    // 9. Explicitly verify Dashboard Sidebar/Header is NOT visible (using profile menu button)
    await expect(page.getByTestId('profile-menu-button')).not.toBeVisible();

    // 10. Verify protected route redirects to login (proving proxy.ts middleware is enforcing session)
    await page.goto('/settings');
    await expect(page).toHaveURL(/.*\/login.*/);
  });
});
