import { test, expect } from '@playwright/test';

test.describe('Stripe Integration', () => {
  test('should navigate to pricing and initiate checkout for a tier', async ({ page }) => {
    // Navigate to pricing page
    await page.goto('/pricing');
    
    // Verify pricing tiers exist
    await expect(page.locator('text=Creator Pro')).toBeVisible();
    await expect(page.locator('text=Cloud Pro')).toBeVisible();
    await expect(page.locator('text=Lifetime Deal')).toBeVisible();

    // Click subscribe on Creator Pro
    const subscribeButton = page.locator('button:has-text("Subscribe"), a:has-text("Subscribe")').first();
    await expect(subscribeButton).toBeVisible();
    
    // We wait for navigation to checkout.stripe.com or our API route
    const [response] = await Promise.all([
      page.waitForURL(/.*checkout\.stripe\.com.*/, { timeout: 10000 }).catch(() => null),
      subscribeButton.click()
    ]);

    // Assert that we attempted to redirect to Stripe Checkout
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/.*checkout\.stripe\.com.*/);
  });
});
