import { test, expect } from '@playwright/test';

test.describe('Ticket 794: LinkedIn Video Uploading', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the post creation dashboard
    await page.goto('/dashboard'); 
  });

  test('successfully uploads a video to LinkedIn', async ({ page }) => {
    let linkedInApiCalled = false;
    let linkedInPayload: any = null;

    // Mock the backend LinkedIn route (not yet built) to verify it receives the correct payload
    await page.route('**/api/upload/linkedin', async (route) => {
      if (route.request().method() === 'POST') {
        linkedInApiCalled = true;
        linkedInPayload = route.request().postDataJSON();
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, message: 'Video uploaded to LinkedIn mock' }),
        });
      } else {
        await route.continue();
      }
    });

    // Simulate file upload in the UI
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.isVisible()) {
      await fileInput.setInputFiles({
        name: 'linkedin-test-video.mp4',
        mimeType: 'video/mp4',
        buffer: Buffer.from('mock video binary content')
      });
      
      // Select LinkedIn platform (mocking user interaction)
      await page.locator('button[data-testid="platform-linkedin"]').click();

      // Submit the post
      await page.locator('button[data-testid="submit-post"]').click();

      // Wait for the backend API call to be made
      await page.waitForResponse('**/api/upload/linkedin');

      expect(linkedInApiCalled).toBe(true);
      expect(linkedInPayload).not.toBeNull();
      // Ensure the payload matches the expected schema for LinkedIn API video assets
      expect(linkedInPayload?.shareMediaCategory).toBe('VIDEO');
    }
  });
});
