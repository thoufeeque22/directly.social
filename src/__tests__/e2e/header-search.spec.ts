import { test, expect } from '@playwright/test';

test.describe('Header Global Search', () => {
  test('should navigate to activity with search query from header', async ({ page }) => {
    await page.goto('/'); // Dashboard
    await page.waitForLoadState('networkidle');
    
    const headerSearch = page.locator('#header-search');
    await expect(headerSearch).toBeVisible();
    
    await headerSearch.fill('Pasta');
    await headerSearch.press('Enter');
    
    // Should navigate to /activity and filter
    await expect(page).toHaveURL(/\/activity\?search=Pasta/);
    await expect(page.getByText('Cooking Italian Pasta')).toBeVisible();
    await expect(page.getByText('Exploring the Grand Canyon')).not.toBeVisible();
  });

  test('should navigate to media with search query from header when on media page', async ({ page }) => {
    await page.goto('/media');
    
    const headerSearch = page.locator('#header-search');
    await headerSearch.fill('smartphone');
    await headerSearch.press('Enter');
    
    // Should stay on /media but add query param and filter
    await expect(page).toHaveURL(/\/media\?search=smartphone/);
    await expect(page.getByText('smartphone_unboxing.mp4')).toBeVisible();
    await expect(page.getByText('grand_canyon_vlog.mp4')).not.toBeVisible();
  });
});
