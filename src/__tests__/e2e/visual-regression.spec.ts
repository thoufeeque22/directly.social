import { test, expect } from './base-test';;

test.describe('Visual Regression @visual', () => {
  test('Home page baseline', async ({ page }) => {
    // Set a fixed viewport for dimension stability
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto('/');
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Mask dynamic areas and clip to a stable dimension
    await expect(page.locator('.ptr-container')).toHaveScreenshot('home-page.png', { 
      maxDiffPixelRatio: 0.15,
      animations: 'disabled',
      clip: { x: 0, y: 0, width: 1280, height: 1200 }, // Force stable dimensions
      mask: [
        page.locator('aside'),
        page.locator('h2:has-text("Upcoming Posts")').locator('xpath=..'),
        page.locator('[class*="userAvatar"]'),
        page.locator('text=/Welcome back/'),
        page.locator('[id="__next-route-announcer__"]')
      ]
    });
  });

  test('Settings page baseline', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('main', { state: 'visible' });
    
    await expect(page.locator('.ptr-container')).toHaveScreenshot('settings-page.png', { 
      maxDiffPixelRatio: 0.1,
      animations: 'disabled',
      mask: [
        page.locator('aside'),
        page.locator('[class*="userAvatar"]'),
        page.locator('[id="__next-route-announcer__"]')
      ]
    });
  });

  test('Schedule page baseline', async ({ page }) => {
    await page.goto('/schedule');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('.ptr-container')).toHaveScreenshot('schedule-page.png', { 
      maxDiffPixelRatio: 0.1,
      animations: 'disabled',
      mask: [
        page.locator('aside'),
        page.locator('[class*="userAvatar"]'),
        page.locator('main >> .MuiPaper-root'),
        page.locator('[id="__next-route-announcer__"]')
      ]
    });
  });
});
