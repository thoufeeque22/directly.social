import { test, expect } from './base-test';

test.describe('Ticket #656: Post-Login Navigation & Layout Visibility', () => {
  test('should show app shell when authenticated and verify Help menu', async ({ page, workerEmail }) => {
    // 1. Navigate to home
    await page.goto('/');
    
    // 2. Manual Login Fallback
    // If we see the 'Get Started' button or login text, we are not logged in.
    const getStartedBtn = page.getByRole('link', { name: 'Get Started for Free' });
    if (await getStartedBtn.isVisible()) {
      console.log(`[Worker] Session not detected via cookies, performing manual login for ${workerEmail}`);
      await page.goto('/login');
      await page.getByTestId('e2e-email-input').fill(workerEmail);
      await page.getByTestId('e2e-password-input').fill('password');
      await page.getByTestId('e2e-login-submit').click();
      await expect(page).toHaveURL(/.*\//);
    }
    
    // 3. App Shell Visibility
    // Sidebar should be present (aside element)
    await expect(page.locator('aside')).toBeAttached({ timeout: 15000 });
    await expect(page.locator('header')).toBeVisible();
    
    // 4. Profile Menu & Help Sub-menu
    const profileButton = page.getByTestId('profile-menu-button');
    await expect(profileButton).toBeVisible();
    await profileButton.click();

    // Verify "What's New" is present (existing functionality)
    await expect(page.getByTestId('whats-new-profile-link')).toBeVisible();

    // Verify "Help" menu item
    const helpMenuItem = page.getByText('Help', { exact: true });
    await expect(helpMenuItem).toBeVisible();
    
    // Click Help to open sub-menu
    await helpMenuItem.click();

    // Verify sub-menu links
    await expect(page.getByRole('menuitem', { name: 'Documentation' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Privacy Policy' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Terms of Service' })).toBeVisible();

    // Verify Documentation link
    const docsLink = page.getByRole('menuitem', { name: 'Documentation' });
    await expect(docsLink).toHaveAttribute('href', '/docs');
    
    // Verify Privacy Policy link
    const privacyLink = page.getByRole('menuitem', { name: 'Privacy Policy' });
    await expect(privacyLink).toHaveAttribute('href', '/privacy');

    // Verify Terms of Service link
    const termsLink = page.getByRole('menuitem', { name: 'Terms of Service' });
    await expect(termsLink).toHaveAttribute('href', '/terms');
  });

  test('should hide app shell on public routes like /login', async ({ page }) => {
    await page.goto('/login');
    // On /login, the shell should not be visible according to LayoutWrapper.tsx
    await expect(page.locator('header')).not.toBeVisible();
    await expect(page.locator('aside')).not.toBeVisible();
  });
});
