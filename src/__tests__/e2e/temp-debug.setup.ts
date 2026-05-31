import { test, expect } from './base-test';

test('debug login console errors', async ({ page }) => {
  await page.goto('/login');
  // Wait for 5 seconds to see if global providers trigger anything
  await page.waitForTimeout(5000);
  
  const emailInput = page.getByTestId('e2e-email-input');
  await expect(emailInput).toBeVisible();
});
