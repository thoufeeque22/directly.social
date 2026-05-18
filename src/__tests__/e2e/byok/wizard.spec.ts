import { test, expect } from '@playwright/test';

test.describe('BYOK Integration Wizard E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Zero console error monitoring
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (
          !text.includes('React does not recognize') && 
          !text.includes('non-boolean attribute') &&
          !text.includes('hydration-mismatch')
        ) {
          throw new Error(`Console Error detected: ${text}`);
        }
      }
    });

    // Zero network error monitoring (4xx/5xx)
    page.on('response', response => {
      if (response.status() >= 400 && !response.url().includes('sentry')) {
        throw new Error(`Network Error detected: ${response.status()} ${response.url()}`);
      }
    });

    await page.goto('/settings/byok');
  });

  test('happy path: save valid credentials for youtube', async ({ page }) => {
    const youtubeWizard = page.locator('[data-testid="byok-wizard-youtube"]');
    
    await youtubeWizard.locator('[data-testid="client-id-input"] input').fill('valid');
    await youtubeWizard.locator('[data-testid="client-secret-input"] input').fill('secret123');
    await youtubeWizard.locator('[data-testid="redirect-uri-input"] input').fill('https://socialstudio.ai/callback');
    
    await youtubeWizard.locator('[data-testid="save-button"]').click();
    
    // Wait for success message
    await expect(youtubeWizard.locator('[data-testid="success-message"]')).toBeVisible();
    
    // Verify it doesn't show error after success
    await expect(youtubeWizard.locator('[data-testid="error-message"]')).not.toBeVisible();
    
    // Verify localStorage
    const storage = await page.evaluate(() => localStorage.getItem('byok_youtube'));
    expect(storage).toContain('valid');
  });

  test('negative path: invalid credentials trigger error for tiktok', async ({ page }) => {
    const tiktokWizard = page.locator('[data-testid="byok-wizard-tiktok"]');
    
    await tiktokWizard.locator('[data-testid="client-id-input"] input').fill('invalid-id');
    await tiktokWizard.locator('[data-testid="client-secret-input"] input').fill('secret123');
    await tiktokWizard.locator('[data-testid="redirect-uri-input"] input').fill('https://socialstudio.ai/callback');
    
    await tiktokWizard.locator('[data-testid="save-button"]').click();
    
    await expect(tiktokWizard.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(tiktokWizard.locator('[data-testid="error-message"]')).toContainText('Invalid credentials');
  });

  test('edge case: invalid URL format for redirect URI', async ({ page }) => {
    const youtubeWizard = page.locator('[data-testid="byok-wizard-youtube"]');
    
    await youtubeWizard.locator('[data-testid="client-id-input"] input').fill('valid');
    await youtubeWizard.locator('[data-testid="client-secret-input"] input').fill('secret123');
    await youtubeWizard.locator('[data-testid="redirect-uri-input"] input').fill('not-a-url');
    
    await youtubeWizard.locator('[data-testid="save-button"]').click();
    
    // Should show Zod validation error for invalid URL
    await expect(youtubeWizard.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(youtubeWizard.locator('[data-testid="error-message"]')).toContainText('Invalid Redirect URI');
  });
});
