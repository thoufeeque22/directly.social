
import { test, expect, Page } from '@playwright/test';
import path from 'path';

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
      ? page.getByRole('button', { name: 'Upload' }) 
      : page.getByTestId('header-upload-button');
    
    await uploadButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(TEST_VIDEO_PATH);

    const uploadCompleteNotification = page.getByText('Upload complete!');
    await expect(uploadCompleteNotification).toBeVisible({ timeout: 20000 });
    await expect(uploadCompleteNotification).toBeHidden({ timeout: 10000 });
  }
  await expect(page.getByTestId('media-asset-card')).toHaveCount(count);
}


test.describe('Media Library E2E Tests', () => {

  // Use a single page object for all tests in this describe block
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    // Create a single browser context and page for all tests
    const context = await browser.newContext();
    page = await context.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  // Before each test, navigate and clean up the library
  test.beforeEach(async () => {
    await page.goto(MEDIA_PAGE_URL);
    
    // Universal cleanup: Check if the 'Clear Gallery' button is present and use it.
    // This is more reliable than checking for the empty state text.
    await page.waitForLoadState('networkidle');
    const clearGalleryButton = page.getByRole('button', { name: 'Clear Gallery' });

    const isVisible = await clearGalleryButton.isVisible();
    if (isVisible) {
      await clearGalleryButton.click();
      await page.getByRole('button', { name: 'Delete' }).click();
      await expect(page.getByText('Your media library is empty.')).toBeVisible({ timeout: 15000 });
    }
  });

  test('should display the empty state correctly', async () => {
    await expect(page.getByText('Your media library is empty.')).toBeVisible();
    await expect(page.getByText('Upload your first asset to get started.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Upload' })).toBeVisible();
  });

  test('should upload a single video and display it', async () => {
    await uploadAssets(page, 1);
    await expect(page.getByTestId('media-asset-card')).toBeVisible();
  });
  
  test('should display video duration text on the asset card', async () => {
    await uploadAssets(page, 1);
    const assetCard = page.getByTestId('media-asset-card');
    // The mock data should produce a duration. We check for a plausible format.
    await expect(assetCard.getByText(/\d+m remaining/)).toBeVisible();
  });

  test('should allow searching for a video', async () => {
    await uploadAssets(page, 1);
    
    await page.getByPlaceholder('Search...').fill('window');
    await expect(page.getByTestId('media-asset-card')).toHaveCount(1);

    await page.getByPlaceholder('Search...').fill('non-existent-file');
    await expect(page.getByText('No assets found for your search.')).toBeVisible();
    await expect(page.getByTestId('media-asset-card')).not.toBeVisible();
  });

  test('should allow selecting and deselecting videos', async () => {
    await uploadAssets(page, 2);

    const firstAsset = page.getByTestId('media-asset-card').nth(0);
    const secondAsset = page.getByTestId('media-asset-card').nth(1);

    await firstAsset.click();
    await expect(page.getByText('1 item selected')).toBeVisible();

    await secondAsset.click();
    await expect(page.getByText('2 items selected')).toBeVisible();

    await firstAsset.click();
    await expect(page.getByText('1 item selected')).toBeVisible();
  });

  test('should use "Select All" to select and deselect all videos', async () => {
    await uploadAssets(page, 2);
    const selectAllCheckbox = page.getByTestId('select-all-checkbox');

    await selectAllCheckbox.check();
    await expect(page.getByText('2 items selected')).toBeVisible();

    await selectAllCheckbox.uncheck();
    await expect(page.getByText('2 items selected')).not.toBeVisible();
  });

  test('should delete an individual video using the card"s delete button', async () => {
    await uploadAssets(page, 1);
    
    const assetCard = page.getByTestId('media-asset-card');
    await assetCard.hover();
    
    const deleteButton = assetCard.getByRole('button', { name: 'Delete Asset' });
    await deleteButton.click();
    
    await expect(page.getByText('Are you sure you want to delete this asset?')).toBeVisible();
    await page.getByRole('button', { name: 'Delete' }).click();
    
    await expect(page.getByText('Your media library is empty.')).toBeVisible({ timeout: 15000 });
  });

  test('should allow bulk deleting selected videos', async () => {
    await uploadAssets(page, 2);
    
    await page.getByTestId('select-all-checkbox').check();
    await expect(page.getByText('2 items selected')).toBeVisible();

    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByText('Are you sure you want to delete the selected assets?')).toBeVisible();
    await page.getByRole('button', { name: 'Delete' }).nth(1).click();
    
    await expect(page.getByText('Your media library is empty.')).toBeVisible({ timeout: 15000 });
  });

  test('should clear the entire gallery with "Clear Gallery"', async () => {
    await uploadAssets(page, 3);
    
    await page.getByRole('button', { name: 'Clear Gallery' }).click();
    await expect(page.getByText('Are you sure you want to delete ALL assets?')).toBeVisible();
    await page.getByRole('button', { name: 'Delete' }).click();

    await expect(page.getByText('Your media library is empty.')).toBeVisible({ timeout: 15000 });
  });

});

test.describe('Media Library Mobile Viewport', () => {
  test('should render correctly on a mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
    await page.goto(MEDIA_PAGE_URL);
    await expect(page.getByText('Your media library is empty.')).toBeVisible();
    
    // A simplified upload check for mobile
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Upload' }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(TEST_VIDEO_PATH);

    const uploadCompleteNotification = page.getByText('Upload complete!');
    await expect(uploadCompleteNotification).toBeVisible({ timeout: 20000 });
    await expect(uploadCompleteNotification).toBeHidden({ timeout: 10000 });

    await expect(page.getByTestId('media-asset-card')).toBeVisible();
    
    // Check that the search bar and some key elements are visible
    await expect(page.getByPlaceholder('Search...')).toBeVisible();
  });
});
