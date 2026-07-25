import { test, expect } from './base-test';

test.describe('Ticket 769: Lifetime Deal Cap', () => {
  // We don't want to be logged in, so we can see the landing page pricing section
  test.use({ storageState: { cookies: [], origins: [] } });

  test('displays 5 licenses left when server action returns 5', async ({ page }) => {
    // Intercept Server Action or API request to mock the returned licenses
    await page.route('**/*', async (route) => {
      const req = route.request();
      const isNextAction = req.method() === 'POST' && await req.headerValue('next-action');
      const isApiRoute = req.url().includes('/api/pricing/lifetime-cap');
      
      if (isNextAction || isApiRoute) {
        // Mock returning 5. If it's a server action, it expects RSC format.
        // If it's an API route, it expects JSON.
        if (isNextAction) {
          await route.fulfill({
            status: 200,
            contentType: 'text/x-component',
            body: `0:["$@1",["actionResult",5]]`
          });
        } else {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ count: 5 })
          });
        }
        return;
      }
      await route.fallback();
    });

    await page.goto('/');

    // Scroll to pricing section to trigger any lazy loading if applicable
    const pricingHeader = page.locator('text=Pricing').first();
    if (await pricingHeader.isVisible()) {
      await pricingHeader.scrollIntoViewIfNeeded();
    }

    const licensesText = page.locator('text=Only 5 licenses left').first();
    await expect(licensesText).toBeVisible({ timeout: 10000 });
  });

  test('button text changes to Sold Out and is disabled when 0 licenses left', async ({ page }) => {
    // Intercept Server Action or API request to mock the returned licenses
    await page.route('**/*', async (route) => {
      const req = route.request();
      const isNextAction = req.method() === 'POST' && await req.headerValue('next-action');
      const isApiRoute = req.url().includes('/api/pricing/lifetime-cap');
      
      if (isNextAction || isApiRoute) {
        if (isNextAction) {
          await route.fulfill({
            status: 200,
            contentType: 'text/x-component',
            body: `0:["$@1",["actionResult",0]]`
          });
        } else {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ count: 0 })
          });
        }
        return;
      }
      await route.fallback();
    });

    await page.goto('/');

    // Scroll to pricing section
    const pricingHeader = page.locator('text=Pricing').first();
    if (await pricingHeader.isVisible()) {
      await pricingHeader.scrollIntoViewIfNeeded();
    }

    const soldOutBtn = page.locator('button', { hasText: 'Sold Out' }).first();
    await expect(soldOutBtn).toBeVisible({ timeout: 10000 });
    await expect(soldOutBtn).toBeDisabled();
  });
});
