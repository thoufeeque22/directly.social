import { test, expect } from './base-test';

test.describe('Stripe Integration (Authenticated)', () => {
  test('should navigate to pricing and initiate checkout for a tier', async ({ page }) => {
    // Navigate to pricing page
    await page.goto('/pricing');
    
    // Verify pricing tiers exist
    await expect(page.locator('text=Creator Pro').first()).toBeVisible();
    await expect(page.locator('text=Cloud Pro').first()).toBeVisible();
    await expect(page.locator('text=Lifetime License').first()).toBeVisible();

    // Click subscribe on Creator Pro
    const subscribeButton = page.locator('button:has-text("Subscribe"), a:has-text("Subscribe")').first();
    await expect(subscribeButton).toBeVisible();
    
    // We wait for navigation to checkout.stripe.com
    const [response] = await Promise.all([
      page.waitForURL(/.*checkout\.stripe\.com.*/, { timeout: 10000 }).catch(() => null),
      subscribeButton.click()
    ]);

    // Assert that we attempted to redirect to Stripe Checkout
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/.*checkout\.stripe\.com.*/);
  });
});

test.describe('Stripe Integration (Unauthenticated)', () => {
  test.use({ authRole: 'none' });

  test('should redirect unauthenticated users to login before checkout', async ({ page }) => {
    // Navigate to pricing page
    await page.goto('/pricing');
    
    // Click subscribe on Creator Pro
    const subscribeButton = page.locator('button:has-text("Subscribe"), a:has-text("Subscribe")').first();
    await expect(subscribeButton).toBeVisible();
    
    // Click and wait for navigation to /login
    await Promise.all([
      page.waitForURL(/.*\/login\?callbackUrl=\/pricing.*/, { timeout: 10000 }),
      subscribeButton.click()
    ]);

    // Assert that we arrived at login
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/.*\/login\?callbackUrl=\/pricing.*/);
  });
});
