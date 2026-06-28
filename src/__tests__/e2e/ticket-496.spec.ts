import { test, expect } from '@playwright/test';

test.describe('Legal and Compliance Pages (Ticket #496)', () => {
  test('should render the Terms of Service page', async ({ page }) => {
    await page.goto('/terms');
    await expect(page.getByRole('heading', { name: /Terms/i }).first()).toBeVisible();
    await expect(page.locator('text=Acceptance of Terms')).toBeVisible();
    await expect(page.locator('text=Stripe Terms of Service')).toBeVisible();
  });

  test('should render the Privacy Policy page', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.getByRole('heading', { name: /Privacy/i }).first()).toBeVisible();
    await expect(page.locator('text=Google API Services User Data Policy')).toBeVisible();
    await expect(page.locator('text=Data We Collect')).toBeVisible();
  });

  test('should render the Cookie Policy page', async ({ page }) => {
    await page.goto('/cookies');
    await expect(page.getByRole('heading', { name: /Cookie/i }).first()).toBeVisible();
    await expect(page.locator('text=Strictly Necessary Cookies')).toBeVisible();
    await expect(page.locator('text=No Advertising Tracking')).toBeVisible();
  });
});
