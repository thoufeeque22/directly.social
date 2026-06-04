import { test, expect } from '../base-test';;
import fs from 'fs';

test.describe('BYOK Wizard Visual Audit', () => {
  test.beforeAll(async () => {
    const dir = 'verification';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  });

  test('capture visual states of BYOK wizard', async ({ page }) => {
    await page.goto('/settings/byok');
    
    // 1. Idle state
    await page.screenshot({ path: 'verification/byok-wizard-idle.png', fullPage: true });
    
    // 2. Filled state for YouTube
    const youtubeWizard = page.locator('[data-testid="byok-wizard-youtube"]');
    await youtubeWizard.locator('[data-testid="client-id-input"] input').fill('test-client-id');
    await youtubeWizard.locator('[data-testid="client-secret-input"] input').fill('test-client-secret');
    await page.screenshot({ path: 'verification/byok-wizard-filled.png', fullPage: true });
    
    // 3. Error state for TikTok
    const tiktokWizard = page.locator('[data-testid="byok-wizard-tiktok"]');
    await tiktokWizard.locator('[data-testid="client-id-input"] input').fill('invalid');
    await tiktokWizard.locator('[data-testid="save-button"]').click();
    await expect(tiktokWizard.locator('[data-testid="error-message"]')).toBeVisible();
    await page.screenshot({ path: 'verification/byok-wizard-error.png', fullPage: true });

    // 4. Success state for YouTube
    await youtubeWizard.locator('[data-testid="client-id-input"] input').fill('valid');
    await youtubeWizard.locator('[data-testid="client-secret-input"] input').fill('valid-secret');
    await youtubeWizard.locator('[data-testid="redirect-uri-input"] input').fill('https://directly.social/callback');
    await youtubeWizard.locator('[data-testid="save-button"]').click();
    await expect(youtubeWizard.locator('[data-testid="success-message"]')).toBeVisible();
    await page.screenshot({ path: 'verification/byok-wizard-success.png', fullPage: true });
  });
});
