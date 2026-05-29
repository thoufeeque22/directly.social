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
    
    // Mock Server Actions for platform BYOK
    await page.route('**/settings/byok*', async (route) => {
      const method = route.request().method();
      const headers = route.request().headers();
      
      if (method === 'POST' && headers['next-action']) {
        // Mock payload inspection to simulate validation logic
        const postData = route.request().postData();
        const isInvalid = postData?.includes('invalid-id');

        if (isInvalid) {
          await route.fulfill({
            status: 200,
            contentType: 'text/x-component',
            body: '1:{"success":false,"error":"Invalid credentials for tiktok"}'
          });
        } else {
          await route.fulfill({
            status: 200,
            contentType: 'text/x-component',
            body: '1:{"success":true}'
          });
        }
      } else {
        await route.continue();
      }
    });
  });

  test('happy path: save valid credentials for youtube', async ({ page }) => {
    const youtubeWizard = page.locator('[data-testid="byok-wizard-youtube"]');
    
    // Fill credentials
    await youtubeWizard.locator('[data-testid="client-id-input"] input').fill('valid');
    await youtubeWizard.locator('[data-testid="client-secret-input"] input').fill('valid-secret');
    await youtubeWizard.locator('[data-testid="redirect-uri-input"] input').fill('https://socialstudio.ai/callback');

    // Click save
    await youtubeWizard.locator('[data-testid="save-button"]').click();
    
    // Wait for success message
    await expect(youtubeWizard.locator('[data-testid="success-message"]')).toBeVisible();
    
    // Verify it doesn't show error after success
    await expect(youtubeWizard.locator('[data-testid="error-message"]')).not.toBeVisible();
  });

  test('negative path: invalid credentials trigger error for tiktok', async ({ page }) => {
    const tiktokWizard = page.locator('[data-testid="byok-wizard-tiktok"]');
    
    // Fill invalid credentials
    await tiktokWizard.locator('[data-testid="client-id-input"] input').fill('invalid-id');
    await tiktokWizard.locator('[data-testid="client-secret-input"] input').fill('wrong-secret');
    await tiktokWizard.locator('[data-testid="redirect-uri-input"] input').fill('https://socialstudio.ai/callback');

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
    await youtubeWizard.locator('[data-testid="redirect-uri-input"] input').fill('https://socialstudio.ai/callback');
    await youtubeWizard.locator('[data-testid="save-button"]').click();
    
    await page.screenshot({ path: 'verification/byok-wizard-success.png', fullPage: true });
    await expect(youtubeWizard.locator('[data-testid="success-message"]')).toBeVisible();
  });
});
