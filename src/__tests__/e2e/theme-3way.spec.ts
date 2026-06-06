import { test, expect } from './base-test';;

test.describe('Theme 3-Way Toggle Cycle', () => {
  test.beforeEach(async ({ page }) => {
    // Start at home page
    await page.goto('/');
    // Clear localStorage to ensure clean state
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
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
    
    // 1. Initial state is System. Click once to go to Light.
    await toggle.click();
    await expect(html).toHaveClass(/light-mode/);
    
    // 2. Click: Light -> Dark
    await toggle.click();
    await expect(html).not.toHaveClass(/light-mode/);
    
    // 3. Click: Dark -> System
    await toggle.click();
    // In System mode, class depends on system preference.
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
    
    // 1. Start: System. Click once -> Light
    await toggle.click();
    await expect(html).toHaveClass(/light-mode/);
    
    await page.reload();
    await expect(page.locator('html')).toHaveClass(/light-mode/);
    
    // 2. Click -> Dark
    await toggle.click();
    await expect(html).not.toHaveClass(/light-mode/);
    
    await page.reload();
    await expect(page.locator('html')).not.toHaveClass(/light-mode/);
  });

  test('should verify light mode consistency on Settings and Activity pages', async ({ page }) => {
    const toggle = page.getByTestId('theme-toggle');
    const html = page.locator('html');
    
    // Start: System. Click once -> Light
    await toggle.click();
    await expect(html).toHaveClass(/light-mode/);
    
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
