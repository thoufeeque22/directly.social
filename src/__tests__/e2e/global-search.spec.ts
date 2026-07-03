import { test, expect } from './base-test';

const MOCK_ACTIVITY = [
  {
    id: 'grand-canyon-post',
    title: 'Exploring the Grand Canyon',
    description: 'Hiked the South Rim trail today — breathtaking views.',
    createdAt: new Date().toISOString(),
    platforms: [{ id: 'res-1', platform: 'youtube', status: 'completed' }]
  },
  {
    id: 'pasta-post',
    title: 'Cooking Italian Pasta',
    description: 'Classic carbonara recipe with guanciale.',
    createdAt: new Date().toISOString(),
    platforms: [{ id: 'res-2', platform: 'instagram', status: 'completed' }]
  },
];

const MOCK_MEDIA = [
  { id: 'media-1', filename: 'grand_canyon_vlog.mp4', url: 'https://example.com/grand_canyon_vlog.mp4', size: 1024, mimeType: 'video/mp4', createdAt: new Date().toISOString() },
  { id: 'media-2', filename: 'pasta_tutorial.mov', url: 'https://example.com/pasta_tutorial.mov', size: 2048, mimeType: 'video/quicktime', createdAt: new Date().toISOString() },
  { id: 'media-3', filename: 'smartphone_unboxing.mp4', url: 'https://example.com/smartphone_unboxing.mp4', size: 512, mimeType: 'video/mp4', createdAt: new Date().toISOString() },
];

test.describe('Global Search @regression', () => {
  test('should filter activity items by search query', async ({ page }) => {
    // Mock the activity API before navigation to control test data
    await page.route('**/api/activity*', async (route) => {
      const url = new URL(route.request().url());
      const search = url.searchParams.get('search') || '';
      const filtered = MOCK_ACTIVITY.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: filtered, nextCursor: null })
      });
    });

    await page.goto('/activity');
    await expect(page.getByRole('heading', { name: 'Activity Hub' })).toBeVisible();

    // Verify mocked data is visible on initial load
    await expect(page.getByText('Exploring the Grand Canyon')).toBeVisible();
    await expect(page.getByText('Cooking Italian Pasta')).toBeVisible();

    const searchField = page.getByPlaceholder('Search activity by title or description...');
    await expect(searchField).toBeVisible();

    // 1. Search by Title
    await searchField.fill('Pasta');
    await expect(page.getByText('Cooking Italian Pasta')).toBeVisible();
    await expect(page.getByText('Exploring the Grand Canyon')).not.toBeVisible();

    // 2. Search by Description
    await searchField.fill('South Rim');
    await expect(page.getByText('Exploring the Grand Canyon')).toBeVisible();
    await expect(page.getByText('Cooking Italian Pasta')).not.toBeVisible();

    // 3. No Results
    await searchField.fill('NonExistentPost123');
    await expect(page.getByText('No matching activity')).toBeVisible();
    await expect(page.getByText('We couldn\'t find any posts matching "NonExistentPost123"')).toBeVisible();

    // 4. Clear Search
    await searchField.fill('');
    await expect(page.getByText('Exploring the Grand Canyon')).toBeVisible();
    await expect(page.getByText('Cooking Italian Pasta')).toBeVisible();
  });

  test('should filter media gallery items by search query', async ({ page }) => {
    // Mock the media API before navigation to control test data
    await page.route('**/api/media*', async (route) => {
      const url = new URL(route.request().url());
      const search = url.searchParams.get('search') || '';
      const filtered = MOCK_MEDIA.filter(m =>
        m.filename.toLowerCase().includes(search.toLowerCase())
      );
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: filtered, total: filtered.length })
      });
    });

    await page.goto('/media');
    await expect(page.getByRole('heading', { name: 'Media Gallery' })).toBeVisible();

    // Verify mocked data is visible
    await expect(page.getByText('grand_canyon_vlog.mp4')).toBeVisible();
    await expect(page.getByText('pasta_tutorial.mov')).toBeVisible();

    const searchField = page.getByPlaceholder('Search your library...');
    await expect(searchField).toBeVisible();

    // 1. Search by Filename
    await searchField.fill('smartphone');
    await expect(page.getByText('smartphone_unboxing.mp4')).toBeVisible();
    await expect(page.getByText('grand_canyon_vlog.mp4')).not.toBeVisible();

    // 2. No Results
    await searchField.fill('NonExistentVideo456');
    await expect(page.getByText('No matching videos found.')).toBeVisible();

    // 3. Clear Search
    await searchField.fill('');
    await expect(page.getByText('grand_canyon_vlog.mp4')).toBeVisible();
    await expect(page.getByText('pasta_tutorial.mov')).toBeVisible();
  });
});

