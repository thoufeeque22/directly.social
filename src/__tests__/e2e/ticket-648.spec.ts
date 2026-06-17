import { test, expect } from './base-test';

test.describe('Ticket #648: Post Versioning & Multi-Platform Overrides', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/');
    
    // Ensure we are in Manual tier to avoid AI interference during sync testing
    await page.evaluate(() => {
      localStorage.setItem('SS_AI_TIER', 'Manual');
    });
    await page.reload();

    // Select YouTube and Instagram (assuming they exist in the dev environment)
    // Using aria-label or text based on existing components
    const youtubeBtn = page.getByRole('button', { name: /youtube/i }).first();
    const instagramBtn = page.getByRole('button', { name: /instagram/i }).first();
    
    await youtubeBtn.click();
    await instagramBtn.click();
  });

  test('Sync Inheritance: Global changes propagate to platforms', async ({ page }) => {
    const globalTitle = 'Global Video Title';
    await page.locator('input[name="title"]').fill(globalTitle);
    
    // Switch to YouTube tab (Tabs are 0: Global, 1: YouTube, 2: Instagram)
    await page.getByRole('tab', { name: /youtube/i }).click();
    
    // Verify it shows "using global settings" message
    await expect(page.getByText(/using global settings/i)).toBeVisible();
    
    // Customize YouTube
    await page.getByRole('button', { name: /customize for youtube/i }).click();
    
    // Verify it inherited the global title
    await expect(page.locator('input[name="title_youtube"]')).toHaveValue(globalTitle);
  });

  test('Override Isolation: Unlinked platform stays isolated', async ({ page }) => {
    await page.locator('input[name="title"]').fill('Global Title');
    
    // Customize Instagram
    await page.getByRole('tab', { name: /instagram/i }).click();
    await page.getByRole('button', { name: /customize for instagram/i }).click();
    await page.locator('input[name="title_instagram"]').fill('Instagram Specific Title');
    
    // Switch back to Global
    await page.getByRole('tab', { name: /global/i }).click();
    await page.locator('input[name="title"]').fill('New Global Title');
    
    // Switch back to Instagram and verify it did NOT change
    await page.getByRole('tab', { name: /instagram/i }).click();
    await expect(page.locator('input[name="title_instagram"]')).toHaveValue('Instagram Specific Title');
  });

  test('Re-sync Logic: Reset to Global reverts inheritance', async ({ page }) => {
    await page.getByRole('tab', { name: /youtube/i }).click();
    await page.getByRole('button', { name: /customize for youtube/i }).click();
    await page.locator('input[name="title_youtube"]').fill('Custom YT');
    
    // Reset to Global
    await page.getByRole('button', { name: /reset to global/i }).click();
    
    // Should show the "using global settings" message again
    await expect(page.getByText(/using global settings/i)).toBeVisible();
  });
});
