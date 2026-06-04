import { test, expect } from '../base-test';;

test.describe('BYOK Integration Wizard E2E @regression', () => {
  test.beforeEach(async ({ page }) => {
    // Zero console error monitoring
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (
          !text.includes('React does not recognize') && 
          !text.includes('non-boolean attribute') &&
          !text.includes('hydration-mismatch') &&
          !text.includes('429')
        ) {
          throw new Error(`Console Error detected: ${text}`);
        }
      }
    });

    // Zero network error monitoring (4xx/5xx)
    page.on('response', response => {
      if (response.status() >= 400 && !response.url().includes('sentry') && response.status() !== 429) {
        throw new Error(`Network Error detected: ${response.status()} ${response.url()}`);
      }
    });

    await page.goto('/settings/byok');
    // No more RSC mocking here - let the real Server Action handle it
  });

  test('happy path: save valid credentials for youtube', async ({ page }) => {
    const youtubeWizard = page.locator('[data-testid="byok-wizard-youtube"]');
    
    // Fill credentials - 'valid' is a special keyword in our local validator mock
    await youtubeWizard.locator('[data-testid="client-id-input"] input').fill('valid');
    await youtubeWizard.locator('[data-testid="client-secret-input"] input').fill('valid-secret');
    await youtubeWizard.locator('[data-testid="redirect-uri-input"] input').fill('https://directly.social/callback');

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
    await tiktokWizard.locator('[data-testid="client-id-input"] input').fill('invalid-id');
    await tiktokWizard.locator('[data-testid="client-secret-input"] input').fill('wrong-secret');
    await tiktokWizard.locator('[data-testid="redirect-uri-input"] input').fill('https://directly.social/callback');

    // Click save
    await tiktokWizard.locator('[data-testid="save-button"]').click();
    
    await expect(tiktokWizard.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(tiktokWizard.locator('[data-testid="error-message"]')).toContainText('Invalid credentials');
  });

  test('visual audit: verify layout state', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'verification/byok-wizard-idle.png', fullPage: true });
    
    const youtubeWizard = page.locator('[data-testid="byok-wizard-youtube"]');
    await expect(youtubeWizard.locator('text=Step 1: Get Your Keys')).toBeVisible();
    await expect(youtubeWizard.locator('text=Step 2: Configure Credentials')).toBeVisible();
    
    // Fill something to check dirty state
    await youtubeWizard.locator('[data-testid="client-id-input"] input').fill('test');
    await page.screenshot({ path: 'verification/byok-wizard-dirty.png', fullPage: true });

    // Save and check success layout
    await youtubeWizard.locator('[data-testid="client-id-input"] input').fill('valid');
    await youtubeWizard.locator('[data-testid="client-secret-input"] input').fill('valid');
    await youtubeWizard.locator('[data-testid="redirect-uri-input"] input').fill('https://directly.social/callback');
    await youtubeWizard.locator('[data-testid="save-button"]').click();
    
    await page.screenshot({ path: 'verification/byok-wizard-success.png', fullPage: true });
    await expect(youtubeWizard.locator('[data-testid="success-message"]')).toBeVisible();
  });
});
