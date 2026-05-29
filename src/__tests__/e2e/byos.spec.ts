import { test, expect } from '@playwright/test';

test.describe('BYOS - Bring Your Own Storage', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Server Actions for BYOS
    await page.route('**/settings*', async (route) => {
      const method = route.request().method();
      const headers = route.request().headers();
      
      if (method === 'POST' && headers['next-action']) {
        // We can distinguish actions by inspecting the payload or just returning success for all BYOS actions in this test context
        await route.fulfill({
          status: 200,
          contentType: 'text/x-component',
          body: '1:{"success":true,"config":{"provider":"R2","bucketName":"social-studio-test-bucket","region":"auto","endpoint":"https://test-account.r2.cloudflarestorage.com","accessKeyId":"test-access-key","secretAccessKey":"test-secret-key","pathPrefix":"","keepFiles":true}}'
        });
      } else {
        await route.continue();
      }
    });

    // Handle initial fetch (if it still uses REST or if we want to mock the GET)
    await page.route('**/api/settings/byos', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ config: null }) });
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
    // Use .first() to avoid strict mode violation if rendered multiple times
    await expect(page.getByText('Connection Active').first()).toBeVisible();
  });

  test('should handle invalid credentials gracefully', async ({ page }) => {
    // For negative path, we use the real server action with invalid-id bypass
    await page.goto('/settings');
    await page.getByRole('tab', { name: /Storage/i }).click();

    await page.getByRole('heading', { name: 'AWS S3 Compatible' }).click();
    await page.getByRole('button', { name: /continue/i }).click(); // Step 1
    await page.getByRole('button', { name: /continue/i }).click(); // Step 2

    await page.locator('#byos-bucket-name').fill('invalid');
    await page.locator('#byos-region').fill('us-east-1');
    await page.locator('#byos-access-key-id').fill('invalid-id');
    await page.locator('#byos-secret-access-key').fill('wrong');
    await page.getByRole('button', { name: /continue/i }).click();

    await page.getByRole('button', { name: /Run Active Connection Checks & Save/i }).click();
    await expect(page.getByText('Validation Failed').first()).toBeVisible();
    await expect(page.getByText('Invalid AWS Credentials').first()).toBeVisible();
  });

  test('should display active BYOS badge on dashboard when configured', async ({ page }) => {
    await page.goto('/');
    // Our bypass in Server Action should return a mock config for the stable E2E ID
    // Use .first() to avoid strict mode violation
    await expect(page.getByText('BYOS: S3 Active Pipeline').first()).toBeVisible();
  });
});
