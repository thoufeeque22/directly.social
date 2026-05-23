import { test, expect } from '@playwright/test';

test.describe('BYOS - Bring Your Own Storage', () => {
  test.beforeEach(async ({ page }) => {
    // Default mock for BYOS settings (not configured)
    await page.route('**/api/settings/byos', async (route) => {
      const method = route.request().method();
      if (method === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ config: null }) });
      } else if (method === 'POST') {
        await route.fulfill({
          status: 200, contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            config: {
              provider: 'R2', bucketName: 'social-studio-test-bucket', region: 'auto',
              endpoint: 'https://test-account.r2.cloudflarestorage.com',
              accessKeyId: 'test-access-key', secretAccessKey: 'test-secret-key',
              pathPrefix: '', keepFiles: true,
            },
          }),
        });
      } else if (method === 'DELETE') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
      }
    });
  });

  test('should complete the full BYOS configuration stepper successfully', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');

    // Switch to Storage Tab
    await page.getByRole('tab', { name: /Storage/i }).click();

    // Step 0: Select Provider
    await page.getByRole('heading', { name: 'Cloudflare R2' }).click();
    await page.getByRole('button', { name: /continue/i }).click();

    // Step 1: Configure CORS
    await expect(page.getByText('Recommended CORS JSON Rules')).toBeVisible();
    await page.getByRole('button', { name: /continue/i }).click();

    // Step 2: Enter Credentials
    await page.locator('#byos-bucket-name').fill('social-studio-test-bucket');
    await page.locator('#byos-endpoint').fill('https://test-account.r2.cloudflarestorage.com');
    await page.locator('#byos-access-key-id').fill('test-access-key-id');
    await page.locator('#byos-secret-access-key').fill('test-secret-access-key');
    await page.getByRole('button', { name: /continue/i }).click();

    // Step 3: Test & Save
    await page.getByRole('button', { name: /Run Active Connection Checks & Save/i }).click();
    await expect(page.getByText('Connection Active')).toBeVisible();
  });

  test('should handle invalid credentials gracefully', async ({ page }) => {
    // Override POST mock for this test
    await page.route('**/api/settings/byos', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ error: 'Invalid AWS Credentials' }) });
      } else {
        await route.continue();
      }
    });

    await page.goto('/settings');
    await page.getByRole('tab', { name: /Storage/i }).click();

    await page.getByRole('heading', { name: 'AWS S3 Compatible' }).click();
    await page.getByRole('button', { name: /continue/i }).click(); // Step 1
    await page.getByRole('button', { name: /continue/i }).click(); // Step 2

    await page.locator('#byos-bucket-name').fill('invalid');
    await page.locator('#byos-region').fill('us-east-1');
    await page.locator('#byos-access-key-id').fill('wrong');
    await page.locator('#byos-secret-access-key').fill('wrong');
    await page.getByRole('button', { name: /continue/i }).click();

    await page.getByRole('button', { name: /Run Active Connection Checks & Save/i }).click();
    await expect(page.getByText('Validation Failed')).toBeVisible();
    await expect(page.getByText('Invalid AWS Credentials')).toBeVisible();
  });

  test('should display active BYOS badge on dashboard when configured', async ({ page }) => {
    // Override GET mock
    await page.route('**/api/settings/byos', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200, contentType: 'application/json',
          body: JSON.stringify({ config: { provider: 'S3', bucketName: 'active-s3' } }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/');
    await expect(page.getByText('BYOS: S3 Active Pipeline')).toBeVisible();
  });
});
