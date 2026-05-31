import { test, expect } from '@playwright/test';

test.describe('Theme 3-Way Toggle Cycle', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log(msg.text()));
    // Start at home page
    await page.goto('/');
    
    // Disable transitions to make tests faster and more reliable
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          transition: none !important;
          animation: none !important;
        }
      `,
    });
    
    // Ensure the toggle is loaded
    await page.waitForSelector('[data-testid="theme-toggle"]', { timeout: 15000 });
  });

  test('should cycle through Light -> Dark -> System -> Light', async ({ page }) => {
    const html = page.locator('html');
    const toggle = page.getByTestId('theme-toggle');
    
    // 1. Synchronize to a known state: Light Mode
    let isLight = await html.evaluate(el => el.classList.contains('light-mode'));
    if (!isLight) {
      await toggle.click();
      // wait a bit for react to update
      await page.waitForTimeout(500);
      isLight = await html.evaluate(el => el.classList.contains('light-mode'));
      if (!isLight) {
        // Was dark, now system. Click again for light.
        await toggle.click();
        await expect(html).toHaveClass(/light-mode/, { timeout: 2000 });
      }
    }
    await expect(html).toHaveClass(/light-mode/);
    
    // 2. Click: Light -> Dark
    await page.waitForTimeout(1000);
    await toggle.click();
    await expect(html).not.toHaveClass(/light-mode/);
    
    // 3. Click: Dark -> System
    await toggle.click();
    // In System mode, class depends on emulateMedia. Playwright default is dark.
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(html).not.toHaveClass(/light-mode/);
    await page.emulateMedia({ colorScheme: 'light' });
    await expect(html).toHaveClass(/light-mode/);
    
    // 4. Click: System -> Light
    await toggle.click();
    await expect(html).toHaveClass(/light-mode/);
    // Verify it stays light even if system is dark
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(html).toHaveClass(/light-mode/);
  });

  test('should persist 3-way preference across reloads', async ({ page }) => {
    const toggle = page.getByTestId('theme-toggle');
    const html = page.locator('html');
    
    // Set to Light mode
    let isLight = await html.evaluate(el => el.classList.contains('light-mode'));
    if (!isLight) {
      await toggle.click();
      await page.waitForTimeout(500);
      isLight = await html.evaluate(el => el.classList.contains('light-mode'));
      if (!isLight) {
        await toggle.click();
      }
    }
    await expect(html).toHaveClass(/light-mode/, { timeout: 2000 });
    
    await page.reload();
    await expect(page.locator('html')).toHaveClass(/light-mode/);
    
    // Set to Dark mode
    await page.waitForTimeout(1000);
    await toggle.click();
    await expect(html).not.toHaveClass(/light-mode/);
    await page.reload();
    await expect(page.locator('html')).not.toHaveClass(/light-mode/);
  });

  test('should verify light mode consistency on Settings and Activity pages', async ({ page }) => {
    const toggle = page.getByTestId('theme-toggle');
    const html = page.locator('html');
    
    // Switch to Light Mode
    let isLight = await html.evaluate(el => el.classList.contains('light-mode'));
    if (!isLight) {
      await toggle.click();
      await page.waitForTimeout(500);
      isLight = await html.evaluate(el => el.classList.contains('light-mode'));
      if (!isLight) {
        await toggle.click();
      }
    }
    await expect(html).toHaveClass(/light-mode/, { timeout: 2000 });
    
    // Check Header background specifically in the main header
    const header = page.locator('header[class*="header"]').first();
    await expect(header).toHaveCSS('background-color', /rgba?\(24\d, 24\d, 25\d, 0\.8\)/);
    
    // Go to Settings
    await page.goto('/settings');
    await expect(html).toHaveClass(/light-mode/);
    
    // Ensure text is readable
    const title = page.locator('h1');
    await expect(title).toHaveCSS('color', /rgb\(19, 15, 36\)/);
    
    // Go to Activity
    await page.goto('/activity');
    await expect(html).toHaveClass(/light-mode/);
    await expect(page.locator('h1')).toBeVisible();
  });
});
