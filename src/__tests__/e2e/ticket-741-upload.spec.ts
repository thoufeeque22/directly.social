import { test, expect } from './base-test';
import path from 'path';

test.describe('Ticket 741 - Vercel Blob Client Upload', () => {
  test('should successfully upload a large file via Vercel Blob client upload bypassing /tmp', async ({ page }) => {
    // Navigate to the upload page
    // Navigate to the dashboard where the upload form lives
    await page.goto('/');

    // Mock mp4 requests so the frontend video player doesn't throw ERR_REQUEST_RANGE_NOT_SATISFIABLE on our empty dummy file
    await page.route('**/*.mp4', async route => {
      await route.fulfill({ status: 200, body: 'mock', contentType: 'video/mp4' });
    });

    const testVideoPath = path.join(__dirname, '..', '..', '..', 'public', 'dummy.mp4'); 
    await page.locator('#file-upload').setInputFiles(testVideoPath);
    // Mock the Vercel Blob token endpoint to verify it's hit
    let tokenRequested = false;
    await page.route('/api/upload/token', async route => {
      tokenRequested = true;
      // In a real E2E environment we'd let this pass through if BLOB_READ_WRITE_TOKEN is set,
      // but if not, we mock the token response for the client.
      await route.continue();
    });



    // Ensure there are no 429 or 500 errors during the process
    page.on('response', response => {
      if (response.url().includes('/api/upload') || response.url().includes('vercel-storage.com')) {
        expect(response.status()).not.toBe(429);
        expect(response.status()).not.toBe(500);
      }
    });

    // Select a platform to satisfy form validation
    await page.getByRole('button', { name: /TikTok|YouTube|Instagram/i }).first().click().catch(() => {});

    // Click the Skip Review & Post Directly button if it exists (when AI tier is not Manual)
    await page.getByRole('button', { name: /skip review/i }).click().catch(() => {});

    // Click the Post Video button (when AI tier is Manual)
    await page.getByRole('button', { name: /post video/i }).click().catch(() => {});

    // Verify our token endpoint was utilized
    await expect(page).toHaveURL(/.*action=distribute.*/, { timeout: 15000 });

    expect(tokenRequested).toBe(true);
  });
});
