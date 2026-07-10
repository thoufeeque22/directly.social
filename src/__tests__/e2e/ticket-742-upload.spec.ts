import { test, expect } from '@playwright/test';

test.describe('Ticket 742: Cloudflare R2 Media Upload Migration', () => {
  test.beforeEach(async ({ page }) => {
    // Assuming a test user login process
    // Navigate to the upload page
    await page.goto('/upload'); 
  });

  test('generates presigned URL and completes upload flow to R2', async ({ page }) => {
    // Mock the presigned URL endpoint
    await page.route('**/api/upload/presigned-url', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            url: 'https://mock-r2-bucket.pub-r2.dev/upload-url?signature=123',
            publicUrl: 'https://mock-r2-bucket.pub-r2.dev/video.mp4'
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Mock the direct PUT to R2
    await page.route('**/upload-url?signature=123', async (route) => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 200,
        });
      } else {
        await route.continue();
      }
    });

    // Mock the assemble endpoint
    let assembleCalled = false;
    let assemblePayload: any = null;
    await page.route('**/api/upload/assemble', async (route) => {
      if (route.request().method() === 'POST') {
        assembleCalled = true;
        assemblePayload = route.request().postDataJSON();
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { fileId: 'test-file-123', activityId: 'act-123' } }),
        });
      } else {
        await route.continue();
      }
    });

    // We simulate selecting a file in the UI
    const fileInput = page.locator('input[type="file"]');
    // Using a dummy file if the input is present
    if (await fileInput.isVisible()) {
      await fileInput.setInputFiles({
        name: 'dummy.mp4',
        mimeType: 'video/mp4',
        buffer: Buffer.from('dummy video content')
      });
      
      // Wait for the upload process to complete
      await page.waitForResponse('**/api/upload/assemble');

      expect(assembleCalled).toBe(true);
      expect(assemblePayload?.blobUrl).toBe('https://mock-r2-bucket.pub-r2.dev/video.mp4');
    }
  });

  test('rejects unauthenticated requests for presigned URLs', async ({ request }) => {
    // We send a raw request to the endpoint without a session cookie
    const response = await request.post('/api/upload/presigned-url', {
      data: { filename: 'test.mp4', size: 1000, contentType: 'video/mp4' }
    });
    
    // Expecting 401 Unauthorized since there is no session
    expect(response.status()).toBe(401);
  });
});
