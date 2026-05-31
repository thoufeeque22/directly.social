import { test, expect } from './base-test';;

test.describe('Platform Sequential Journey @regression', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to settings
    await page.goto('/settings');
  });

  test('should verify the sequential setup flow for YouTube Shorts', async ({ page }) => {
    // Wait for the page to be fully stable
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const youtubeCard = page.getByTestId('platform-card-youtube');
    await expect(youtubeCard).toBeVisible({ timeout: 10000 });
    
    // 1. Ensure the "YouTube Shorts" card is in a known state (Disabled).
    const muiSwitch = youtubeCard.getByRole('switch');
    const isChecked = await muiSwitch.isChecked();
    if (isChecked) {
      await muiSwitch.evaluate(el => (el as HTMLInputElement).click());
      await expect(muiSwitch).not.toBeChecked({ timeout: 10000 });
    }
    
    await expect(muiSwitch).not.toBeChecked();
    await page.screenshot({ path: 'verification/journey-1-disabled.png', fullPage: true });

    // 2. Toggle it "On". Verify that the "Configuration" accordion appears.
    // Use evaluate to bypass any interception or event issues
    await muiSwitch.evaluate(el => (el as HTMLInputElement).click());
    
    // Wait for the switch to actually reflect the new state (optimistic or real)
    await expect(muiSwitch).toBeChecked({ timeout: 10000 });
    
    // Now look for the configuration section
    await expect(youtubeCard.getByText('Configuration')).toBeVisible({ timeout: 10000 });
    await page.screenshot({ path: 'verification/journey-2-enabled.png', fullPage: true });

    // 3. Verify that the "Account Connection" section is visible inside the configuration area.
    await expect(youtubeCard.getByText('Account Connection')).toBeVisible({ timeout: 10000 });

    // 4. Verify that the "Advanced Settings (BYOK)" section is visible below the connection.
    await expect(youtubeCard.getByText('Advanced Settings (BYOK)')).toBeVisible();

    // 5. Fill in mock credentials in the BYOK wizard and save it.
    // Use 'valid' as Client ID to satisfy the mock validator in src/lib/byok/credential-validator.ts
    const clientIdInput = youtubeCard.getByTestId('client-id-input').locator('input');
    const clientSecretInput = youtubeCard.getByTestId('client-secret-input').locator('input');
    const redirectUriInput = youtubeCard.getByTestId('redirect-uri-input').locator('input');
    
    await clientIdInput.fill('valid');
    await clientSecretInput.fill('mock-client-secret');
    await redirectUriInput.fill('https://example.com/callback');

    await youtubeCard.getByTestId('save-button').click();

    // Verify success message
    await expect(youtubeCard.getByTestId('success-message')).toBeVisible({ timeout: 10000 });
    await page.screenshot({ path: 'verification/journey-3-byok-saved.png', fullPage: true });
  });
});
