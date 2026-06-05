import { test, expect } from './base-test';;

test.describe('BYOS - Bring Your Own Storage @regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(1000);
  });

  test('should complete the full BYOS configuration stepper successfully', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Switch to Storage Tab
    await page.getByRole('tab', { name: /Storage/i }).click();
    await page.waitForTimeout(1000); // Wait for tab transition and hydration

    // Step 0: Select Provider
    const r2Option = page.getByRole('heading', { name: 'Cloudflare R2' });
    await expect(r2Option).toBeVisible();
    await r2Option.click();
    await page.waitForTimeout(500); // Wait for state change to R2
    await page.getByRole('button', { name: /continue/i }).click();
    await page.waitForTimeout(500);

    // Step 1: Configure CORS
    await expect(page.getByText('Recommended CORS JSON Rules')).toBeVisible();
    await page.getByRole('button', { name: /continue/i }).click();
    await page.waitForTimeout(500);

    // Step 2: Enter Credentials
    await page.locator('#byos-bucket-name').fill('directly-test-bucket');
    await page.locator('#byos-endpoint').fill('https://test-account.r2.cloudflarestorage.com');
    await page.locator('#byos-access-key-id').fill('test-access-key-id');
    await page.locator('#byos-secret-access-key').fill('test-secret-access-key');
    await page.getByRole('button', { name: /continue/i }).click();

    // Step 3: Test & Save
    await page.getByRole('button', { name: /Run Active Connection Checks & Save/i }).click();
    
    // Wait for the simulated validation steps to complete
    // Use .first() to avoid strict mode violation if rendered multiple times
    await expect(page.getByText('Connection Active').first()).toBeVisible({ timeout: 10000 });
  });

  test('should handle invalid credentials gracefully', async ({ page }) => {
    // For negative path, we use the real server action with invalid-id bypass
    await page.getByRole('tab', { name: /Storage/i }).click();
    await page.waitForTimeout(1000); // Wait for tab transition and hydration

    await page.getByRole('heading', { name: 'AWS S3 Compatible' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /continue/i }).click(); // Step 1
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /continue/i }).click(); // Step 2
    await page.waitForTimeout(500);

    await page.locator('#byos-bucket-name').fill('invalid');
    await page.locator('#byos-region').fill('us-east-1');
    await page.locator('#byos-access-key-id').fill('invalid-id');
    await page.locator('#byos-secret-access-key').fill('wrong');
    await page.getByRole('button', { name: /continue/i }).click();

    await page.getByRole('button', { name: /Run Active Connection Checks & Save/i }).click();
    await expect(page.getByText('Validation Failed').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Invalid AWS Credentials').first()).toBeVisible();
  });

  test('should display active BYOS badge on dashboard when configured', async ({ page }) => {
    await page.goto('/');
    // Our bypass in Server Action should return a mock config for any user in E2E mode
    await expect(page.getByText('BYOS: S3 Active Pipeline').first()).toBeVisible();
  });
});
