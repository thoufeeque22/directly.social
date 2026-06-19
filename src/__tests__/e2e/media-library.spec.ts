
import { test, expect } from './base-test';
import { Page } from '@playwright/test';
import path from 'path';
import { promises as fs } from 'fs';

const MEDIA_PAGE_URL = '/media';
const TEST_VIDEO_PATH = path.resolve('./public/window.svg'); // Using an SVG as a mock video file

/**
 * Helper function to upload a specific number of assets.
 * @param page The Playwright Page object.
 *p * @param count The number of assets to upload.
 */
async function uploadAssets(page: Page, count: number) {
  for (let i = 0; i < count; i++) {
    const fileChooserPromise = page.waitForEvent('filechooser');
    
    // The 'Upload' button in the empty state is different from the one in the header
    const uploadButton = i === 0 && count === 1
      ? page.getByRole('button', { name: 'Upload' }).first()
      : page.getByTestId('header-upload-button');
    
    await uploadButton.click();
    const fileChooser = await fileChooserPromise;
    
    // To prevent backend deduplication (which uses sha256 checksums), 
    // we must generate a unique file content for each upload.
    const fileBuffer = await fs.readFile(TEST_VIDEO_PATH);
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 10)}_${i}`;
    const uniqueBuffer = Buffer.concat([fileBuffer, Buffer.from(`\n<!-- unique_${uniqueId} -->`)]);
    
    await fileChooser.setFiles({
      name: `mock_video_${uniqueId}.mp4`,
      mimeType: 'video/mp4',
      buffer: uniqueBuffer
    });

    const uploadCompleteNotification = page.getByText('Upload complete!');
    await expect(uploadCompleteNotification).toBeVisible({ timeout: 20000 });
    await expect(uploadCompleteNotification).toBeHidden({ timeout: 10000 });
  }
  await expect(page.getByTestId('media-asset-card')).toHaveCount(count);
}


test.describe('Media Library E2E Tests', () => {
  test.use({ authRole: 'tester' });

  // Use a single page object for all tests in this describe block
  
  
  
  test.beforeEach(async ({ page }) => {
    await page.goto(MEDIA_PAGE_URL);
    
    const emptyState = page.getByText('Your media library is empty.');
    const clearGalleryButton = page.getByRole('button', { name: 'Clear Gallery' });
    
    // Wait for the UI to settle into one of the two stable states
    await expect(emptyState.or(clearGalleryButton)).toBeVisible({ timeout: 15000 });

    // Universal cleanup
    if (await clearGalleryButton.isVisible()) {
      await clearGalleryButton.click();
      await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
      await expect(emptyState).toBeVisible({ timeout: 15000 });
    }
  });

  test('should display the empty state correctly', async ({ page }) => {
    await expect(page.getByText('Your media library is empty.')).toBeVisible();
    await expect(page.getByText('Upload your first asset to get started.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Upload' }).first()).toBeVisible();
  });

  test('should upload a single video and display it', async ({ page }) => {
    await uploadAssets(page, 1);
    await expect(page.getByTestId('media-asset-card')).toBeVisible();
  });
  
  test('should display video duration text on the asset card', async ({ page }) => {
    await uploadAssets(page, 1);
    const assetCard = page.getByTestId('media-asset-card');
    // The mock data should produce a duration. We check for a plausible format.
    await expect(assetCard.getByText(/\d+[dh] \d+[hm] remaining/)).toBeVisible();
  });

  test('should allow searching for a video', async ({ page }) => {
    await uploadAssets(page, 1);
    
    await page.getByPlaceholder('Search your library...').fill('mock_video');
    await expect(page.getByTestId('media-asset-card')).toHaveCount(1);

    await page.getByPlaceholder('Search your library...').fill('non-existent-file');
    await expect(page.getByText('No matching videos found.')).toBeVisible();
    await expect(page.getByTestId('media-asset-card')).not.toBeVisible();
  });

  test('should allow selecting and deselecting videos', async ({ page }) => {
    await uploadAssets(page, 2);

    const firstAsset = page.getByTestId('media-asset-card').nth(0).getByRole('checkbox');
    const secondAsset = page.getByTestId('media-asset-card').nth(1).getByRole('checkbox');

    await firstAsset.click();
    await expect(page.getByText('1 item selected')).toBeVisible();

    await secondAsset.click();
    await expect(page.getByText('2 items selected')).toBeVisible();

    await firstAsset.click();
    await expect(page.getByText('1 item selected')).toBeVisible();
  });

  test('should use "Select All" to select and deselect all videos', async ({ page }) => {
    await uploadAssets(page, 2);
    const selectAllCheckbox = page.getByTestId('select-all-checkbox');

    await selectAllCheckbox.check();
    await expect(page.getByText('2 items selected')).toBeVisible();

    await selectAllCheckbox.uncheck();
    await expect(page.getByText('2 items selected')).not.toBeVisible();
  });

  test('should delete an individual video using the card"s delete button', async ({ page }) => {
    await uploadAssets(page, 1);
    
    const assetCard = page.getByTestId('media-asset-card');
    await assetCard.hover();
    
    const deleteButton = assetCard.getByRole('button', { name: 'Delete Asset' });
    await deleteButton.click();
    
    await expect(page.getByText('Are you sure you want to delete this asset?')).toBeVisible();
    await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
    
    await expect(page.getByText('Your media library is empty.')).toBeVisible({ timeout: 15000 });
  });

  test('should allow bulk deleting selected videos', async ({ page }) => {
    await uploadAssets(page, 2);
    
    await page.getByTestId('select-all-checkbox').check();
    await expect(page.getByText('2 items selected')).toBeVisible();

    await page.getByRole('button', { name: 'Delete Selected' }).click();
    await expect(page.getByText('Are you sure you want to delete the selected assets?')).toBeVisible();
    await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
    
    await expect(page.getByText('Your media library is empty.')).toBeVisible({ timeout: 15000 });
  });

  test('should clear the entire gallery with "Clear Gallery"', async ({ page }) => {
    await uploadAssets(page, 3);
    
    await page.getByRole('button', { name: 'Clear Gallery' }).click();
    await expect(page.getByText('Are you sure you want to delete ALL assets?')).toBeVisible();
    await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();

    await expect(page.getByText('Your media library is empty.')).toBeVisible({ timeout: 15000 });
  });

});

test.describe('Media Library Mobile Viewport', () => {
  test.use({ authRole: 'tester' });
  test.beforeEach(async ({ page }) => {
    // Start listening for the media API response BEFORE navigating
    const mediaResponsePromise = page.waitForResponse(response => 
      response.url().includes('/api/media') && response.status() === 200
    );
    await page.goto(MEDIA_PAGE_URL);
    await mediaResponsePromise;
    
    // Wait for the UI to settle after data fetch
    await page.waitForTimeout(500); 

    const clearGalleryButton = page.getByRole('button', { name: 'Clear Gallery' });
    
    // Universal cleanup
    if (await clearGalleryButton.isVisible()) {
      await clearGalleryButton.click();
      await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
      await expect(page.getByText('Your media library is empty.')).toBeVisible({ timeout: 15000 });
    }
  });

  test('should render correctly on a mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
    await page.goto(MEDIA_PAGE_URL);
    await expect(page.getByText('Your media library is empty.')).toBeVisible();
    
    // A simplified upload check for mobile
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Upload' }).first().click();
    const fileChooser = await fileChooserPromise;
    const fileBuffer = await fs.readFile(TEST_VIDEO_PATH);
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const uniqueBuffer = Buffer.concat([fileBuffer, Buffer.from(`\n<!-- mobile_${uniqueId} -->`)]);
    await fileChooser.setFiles({
      name: `mobile_video_${uniqueId}.mp4`,
      mimeType: 'video/mp4',
      buffer: uniqueBuffer
    });

    const uploadCompleteNotification = page.getByText('Upload complete!');
    await expect(uploadCompleteNotification).toBeVisible({ timeout: 20000 });
    await expect(uploadCompleteNotification).toBeHidden({ timeout: 10000 });

    await expect(page.getByTestId('media-asset-card')).toBeVisible();
    
    // Check that the search bar and some key elements are visible
    await expect(page.getByPlaceholder('Search your library...')).toBeVisible();
  });
});
