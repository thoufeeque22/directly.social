import { test, expect } from '@playwright/test';

test.describe('TikTok Integration - Ticket #418', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD || '');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('Happy Path: Authenticate TikTok account successfully', async ({ page }) => {
    await page.goto('/settings/integrations');
    await page.click('button:has-text("Connect TikTok")');
    await page.waitForURL('**/settings/integrations?tiktok_success=true');
    await expect(page.locator('text=TikTok Connected Successfully')).toBeVisible();
  });

  test('Happy Path: Upload a <50MB video in a single chunk', async ({ page }) => {
    await page.goto('/publish');
    await page.setInputFiles('input[type="file"]', 'tests/fixtures/small_video.mp4');
    await page.click('button:has-text("Publish to TikTok")');
    await expect(page.locator('text=Upload Successful')).toBeVisible();
    await expect(page.locator('.publish-id')).not.toBeEmpty();
  });

  test('Happy Path: Upload a >50MB video with multi-chunk', async ({ page }) => {
    await page.goto('/publish');
    await page.setInputFiles('input[type="file"]', 'tests/fixtures/large_video.mp4');
    await page.click('button:has-text("Publish to TikTok")');
    await expect(page.locator('text=Uploading chunk 1')).toBeVisible();
    await expect(page.locator('text=Upload Successful')).toBeVisible();
  });

  test('Edge Case: Video exceeds max resolution or size limit', async ({ page }) => {
    await page.goto('/publish');
    await page.setInputFiles('input[type="file"]', 'tests/fixtures/huge_unsupported_video.mp4');
    await page.click('button:has-text("Publish to TikTok")');
    await expect(page.locator('text=Error: Video exceeds maximum resolution or size limit')).toBeVisible();
  });

  test('Negative Scenario: Expired access token triggers re-auth', async ({ page }) => {
    await page.evaluate(() => window.localStorage.setItem('tiktok_token', 'EXPIRED'));
    await page.goto('/publish');
    await page.setInputFiles('input[type="file"]', 'tests/fixtures/small_video.mp4');
    await page.click('button:has-text("Publish to TikTok")');
    await expect(page.locator('text=Your TikTok session has expired. Please reconnect.')).toBeVisible();
    await expect(page).toHaveURL(/.*settings\/integrations.*/);
  });
});
