import { test, expect } from '@playwright/test';

test.describe('Error Handling', () => {
  test('should display ErrorBoundary UI on app error', async ({ page }) => {
    // Navigate to a page that throws during render
    await page.goto('/test-error'); 

    // Check for our custom ErrorBoundary
    await expect(page.getByRole('heading', { name: /Something went wrong/i })).toBeVisible();
    await expect(page.getByRole('paragraph').filter({ hasText: /Intentional Render Error/i })).toBeVisible();
    await expect(page.getByTestId('error-reset-button')).toBeVisible();
  });
});
