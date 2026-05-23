import { test, expect } from '@playwright/test';

test.describe('BYOS - Bring Your Own Storage Configuration', () => {
  test('should complete the full BYOS configuration stepper successfully', async ({ page }) => {
    // Mock the settings API calls to prevent requiring real S3 credentials in testing environment
    await page.route('**/api/settings/byos', async (route) => {
      const method = route.request().method();
      if (method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ config: null }),
        });
      } else if (method === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            config: {
              provider: 'R2',
              bucketName: 'social-studio-test-bucket',
              region: 'auto',
              endpoint: 'https://test-account.r2.cloudflarestorage.com',
              accessKeyId: 'test-access-key',
              secretAccessKey: 'test-secret-key',
              pathPrefix: '',
              keepFiles: true,
            },
          }),
        });
      } else if (method === 'DELETE') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      }
    });

    await page.goto('/settings');
    await page.waitForLoadState('networkidle');

    // Locate the Storage (BYOS) Tab (Tab #3, the 4th tab)
    const storageTab = page.locator('button[role="tab"]').nth(3);
    await expect(storageTab).toBeVisible();
    await storageTab.click();

    // Verify ByosWizard is rendered
    await expect(page.getByText('Bring Your Own Storage (BYOS)')).toBeVisible();

    // Step 0: Select Provider
    await expect(page.getByText('Select your storage provider')).toBeVisible();
    
    // Choose Cloudflare R2
    const r2Card = page.getByRole('heading', { name: 'Cloudflare R2' });
    await expect(r2Card).toBeVisible();
    await r2Card.click();

    // Click Continue
    await page.getByRole('button', { name: /continue/i }).click();

    // Step 1: Configure CORS
    await expect(page.getByText('Recommended CORS JSON Rules')).toBeVisible();
    await page.getByRole('button', { name: /continue/i }).click();

    // Step 2: Enter Credentials
    await expect(page.getByText('Enter the bucket parameters')).toBeVisible();

    // Fill the inputs using accessible IDs corresponding to native htmlFor labels
    await page.locator('#byos-bucket-name').fill('social-studio-test-bucket');
    await page.locator('#byos-endpoint').fill('https://test-account.r2.cloudflarestorage.com');
    await page.locator('#byos-access-key-id').fill('test-access-key-id');
    await page.locator('#byos-secret-access-key').fill('test-secret-access-key');

    // Click Continue
    await page.getByRole('button', { name: /continue/i }).click();

    // Step 3: Test & Save
    await expect(page.getByText('Run Active Connection Checks & Save')).toBeVisible();
    await page.getByRole('button', { name: /Run Active Connection Checks & Save/i }).click();

    // Verify connection confirmation and active badge presence
    await expect(page.getByText('Connection Active')).toBeVisible();
  });
});
