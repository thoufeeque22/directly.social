import { test, expect } from './base-test';;

test.describe('Activity Domain Modularization Verification @regression', () => {
  test.beforeEach(async ({ page }) => {
    // We assume the user is already logged in via auth.setup.ts or similar
    // For local dev, we might need to handle login if not using reuse-auth
    await page.goto('/activity');
    await expect(page.getByRole('heading', { name: 'Activity Hub' })).toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(1000);
  });

  test('should load activity page and display items', async ({ page }) => {
    // Mock activity API
    await page.route('**/api/activity*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 'post-1',
              title: 'Test Post 1',
              description: 'Description 1',
              createdAt: new Date().toISOString(),
              platforms: [
                { id: 'res-1', platform: 'youtube', status: 'completed' },
                { id: 'res-2', platform: 'instagram', status: 'completed' }
              ]
            },
            {
              id: 'post-2',
              title: 'Test Post 2',
              description: 'Description 2',
              createdAt: new Date().toISOString(),
              platforms: [
                { id: 'res-3', platform: 'tiktok', status: 'failed', errorMessage: 'Upload failed' }
              ]
            }
          ],
          nextCursor: null
        })
      });
    });

    await page.reload();
    
    await expect(page.getByRole('heading', { name: 'Activity Hub' })).toBeVisible();
    await expect(page.getByTestId('activity-post-post-1')).toBeVisible();
    await expect(page.getByTestId('activity-post-post-2')).toBeVisible();
    
    // Check titles
    await expect(page.getByText('Test Post 1')).toBeVisible();
    await expect(page.getByText('Test Post 2')).toBeVisible();
  });

  test('should filter activity items by search query', async ({ page }) => {
    await page.route(url => url.pathname.includes('/api/activity'), async (route) => {
      const urlObj = new URL(route.request().url());
      const searchParam = urlObj.searchParams.get('search');
      if (searchParam === 'Post 1') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: [
              {
                id: 'post-1',
                title: 'Test Post 1',
                description: 'Description 1',
                createdAt: new Date().toISOString(),
                platforms: [{ id: 'res-1', platform: 'youtube', status: 'completed' }]
              }
            ],
            nextCursor: null
          })
        });
      } else {
        await route.continue();
      }
    });

    const searchField = page.getByPlaceholder('Search activity by title or description...');
    await searchField.fill('Post 1');
    
    // Wait for debounce and fetch
    await expect(page.getByTestId('activity-post-post-1')).toBeVisible();
    await expect(page.getByTestId('activity-post-post-2')).not.toBeVisible();
  });

  test('should handle "Load More" for pagination', async ({ page }) => {
     await page.route('**/api/activity*', async (route) => {
      const url = new URL(route.request().url());
      const cursor = url.searchParams.get('cursor');

      if (!cursor) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: [{ id: 'post-1', title: 'Post 1', platforms: [], createdAt: new Date().toISOString() }],
            nextCursor: 'cursor-1'
          })
        });
      } else if (cursor === 'cursor-1') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: [{ id: 'post-2', title: 'Post 2', platforms: [], createdAt: new Date().toISOString() }],
            nextCursor: null
          })
        });
      }
    });

    await page.reload();
    await expect(page.getByText('Post 1')).toBeVisible();
    await expect(page.getByText('Post 2')).not.toBeVisible();

    const loadMoreButton = page.getByRole('button', { name: 'Load More' });
    await loadMoreButton.click();

    await expect(page.getByText('Post 2')).toBeVisible();
    await expect(loadMoreButton).not.toBeVisible();
  });

  test('Visual Audit: Activity States', async ({ page }) => {
    // 1. Empty State
    await page.route('**/api/activity*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [], nextCursor: null })
      });
    });
    await page.reload();
    await page.locator('.ptr-container').screenshot({ path: 'verification/activity-refactor/empty-state.png' });

    // 2. List View with items
    await page.route('**/api/activity*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 'post-1',
              title: 'Successful Post',
              description: 'All platforms green',
              createdAt: new Date().toISOString(),
              platforms: [
                { id: 'res-1', platform: 'youtube', status: 'completed' },
                { id: 'res-2', platform: 'instagram', status: 'completed' }
              ]
            },
            {
              id: 'post-2',
              title: 'Active Post',
              description: 'Uploading...',
              createdAt: new Date().toISOString(),
              platforms: [
                { id: 'res-3', platform: 'tiktok', status: 'uploading', progress: 45 }
              ]
            },
             {
              id: 'post-3',
              title: 'Failed Post',
              description: 'Something went wrong',
              createdAt: new Date().toISOString(),
              platforms: [
                { id: 'res-4', platform: 'facebook', status: 'failed', errorMessage: 'API Error' }
              ]
            }
          ],
          nextCursor: null
        })
      });
    });
    await page.reload();
    await page.locator('.ptr-container').screenshot({ path: 'verification/activity-refactor/list-view.png' });
  });
});
