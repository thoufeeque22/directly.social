import { test, expect } from '@playwright/test';

test.describe('Error Handling', () => {
  test('should display ErrorBoundary UI on app error', async ({ page }) => {
    // Navigate to a page that throws during render
    await page.goto('/test-error'); 

    // Check for our custom ErrorBoundary
    const errorBoundary = page.getByTestId('error-boundary-ui');
    await expect(errorBoundary).toBeVisible();
    await expect(errorBoundary.getByText(/Something went wrong/i)).toBeVisible();
    await expect(errorBoundary.getByText(/Intentional Render Error/i)).toBeVisible();
    await expect(errorBoundary.getByTestId('error-reset-button')).toBeVisible();
  });
});
