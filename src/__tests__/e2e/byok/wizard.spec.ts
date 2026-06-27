import { test, expect } from '../base-test';
import type { Locator, Page } from '@playwright/test';

async function robustFill(locator: Locator, value: string, page: Page) {
  await locator.click();
  await locator.fill('');
  await locator.pressSequentially(value, { delay: 30 });
  await locator.blur();
  await page.waitForTimeout(200);
}

test.describe('BYOK Integration Wizard E2E @regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings/byok');
  });

  test('happy path: save valid credentials for youtube', async ({ page }) => {
    const youtubeWizard = page.locator('[data-testid="byok-wizard-youtube"]');
    
    // Fill credentials - 'valid' is a special keyword in our local validator mock
    await robustFill(youtubeWizard.locator('[data-testid="client-id-input"] input'), 'valid', page);
    await robustFill(youtubeWizard.locator('[data-testid="client-secret-input"] input'), 'valid-secret', page);
    await robustFill(youtubeWizard.locator('[data-testid="redirect-uri-input"] input'), 'https://directly.social/callback', page);

    // Click save
    await youtubeWizard.locator('[data-testid="save-button"]').click();
    
    // Wait for success message
    await expect(youtubeWizard.locator('[data-testid="success-message"]')).toBeVisible();
    
    // Verify it doesn't show error after success
    await expect(youtubeWizard.locator('[data-testid="error-message"]')).not.toBeVisible();
  });

  test('negative path: invalid credentials trigger error for tiktok', async ({ page }) => {
    const tiktokWizard = page.locator('[data-testid="byok-wizard-tiktok"]');
    
    // Fill invalid credentials - 'invalid-id' triggers our Server Action bypass
    await robustFill(tiktokWizard.locator('[data-testid="client-id-input"] input'), 'invalid-id', page);
    await robustFill(tiktokWizard.locator('[data-testid="client-secret-input"] input'), 'wrong-secret', page);
    await robustFill(tiktokWizard.locator('[data-testid="redirect-uri-input"] input'), 'https://directly.social/callback', page);

    // Click save
    await tiktokWizard.locator('[data-testid="save-button"]').click();
    
    await expect(tiktokWizard.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(tiktokWizard.locator('[data-testid="error-message"]')).toContainText('Invalid credentials');
  });

  test('visual audit: verify layout state', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.locator('.ptr-container').screenshot({ path: 'verification/byok-wizard-idle.png' });
    
    const youtubeWizard = page.locator('[data-testid="byok-wizard-youtube"]');
    await expect(youtubeWizard.locator('text=Step 1: Get Your Keys')).toBeVisible();
    await expect(youtubeWizard.locator('text=Step 2: Configure Credentials')).toBeVisible();
    
    // Fill something to check dirty state
    await robustFill(youtubeWizard.locator('[data-testid="client-id-input"] input'), 'test', page);
    await page.locator('.ptr-container').screenshot({ path: 'verification/byok-wizard-dirty.png' });

    // Save and check success layout
    await robustFill(youtubeWizard.locator('[data-testid="client-id-input"] input'), 'valid', page);
    await robustFill(youtubeWizard.locator('[data-testid="client-secret-input"] input'), 'valid', page);
    await robustFill(youtubeWizard.locator('[data-testid="redirect-uri-input"] input'), 'https://directly.social/callback', page);
    await youtubeWizard.locator('[data-testid="save-button"]').click();
    
    await page.locator('.ptr-container').screenshot({ path: 'verification/byok-wizard-success.png' });
    await expect(youtubeWizard.locator('[data-testid="success-message"]')).toBeVisible();
  });
});
