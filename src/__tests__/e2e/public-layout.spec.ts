import { test, expect } from '@playwright/test';

test.describe('Public Layout & Consolidate Routes', () => {
  test('landing page shows landing header and footer', async ({ page }) => {
    await page.goto('/');
    
    // Verify Landing Header
    await expect(page.locator('header[data-testid="landing-header"]')).toBeVisible();
    await expect(page.getByText('Philosophy')).toBeVisible();
    await expect(page.getByText('Features')).toBeVisible();
    await expect(page.getByText('Pricing')).toBeVisible();
    await expect(page.getByText('Docs')).toBeVisible();
    
    // Verify Landing Footer
    await expect(page.getByText('Company')).toBeVisible();
    await expect(page.getByText('Privacy Policy')).toBeVisible();
  });

  test('privacy policy page uses unified public layout', async ({ page }) => {
    await page.goto('/privacy');
    
    // Header should still be visible
    await expect(page.locator('header[data-testid="landing-header"]')).toBeVisible();
    
    // Content should be present
    await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();
    
    // Footer should be visible
    await expect(page.getByText('Company')).toBeVisible();
  });

  test('docs landing page uses unified public layout', async ({ page }) => {
    await page.goto('/docs');
    
    // Header should still be visible
    await expect(page.locator('header[data-testid="landing-header"]')).toBeVisible();
    
    // Personas should be visible
    await expect(page.getByText('Getting Started')).toBeVisible();
    await expect(page.getByText('Power Users Setup')).toBeVisible();
  });

  test('dynamic docs pages load correctly with persona paths', async ({ page }) => {
    // Check User guide
    await page.goto('/docs/user/account-connection');
    await expect(page.getByRole('heading').first()).toBeVisible();
    
    // Check Dev guide
    await page.goto('/docs/dev/vault-setup');
    await expect(page.getByRole('heading').first()).toBeVisible();
  });

  test('anchor links in docs work correctly', async ({ page }) => {
    await page.goto('/docs/dev/byok-guide');
    // Click a ToC link
    await page.getByRole('link', { name: 'TikTok Configuration' }).click();
    // Check if the URL includes the anchor
    await expect(page).toHaveURL(/.*#2-tiktok-via-tiktok-for-developers/);
  });

  test('smart links open correctly (new tab for external/login, same for internal)', async ({ page, context }) => {
    await page.goto('/docs/user/login-guide');
    
    // External link test (OpenAI)
    const [page1] = await Promise.all([
      context.waitForEvent('page'),
      page.getByRole('link', { name: 'OpenAI Developer Platform' }).click()
    ]);
    await expect(page1).toHaveURL(/platform.openai.com/);
    await page1.close();

    // Internal link test (should stay in same page)
    await page.getByRole('link', { name: 'Account Connection' }).click();
    await expect(page).toHaveURL(/.*\/docs\/user\/account-connection/);
  });

  test('public pages do NOT show authenticated sidebar', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.getByText('Scheduled Posts')).not.toBeVisible();
  });
});
