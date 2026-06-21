import { test, expect } from './base-test';

test.describe('BYOS Gallery - "My Cloud" Tab E2E @regression', () => {
  test.use({ authRole: 'tester' });

  test('should hide "My Cloud" tab if BYOS configuration is not present', async ({ page }) => {
    // Intercept BYOS settings check to return no config
    await page.route('**/api/settings/byos', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ config: null }),
      });
    });

    await page.goto('/media');
    await page.waitForLoadState('networkidle');

    // "My Cloud" tab should NOT be visible
    const myCloudTab = page.getByRole('tab', { name: /My Cloud/i });
    await expect(myCloudTab).not.toBeVisible();

    // Verify standard tabs are present
    await expect(page.getByRole('tab', { name: /Workspace/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Local/i })).toBeVisible();
  });

  test('should display "My Cloud" tab if BYOS configuration is present', async ({ page }) => {
    // Intercept BYOS settings check to return active config
    await page.route('**/api/settings/byos', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ config: { provider: 'r2', bucketName: 'directly-test' } }),
      });
    });

    await page.goto('/media');
    await page.waitForLoadState('networkidle');

    // "My Cloud" tab should be visible
    const myCloudTab = page.getByRole('tab', { name: /My Cloud/i });
    await expect(myCloudTab).toBeVisible();
  });

  test('should show skeleton loaders, empty state, and error alerts in "My Cloud" tab', async ({ page }) => {
    // 1. Setup route with active BYOS config
    await page.route('**/api/settings/byos', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ config: { provider: 'r2', bucketName: 'directly-test' } }),
      });
    });

    // 2. Intercept media listing with delay to check skeleton loaders
    let resolveRequest: () => void = () => {};
    const delayPromise = new Promise<void>((resolve) => {
      resolveRequest = resolve;
    });

    await page.route('**/api/media/byos*', async (route) => {
      await delayPromise;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: [], hasNextPage: false }),
      });
    });

    await page.goto('/media');
    await page.getByRole('tab', { name: /My Cloud/i }).click();

    // Assert skeleton loaders are visible
    const skeleton = page.locator('.MuiSkeleton-root');
    await expect(skeleton.first()).toBeVisible();

    // Complete the delayed request
    resolveRequest();

    // Assert empty state is displayed properly (centered CloudQueueIcon, correct text, no emojis)
    await expect(page.getByText('No assets found in your storage bucket')).toBeVisible();
    await expect(page.locator('svg[data-testid="CloudQueueIcon"]')).toBeVisible();

    // 3. Mock failure scenario to test theme-compliant error alert
    await page.route('**/api/media/byos*', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, error: 'Internal Server Error' }),
      });
    });

    // Click tab/trigger reload or retry if visible, or re-visit to trigger error state
    await page.goto('/media');
    await page.getByRole('tab', { name: /My Cloud/i }).click();

    const errorAlert = page.getByText('Failed to connect to storage. Verify credentials in settings.');
    await expect(errorAlert).toBeVisible();
    await expect(page.getByRole('button', { name: /Retry/i })).toBeVisible();
  });

  test('should render assets card grid layout, file details, and hover video preview', async ({ page }) => {
    await page.route('**/api/settings/byos', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ config: { provider: 'r2' } }),
      });
    });

    // Mock an external video asset
    await page.route('**/api/media/byos*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              key: 'uploads/demo-video.mp4',
              fileName: 'demo-video.mp4',
              fileSize: 15728640, // 15MB
              lastModified: '2026-06-21T15:00:00Z',
              status: 'External',
              fileId: null,
              previewUrl: 'https://directly-test.r2.cloudflarestorage.com/uploads/demo-video.mp4?token=mock',
            },
          ],
          hasNextPage: false,
        }),
      });
    });

    await page.goto('/media');
    await page.getByRole('tab', { name: /My Cloud/i }).click();

    // Assert card layout details are rendered
    const card = page.getByTestId('byos-asset-card').first();
    await expect(card.getByText('demo-video.mp4')).toBeVisible();
    await expect(card.getByText('15 MB')).toBeVisible();
    await expect(card.getByText('External')).toBeVisible(); // Status chip

    // Test hover video preview
    await card.hover();
    const videoPreview = card.locator('video');
    await expect(videoPreview).toBeVisible();
    await expect(videoPreview).toHaveAttribute('src', /demo-video.mp4/);

    // Unhover and verify video reverts
    await page.mouse.move(0, 0);
    await expect(videoPreview).not.toBeVisible();
  });

  test('should support bidirectional pagination using continuation token stack', async ({ page }) => {
    await page.route('**/api/settings/byos', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ config: { provider: 's3' } }),
      });
    });

    // Handle token-based pagination requests
    await page.route('**/api/media/byos*', async (route) => {
      const url = new URL(route.request().url());
      const token = url.searchParams.get('continuationToken');

      if (!token) {
        // Page 1
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: Array.from({ length: 12 }, (_, i) => ({
              key: `video-p1-${i}.mp4`,
              fileName: `video-p1-${i}.mp4`,
              fileSize: 5000000,
              lastModified: '2026-06-21T15:00:00Z',
              status: 'Cloud',
              fileId: `id-p1-${i}`,
              previewUrl: `https://s3.amazonaws.com/video-p1-${i}.mp4`,
            })),
            nextContinuationToken: 'token-page-2',
            hasNextPage: true,
          }),
        });
      } else if (token === 'token-page-2') {
        // Page 2
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: Array.from({ length: 12 }, (_, i) => ({
              key: `video-p2-${i}.mp4`,
              fileName: `video-p2-${i}.mp4`,
              fileSize: 6000000,
              lastModified: '2026-06-21T15:00:00Z',
              status: 'Cloud',
              fileId: `id-p2-${i}`,
              previewUrl: `https://s3.amazonaws.com/video-p2-${i}.mp4`,
            })),
            nextContinuationToken: 'token-page-3',
            hasNextPage: true,
          }),
        });
      } else if (token === 'token-page-3') {
        // Page 3
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: [
              {
                key: 'video-p3-0.mp4',
                fileName: 'video-p3-0.mp4',
                fileSize: 7000000,
                lastModified: '2026-06-21T15:00:00Z',
                status: 'Cloud',
                fileId: 'id-p3-0',
                previewUrl: 'https://s3.amazonaws.com/video-p3-0.mp4',
              },
            ],
            nextContinuationToken: null,
            hasNextPage: false,
          }),
        });
      }
    });

    await page.goto('/media');
    await page.getByRole('tab', { name: /My Cloud/i }).click();

    // Verify Page 1 items
    await expect(page.getByText('video-p1-0.mp4')).toBeVisible();
    const prevBtn = page.getByRole('button', { name: 'Previous Page' });
    const nextBtn = page.getByRole('button', { name: 'Next Page' });

    await expect(prevBtn).toBeDisabled();
    await expect(nextBtn).toBeEnabled();

    // Go to Page 2
    await nextBtn.click();
    await expect(page.getByText('video-p2-0.mp4')).toBeVisible();
    await expect(prevBtn).toBeEnabled();
    await expect(nextBtn).toBeEnabled();

    // Go to Page 3
    await nextBtn.click();
    await expect(page.getByText('video-p3-0.mp4')).toBeVisible();
    await expect(prevBtn).toBeEnabled();
    await expect(nextBtn).toBeDisabled();

    // Go Back to Page 2
    await prevBtn.click();
    await expect(page.getByText('video-p2-0.mp4')).toBeVisible();
    await expect(nextBtn).toBeEnabled();
  });

  test('should lazy-register external S3 asset on "Post" action and redirect page', async ({ page }) => {
    await page.route('**/api/settings/byos', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ config: { provider: 'r2' } }),
      });
    });

    await page.route('**/api/media/byos*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              key: 'external-asset.mp4',
              fileName: 'external-asset.mp4',
              fileSize: 102400,
              lastModified: '2026-06-21T15:00:00Z',
              status: 'External',
              fileId: null,
              previewUrl: 'https://mock.r2.com/external-asset.mp4',
            },
          ],
          hasNextPage: false,
        }),
      });
    });

    // Intercept lazy registration call
    let registerBody: unknown = null;
    await page.route('**/api/media/register-byos', async (route) => {
      registerBody = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, fileId: 'staged-file-id-777' }),
      });
    });

    await page.goto('/media');
    await page.getByRole('tab', { name: /My Cloud/i }).click();

    // Click "Post"
    const card = page.getByTestId('byos-asset-card').first();
    const postBtn = card.getByRole('button', { name: /Post/i });
    await expect(postBtn).toBeVisible();
    await postBtn.click();

    // Verify registration payload
    expect(registerBody).toEqual({
      key: 'external-asset.mp4',
      fileName: 'external-asset.mp4',
      fileSize: 102400,
    });

    // Verify redirect occurred to the staged page with our fileId
    await expect(page).toHaveURL(/\/\?staged=staged-file-id-777/);
  });

  test('should support S3 deletion and trigger list sync or permission failure details', async ({ page }) => {
    await page.route('**/api/settings/byos', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ config: { provider: 'r2' } }),
      });
    });

    let deleteRequested = false;
    let deleteBody: unknown = null;

    // Handle initial listing and delete requests
    await page.route('**/api/media/byos*', async (route) => {
      const method = route.request().method();
      if (method === 'DELETE') {
        deleteRequested = true;
        deleteBody = route.request().postDataJSON();
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      } else {
        // List response
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: deleteRequested
              ? [] // Empty list after deletion
              : [
                  {
                    key: 'to-delete.mp4',
                    fileName: 'to-delete.mp4',
                    fileSize: 102400,
                    lastModified: '2026-06-21T15:00:00Z',
                    status: 'Cloud',
                    fileId: 'delete-id',
                    previewUrl: 'https://mock.r2.com/to-delete.mp4',
                  },
                ],
            hasNextPage: false,
          }),
        });
      }
    });

    await page.goto('/media');
    await page.getByRole('tab', { name: /My Cloud/i }).click();

    const card = page.getByTestId('byos-asset-card').first();
    const deleteBtn = card.getByRole('button', { name: /Delete/i });
    await expect(deleteBtn).toBeVisible();
    await deleteBtn.click();

    // Assert MUI dialog is displayed
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/Are you sure you want to delete this asset/i)).toBeVisible();

    // Confirm Deletion
    await dialog.getByRole('button', { name: /Delete/i }).click();

    // Verify DELETE request body
    expect(deleteBody).toEqual({ key: 'to-delete.mp4' });

    // Verify item is removed from UI (since listing mock returns empty list on subsequent call)
    await expect(page.getByText('No assets found in your storage bucket')).toBeVisible();

    // 2. Test Write-Restricted Permission Failure
    await page.route('**/api/media/byos*', async (route) => {
      const method = route.request().method();
      if (method === 'DELETE') {
        await route.fulfill({
          status: 403,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: 'Insufficient bucket delete permissions.',
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: [
              {
                key: 'forbidden-delete.mp4',
                fileName: 'forbidden-delete.mp4',
                fileSize: 102400,
                lastModified: '2026-06-21T15:00:00Z',
                status: 'Cloud',
                fileId: 'forbidden-id',
                previewUrl: 'https://mock.r2.com/forbidden-delete.mp4',
              },
            ],
            hasNextPage: false,
          }),
        });
      }
    });

    await page.goto('/media');
    await page.getByRole('tab', { name: /My Cloud/i }).click();

    const forbiddenCard = page.getByTestId('byos-asset-card').first();
    await forbiddenCard.getByRole('button', { name: /Delete/i }).click();
    await page.getByRole('dialog').getByRole('button', { name: /Delete/i }).click();

    // Assert theme-aware error alert shows up
    const errorAlert = page.getByText('Failed to delete asset. Insufficient bucket delete permissions.');
    await expect(errorAlert).toBeVisible();
    // Asset card should still be visible in the grid
    await expect(forbiddenCard).toBeVisible();
  });
});
