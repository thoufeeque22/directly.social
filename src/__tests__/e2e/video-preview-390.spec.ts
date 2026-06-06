import { test, expect } from './base-test';

test.describe('Ticket 390: Video Player Preview', () => {
  test('should display video player and metadata after file upload @regression', async ({ page }) => {
    // Note: If the E2E environment is rate-limited on auth, this test will fail at setup.
    // Assuming auth succeeds:
    await page.goto('/');

    // Ensure we are on the dashboard
    await expect(page.locator('h2:has-text("Upload & Automate")')).toBeVisible();
    await page.waitForTimeout(1000); // Wait for React hydration to complete

    // Create a dummy file buffer to simulate upload. 
    // Note: Real video metadata extraction requires an actual valid video file. 
    // This tests the UI reaction to the file input.
    const fileContent = Buffer.from('fake-video-content');

    // Upload the file
    await page.setInputFiles('input[type="file"]', {
      name: 'e2e-test-video.mp4',
      mimeType: 'video/mp4',
      buffer: fileContent,
    });

    // Verify the UI updates to show the video player component
    // The VideoPlayerPreview displays the filename in a success badge
    await expect(page.locator('text=e2e-test-video.mp4 attached')).toBeVisible();

    // Verify the video element is rendered
    await expect(page.locator('video')).toBeVisible();

    // Verify the format badge is rendered (default is Short-Form for dummy files without real metadata)
    await expect(page.locator('text=Format:')).toBeVisible();
    await expect(page.locator('text=Short-Form').or(page.locator('text=Long-Form'))).toBeVisible();
  });
});
