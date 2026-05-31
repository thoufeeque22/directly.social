import { test, expect } from './base-test';;

test.describe('Settings Page - Destinations Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
  });

  test('should display active and upcoming platforms in the destinations tab', async ({ page }) => {
    // Ensure we are on the Destinations tab (default or by clicking)
    await page.getByRole('tab', { name: 'Destinations', exact: true }).click();
    
    // Verify headers
    await expect(page.getByRole('heading', { name: 'Connected Platforms' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Roadmap / Coming Soon' })).toBeVisible();
    
    // Verify upcoming platform
    await expect(page.getByText('Coming Soon').first()).toBeVisible();
    
    // Verify "Suggest Platform" button and its dialog handler
    page.once('dialog', dialog => {
      expect(dialog.message()).toBe('Thanks! Request logged.');
      dialog.accept();
    });
    const suggestButton = page.getByRole('button', { name: 'Suggest Platform' });
    await expect(suggestButton).toBeVisible();
    await suggestButton.click();
  });
});
