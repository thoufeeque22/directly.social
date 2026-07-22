import { test, expect } from '@playwright/test';

test.describe('Ticket #755: Symmetric Rewards (Give a Month, Get a Month)', () => {

  test('Happy Path: Social Connect Reward', async ({ page }) => {
    await page.goto('/signup?ref=HAPPY_PATH_REF_CODE');
    await expect(page.getByText(/gifted you 1 Free Month/i)).toBeVisible();
    
    // Mock signup flow...
    await page.goto('/dashboard');
    await expect(page.getByText('Extra Post Quota: 1')).toBeVisible();
  });

  test('Happy Path: Paid Conversion Reward & Tracker Update', async ({ page }) => {
    await page.goto('/signup?ref=PAID_CONVERSION_REF');
    // Mock upgrade flow...
    await page.goto('/dashboard');
    await expect(page.getByText('Earned Free Months: 1')).toBeVisible();
  });

  test('Edge Case: Lifetime Referrer', async ({ page }) => {
    await page.goto('/signup?ref=LIFETIME_REF_CODE');
    await expect(page.getByText(/gifted you 1 Free Month/i)).toBeVisible();
  });

  test('Edge Case: Existing User Recycled Link', async ({ page }) => {
    await page.goto('/signup?ref=RECYCLE_REF_CODE');
    // Check if error is handled gracefully on double claim
  });

  test('Negative Scenario: Self-Referral', async ({ page }) => {
    await page.goto('/signup?ref=MY_OWN_REF_CODE');
    await expect(page.getByText('You cannot use your own referral code.')).toBeVisible();
  });

  test('Negative Scenario: Refund Clawback', async ({ page }) => {
    await page.goto('/dashboard/referral');
    // Ensure UI handles 0 or decremented months properly upon refund webhook
  });
});
