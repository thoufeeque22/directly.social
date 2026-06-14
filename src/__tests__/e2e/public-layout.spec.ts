import { test, expect } from '@playwright/test';

test.describe('Public Layout & Consolidate Routes', () => {
  test('landing page shows landing header and footer', async ({ page }) => {
    await page.goto('/');
    
    // Header should exist and be visible
    const header = page.locator('header[data-testid="landing-header"]');
    await expect(header).toBeVisible();
    
    // Verify Landing Footer
    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
  });

  test('privacy policy page uses unified public layout', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.locator('header[data-testid="landing-header"]')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();
  });

  test('anchor links in docs work correctly', async ({ page }) => {
    await page.goto('/docs/dev/byok-guide');

    // Find the link by text to avoid ID fragility
    const tocLink = page.getByRole('link', { name: 'TikTok Configuration' });
    await expect(tocLink).toBeVisible();

    await tocLink.click();

    // Check if the URL includes the anchor (partially)
    await expect(page).toHaveURL(/.*#2-tiktok-via-tiktok-for-developers/);
  });

  test('smart links open correctly', async ({ page, context }) => {
    await page.goto('/docs/dev/ai-byok-guide');
    
    // Use locator that exists and is specific
    const externalLink = page.getByRole('link', { name: 'OpenAI Developer Platform' });
    await expect(externalLink).toBeVisible();
    
    // Set a longer timeout for the page to open
    const [page1] = await Promise.all([
      context.waitForEvent('page', { timeout: 10000 }),
      externalLink.click()
    ]);
    
    await page1.waitForLoadState('domcontentloaded');
    await expect(page1).toHaveURL(/platform.openai.com/);
    await page1.close();
  });
});
