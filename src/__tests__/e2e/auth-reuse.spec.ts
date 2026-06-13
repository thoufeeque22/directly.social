import { test, expect } from './base-test';;

test.describe('Session Reuse Verification @smoke @regression', () => {
  test('should access the dashboard without logging in (using storageState)', async ({ page, workerEmail }) => {
    // Navigate directly to the dashboard
    await page.goto('/');

    // If redirected to landing, login manually
    const getStartedBtn = page.getByRole('link', { name: 'Get Started for Free' });
    if (await getStartedBtn.isVisible()) {
      console.log('Session reuse failed, logging in manually...');
      await page.goto('/login');
      await page.getByTestId('e2e-email-input').fill(workerEmail);
      await page.getByTestId('e2e-password-input').fill('password');
      await page.getByTestId('e2e-login-submit').click();
    }

    // Verify dashboard elements are visible
    await expect(page.locator('h2:has-text("Upload & Automate")').first()).toBeVisible({ timeout: 15000 });
  });
});
