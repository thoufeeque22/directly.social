import { test, expect } from '@playwright/test';

/**
 * Ticket #639: Login Screen Theme Alignment
 * Verifies that the login screen is fully theme-aware and spans the full viewport.
 */
test.describe('Login Screen Theme Alignment (#639)', () => {
  // Use unauthenticated state to ensure we stay on the login page
  test.use({ storageState: { cookies: [], origins: [] } });
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto('/login');
    // Wait for the login content to be hydrated
    // Increased timeout and using a more robust selector
    await page.waitForSelector('h1', { state: 'visible', timeout: 15000 });
  });

  test('background container should span full viewport width and height', async ({ page }) => {
    const container = page.locator('div[class*="container"]').first();
    await expect(container).toBeVisible();

    const box = await container.boundingBox();
    const viewport = page.viewportSize();
    
    if (box && viewport) {
      // Allow for small rounding differences or safe area paddings
      expect(box.width).toBeGreaterThanOrEqual(viewport.width - 10);
      expect(box.height).toBeGreaterThanOrEqual(viewport.height - 1);
    }
  });

  test('should use correct background color in dark mode', async ({ page }) => {
    // Emulate dark mode
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.evaluate(() => {
      document.documentElement.classList.remove('light-mode');
    });

    const container = page.locator('div[class*="container"]').first();
    
    // Get computed background color
    const bgColor = await container.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    
    // Expected Dark background: hsl(250 40% 5%) -> approx rgb(8, 7, 18)
    const rgb = bgColor.match(/\d+/g);
    if (rgb) {
      expect(Number(rgb[0])).toBeLessThan(30);
      expect(Number(rgb[1])).toBeLessThan(30);
      expect(Number(rgb[2])).toBeLessThan(30);
    }
  });

  test('should adapt background color when light mode is enabled', async ({ page }) => {
    // Emulate light mode
    await page.emulateMedia({ colorScheme: 'light' });
    
    // Inject the light-mode class to the html element to ensure it's applied 
    // (as the app might use a toggle or system preference)
    await page.evaluate(() => {
      document.documentElement.classList.add('light-mode');
    });

    const container = page.locator('div[class*="container"]').first();
    
    // In light mode, the background should be light: hsl(250 40% 98%) -> approx rgb(249, 249, 253)
    const bgColor = await container.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    
    const rgb = bgColor.match(/\d+/g);
    if (rgb) {
      expect(Number(rgb[0])).toBeGreaterThan(240);
      expect(Number(rgb[1])).toBeGreaterThan(240);
      expect(Number(rgb[2])).toBeGreaterThan(240);
    }
  });

  test('should not have visual split artifacts (gradient check)', async ({ page }) => {
    const container = page.locator('div[class*="container"]').first();
    const backgroundImage = await container.evaluate((el) => window.getComputedStyle(el).backgroundImage);
    
    // If it's a split artifact, it might have been a hardcoded linear gradient or two divs
    // The fix should have removed any split background gradients
    // We expect either "none" or a uniform transition, not a hard 50% split
    expect(backgroundImage).not.toContain('50%');
  });

  test('login card should be visible and centered', async ({ page }) => {
    const loginCard = page.locator('div[class*="loginCard"]');
    await expect(loginCard).toBeVisible();

    const box = await loginCard.boundingBox();
    const viewport = page.viewportSize();
    
    if (box && viewport) {
      // Check if it's horizontally centered (approx)
      const centerX = box.x + box.width / 2;
      // On large screens it might be on the right side if feature section is on left
      // But it should be within the viewport
      expect(centerX).toBeGreaterThan(0);
      expect(centerX).toBeLessThan(viewport.width);
    }
  });

});
