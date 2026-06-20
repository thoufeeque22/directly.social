import { test, expect } from './base-test';

test.describe('Local FileSystem Vault E2E Tests', () => {
  test.use({ authRole: 'tester' });

  test('Case 1: Browser Support Alert', async ({ page }) => {
    await page.addInitScript(() => {
      const win = window as unknown as { showDirectoryPicker?: unknown };
      delete win.showDirectoryPicker;
    });

    await page.goto('/media');
    await page.getByRole('tab', { name: 'Local Vault' }).click();

    await expect(page.getByText('Local Vault is unsupported. Please use Chrome/Edge.')).toBeVisible();
  });

  test('Case 2 & 3: Folder Connection, Badge & Composer Redirection', async ({ page }) => {
    await page.addInitScript(() => {
      const mockHandle = {
        kind: 'directory',
        name: 'Mock Folder',
        queryPermission: async () => 'granted',
        requestPermission: async () => 'granted',
        values: async function* () {
          yield {
            kind: 'file',
            name: 'local_test_video.mp4',
            getFile: async () => new File([new ArrayBuffer(100)], 'local_test_video.mp4', { type: 'video/mp4' }),
          };
        },
      };
      const win = window as unknown as { showDirectoryPicker: unknown; __mockVaultHandle?: unknown; __mockDraftFile?: unknown };
      win.showDirectoryPicker = async () => mockHandle;
      win.__mockVaultHandle = null;
      win.__mockDraftFile = null;
    });

    await page.goto('/media');
    await page.getByRole('tab', { name: 'Local Vault' }).click();

    await page.getByRole('button', { name: 'Connect Directory' }).click();

    await expect(page.locator('span.MuiChip-label', { hasText: 'Local Vault' })).toBeVisible();
    await expect(page.getByText('local_test_video.mp4')).toBeVisible();

    await page.getByRole('button', { name: 'Post', exact: true }).click();
    await page.waitForURL('/');
    
    // Composer should show the video preview name
    await expect(page.getByText('local_test_video.mp4')).toBeVisible();
  });

  test('Case 4: Restore Permission Alert', async ({ page }) => {
    await page.addInitScript(() => {
      const mockHandle = {
        kind: 'directory',
        name: 'Mock Folder',
        queryPermission: async () => 'prompt',
        requestPermission: async () => 'granted',
        values: async function* () {
          yield {
            kind: 'file',
            name: 'restored_video.mp4',
            getFile: async () => new File([new ArrayBuffer(100)], 'restored_video.mp4', { type: 'video/mp4' }),
          };
        },
      };
      const win = window as unknown as { showDirectoryPicker: unknown; __mockVaultHandle?: unknown; __mockDraftFile?: unknown };
      win.showDirectoryPicker = async () => mockHandle;
      win.__mockVaultHandle = mockHandle;
      win.__mockDraftFile = null;
    });

    await page.goto('/media');
    await page.getByRole('tab', { name: 'Local Vault' }).click();

    // Verify warning alert is visible
    await expect(page.getByText('Access to the connected directory needs to be restored')).toBeVisible();

    // Restore access
    await page.getByRole('button', { name: 'Restore Access' }).click();

    // Warning alert should disappear and the list should render
    await expect(page.getByText('Access to the connected directory needs to be restored')).not.toBeVisible();
    await expect(page.getByText('restored_video.mp4')).toBeVisible();
  });
});
