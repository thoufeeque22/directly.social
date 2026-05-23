import { test, expect } from '@playwright/test';
import fs from 'fs';

test.describe('Error Boundary Visual Audit', () => {
  test('capture error boundary screenshot', async ({ page }) => {
    await page.goto('/test-error');
    const errorBoundary = page.locator('.glass-card');
    await expect(errorBoundary).toBeVisible();
    
    // Create verification directory if it doesn't exist
    if (!fs.existsSync('verification')) {
        fs.mkdirSync('verification');
    }

    await errorBoundary.screenshot({ path: 'verification/error-boundary-ui.png' });
    await page.screenshot({ path: 'verification/error-handling-full-page.png', fullPage: true });
  });
});
