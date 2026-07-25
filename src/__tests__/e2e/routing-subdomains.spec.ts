import { test, expect } from '@playwright/test';

test.describe('Subdomain Routing Middleware', () => {
  test('routes directly.social to marketing landing page', async ({ page }) => {
    // Intercept request to mock the Host header
    await page.route('**/*', async (route) => {
      const headers = { ...route.request().headers(), 'host': 'directly.social' };
      await route.continue({ headers });
    });

    await page.goto('/');
    
    // We expect the marketing page content to be present.
    // Update the text/selector based on actual marketing page content.
    await expect(page.locator('body')).toContainText("The Local-First Creator Studio");
  });

  test('routes app.directly.social to dashboard', async ({ page }) => {
    // Intercept request to mock the Host header
    await page.route('**/*', async (route) => {
      const headers = { ...route.request().headers(), 'host': 'app.directly.social' };
      await route.continue({ headers });
    });

    await page.goto('/');
    
    // We expect the dashboard page content to be present.
    // Update the text/selector based on actual dashboard content.
    await expect(page.locator('body')).toContainText(/dashboard|app/i);
  });
});
