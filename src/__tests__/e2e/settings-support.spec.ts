import { test, expect } from './base-test';

test.describe('Settings Support Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings?tab=support');
  });

  test('should simulate new contact form submission and verify success state', async ({ page }) => {
    // Check if the form is present
    await expect(page.locator('form')).toBeVisible();

    // Select topic in MUI Select
    await page.click('#support-topic');
    await page.click('li[data-value="general_inquiry"]');

    // Fill the support form message
    await page.fill('textarea[name="message"]', 'This is a test support message.');

    // Submit the form
    await page.click('button[type="submit"]');

    // Verify success state UI is rendered
    await expect(page.locator('svg[data-testid="CheckCircleOutlineIcon"]')).toBeVisible();
    await expect(page.locator('text=successfully')).toBeVisible();
  });

  test('should crawl all anchor tags on the support page and assert 200 OK', async ({ page, request }) => {
    await page.goto('/settings?tab=support');
    
    // Extract all anchor tags
    const links = await page.locator('a').evaluateAll(anchors => 
      anchors.map(a => (a as HTMLAnchorElement).href).filter(href => href.startsWith('http') || href.startsWith('/'))
    );

    // Make an HTTP request to assert they all return 200 OK
    for (const link of links) {
      const targetUrl = link.startsWith('/') ? new URL(link, page.url()).toString() : link;
      const response = await request.get(targetUrl);
      expect(response.status()).toBe(200);
    }
  });
});
