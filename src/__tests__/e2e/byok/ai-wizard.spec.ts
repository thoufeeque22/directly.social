import { test, expect } from '../base-test';;
import fs from 'fs';

test.describe('AI BYOK Wizard E2E', () => {
  test.beforeAll(async () => {
    const dir = 'verification';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
    // Click on the AI Providers tab
    await page.getByRole('tab', { name: /AI Providers/i }).click();
  });

  test('visual audit and happy path', async ({ page }) => {
    // Wait for the UI to be ready
    await expect(page.locator('text=AI Provider Keys (BYOK)')).toBeVisible();

    // 1. Idle state
    await page.locator('.ptr-container').screenshot({ path: 'verification/ai-byok-wizard-idle.png' });

    // Fill in a key
    const keyInput = page.locator('[data-testid="ai-byok-key-input"] input');
    await keyInput.click();
    await keyInput.fill('');
    await keyInput.pressSequentially('sk-mock-key-1234', { delay: 50 });
    await keyInput.blur();
    await page.waitForTimeout(500);

    // 2. Filled state
    await page.locator('.ptr-container').screenshot({ path: 'verification/ai-byok-wizard-filled.png' });

    // Click save - using real Server Action with sk-mock-key
    const saveBtn = page.locator('[data-testid="ai-byok-save-button"]');
    await expect(saveBtn).toBeEnabled({ timeout: 5000 });
    await saveBtn.click();

    // Wait for success message - uses substring match
    await expect(page.locator('text=Successfully saved')).toBeVisible();

    // 3. Success state
    await page.locator('.ptr-container').screenshot({ path: 'verification/ai-byok-wizard-success.png' });
    
    // Verify saved key is listed
    await expect(page.locator('text=Key ends in 1234')).toBeVisible();
  });

  test('negative path: invalid key', async ({ page }) => {
    await expect(page.locator('text=AI Provider Keys (BYOK)')).toBeVisible();

    const keyInput = page.locator('[data-testid="ai-byok-key-input"] input');
    await keyInput.click();
    await keyInput.fill('');
    await keyInput.pressSequentially('invalid-key-for-e2e', { delay: 50 });
    await keyInput.blur();
    await page.waitForTimeout(500);

    const saveBtn = page.locator('[data-testid="ai-byok-save-button"]');
    await expect(saveBtn).toBeEnabled({ timeout: 5000 });
    await saveBtn.click();

    // Wait for error message - use flexible matcher
    await expect(page.getByText(/Invalid API Key/i).first()).toBeVisible();

    // 4. Error state
    await page.locator('.ptr-container').screenshot({ path: 'verification/ai-byok-wizard-error.png' });
  });
});
