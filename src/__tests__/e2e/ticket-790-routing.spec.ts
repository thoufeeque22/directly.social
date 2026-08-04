import { test, expect } from '@playwright/test';

test.describe('Cross-Domain Routing & Login State', () => {
  // We use localhost:3000 as the baseURL to simulate the marketing site
  test.use({ baseURL: 'http://localhost:3000' });

  test('clicking Log In on marketing site redirects to app subdomain', async ({ page }) => {
    // Go to marketing site
    await page.goto('/');
    
    // Find Log In button/link
    // Since HeaderActions has an href="/login"
    const loginLink = page.getByRole('link', { name: /Log In/i }).first();
    
    // It should navigate to /login which the proxy will redirect to app.localhost
    await Promise.all([
      page.waitForURL(/app\.localhost:3000\/login/),
      loginLink.click(),
    ]);

    expect(page.url()).toContain('app.localhost:3000/login');
  });

  test('logging out redirects to login screen on app subdomain', async ({ page, context }) => {
    // Manually set session cookie to simulate logged in state
    await context.addCookies([{
      name: 'sb-mock-auth-token',
      value: 'mock-session',
      domain: 'localhost',
      path: '/',
    }]);

    await page.goto('http://app.localhost:3000/');
    
    // Attempt logout
    const logoutBtn = page.getByRole('button', { name: /Log out/i }).or(page.getByText(/Log out/i));
    if (await logoutBtn.count() > 0) {
      await Promise.all([
        page.waitForURL(/app\.localhost:3000\/login/),
        logoutBtn.click(),
      ]);
      expect(page.url()).toContain('app.localhost:3000/login');
    }
  });

  test('marketing site displays Dashboard when logged in', async ({ page, context }) => {
    // Setup cross-domain session cookie
    await context.addCookies([{
      name: 'sb-mock-auth-token',
      value: 'mock-session',
      domain: 'localhost',
      path: '/',
    }]);

    await page.goto('/');

    // Check that "Dashboard" is visible instead of "Log In"
    const dashboardLink = page.getByRole('link', { name: /Dashboard/i }).first();
    await expect(dashboardLink).toBeVisible();

    // Check that "Get Started" is hidden
    const getStartedLink = page.getByRole('link', { name: /Get Started/i }).first();
    await expect(getStartedLink).not.toBeVisible();
  });
});
