import { test, expect } from './base-test';;

test.describe('Mobile Safe Areas (Ticket 395)', () => {
  test.use({
    viewport: { width: 390, height: 844 }, // iPhone 14
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
  });

  async function injectSafeAreas(page) {
    await page.addStyleTag({
      content: `
        :root {
          --safe-area-top: 47px !important;
          --safe-area-bottom: 34px !important;
          --safe-area-left: 10px !important;
          --safe-area-right: 10px !important;
        }
      `
    });
  }

  test('Header should apply safe area top padding', async ({ page }) => {
    await page.goto('/');
    await injectSafeAreas(page);
    
    // Debug: Check if variable is set
    const varValue = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--safe-area-top').trim());
    console.log('CSS --safe-area-top:', varValue);

    const header = page.locator('header[class*="header"]').first();
    await expect(header).toBeVisible();

    const paddingTop = await header.evaluate((el) => window.getComputedStyle(el).paddingTop);
    console.log('Header padding-top:', paddingTop);
    
    expect(parseInt(paddingTop)).toBe(47);
  });

  test('Sidebar should apply safe area paddings', async ({ page }) => {
    await page.goto('/');
    await injectSafeAreas(page);
    
    const menuBtn = page.locator('button[class*="menuBtn"]');
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
    }
    
    const sidebar = page.locator('aside[class*="sidebar"], div[class*="sidebar"]').first();
    await expect(sidebar).toBeVisible();

    const paddingTop = await sidebar.evaluate((el) => window.getComputedStyle(el).paddingTop);
    // calc(2rem + 47px) = 32 + 47 = 79px
    expect(parseInt(paddingTop)).toBe(79);
  });

  test('Page content should apply safe area paddings', async ({ page }) => {
    await page.goto('/');
    await injectSafeAreas(page);
    
    const pageContent = page.locator('.page-content').first();
    await expect(pageContent).toBeVisible();

    const paddingBottom = await pageContent.evaluate((el) => window.getComputedStyle(el).paddingBottom);
    // calc(1rem + 34px) = 16 + 34 = 50px
    expect(parseInt(paddingBottom)).toBe(50);
  });

  test('Login container should apply safe area paddings', async ({ page }) => {
    // Navigate to login and immediately inject to avoid redirect timing issues
    await page.goto('/login');
    await injectSafeAreas(page);
    
    const loginContainer = page.locator('[class*="Login_container"]');
    if (await loginContainer.count() > 0) {
      const paddingTop = await loginContainer.evaluate((el) => window.getComputedStyle(el).paddingTop);
      // calc(1.5rem + 47px) = 24 + 47 = 71px
      expect(parseInt(paddingTop)).toBeGreaterThanOrEqual(71);
    }
  });
});
