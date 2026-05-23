import { test, expect } from '@playwright/test';
import fs from 'fs';

test.describe('AI BYOK Wizard E2E', () => {
  test.beforeAll(async () => {
    const dir = 'verification';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  });

  test.beforeEach(async ({ page }) => {
    // Zero console error monitoring
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (
          !text.includes('React does not recognize') && 
          !text.includes('non-boolean attribute') &&
          !text.includes('hydration-mismatch') &&
          !text.includes('401') && // Ignore API validation 401s in tests
          !text.includes('400') // Ignore API validation 400s in tests
        ) {
          throw new Error(`Console Error detected: ${text}`);
        }
      }
    });

    await page.goto('/settings');
    // Click on the AI Providers tab
    await page.getByRole('tab', { name: /AI Providers/i }).click();
  });

  test('visual audit and happy path', async ({ page }) => {
    // Wait for the UI to be ready
    await expect(page.locator('text=AI Provider Keys (BYOK)')).toBeVisible();

    // 1. Idle state
    await page.screenshot({ path: 'verification/ai-byok-wizard-idle.png', fullPage: true });

    // Fill in a key
    const keyInput = page.locator('[data-testid="ai-byok-key-input"] input');
    await keyInput.fill('sk-mock-key-1234');

    // 2. Filled state
    await page.screenshot({ path: 'verification/ai-byok-wizard-filled.png', fullPage: true });

    // We can't fully submit and expect success unless we mock the API response.
    // Let's mock the /api/ai/validate-key endpoint.
    await page.route('**/api/ai/validate-key', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });

    await page.locator('[data-testid="ai-byok-save-button"]').click();

    // Wait for success message
    await expect(page.locator('text=Successfully saved')).toBeVisible();

    // 3. Success state
    await page.screenshot({ path: 'verification/ai-byok-wizard-success.png', fullPage: true });
    
    // Verify saved key is listed
    await expect(page.locator('text=Key ends in 1234')).toBeVisible();
  });

  test('negative path: invalid key', async ({ page }) => {
    await expect(page.locator('text=AI Provider Keys (BYOK)')).toBeVisible();

    const keyInput = page.locator('[data-testid="ai-byok-key-input"] input');
    await keyInput.fill('invalid-key');

    // Mock API failure
    await page.route('**/api/ai/validate-key', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, error: 'Invalid API Key provided.' })
      });
    });

    await page.locator('[data-testid="ai-byok-save-button"]').click();

    // Wait for error message
    await expect(page.locator('text=Invalid API Key provided.')).toBeVisible();

    // 4. Error state
    await page.screenshot({ path: 'verification/ai-byok-wizard-error.png', fullPage: true });
  });
});
