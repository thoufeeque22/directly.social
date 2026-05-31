import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    // Start at home page
    await page.goto('/');
    // Clear localStorage to ensure a clean state
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
  });

  test('should toggle between light and dark modes', async ({ page }) => {
    // Default should be dark mode (or system, but we expect dark in our environment)
    const html = page.locator('html');
    
    // Toggle to Light
    const toggle = page.getByTestId('theme-toggle');
    await toggle.click();
    await expect(html).toHaveClass(/light-mode/);
    
    // Check that background color is light
    const body = page.locator('body');
    // Using a broader check for light background
    await expect(body).toHaveCSS('background-color', /rgb\(24\d, 24\d, 25\d\)/);

    // Toggle back to Dark
    await toggle.click();
    await expect(html).not.toHaveClass(/light-mode/);
    
    // Using a broader check for dark background
    await expect(body).toHaveCSS('background-color', /rgb\(9, 8, 18\)/);
  });

  test('should persist theme across reloads', async ({ page }) => {
    const toggle = page.getByTestId('theme-toggle');
    await toggle.click(); // Switch to light
    await expect(page.locator('html')).toHaveClass(/light-mode/);

    await page.reload();
    await expect(page.locator('html')).toHaveClass(/light-mode/);
  });

  test('should persist theme across navigation', async ({ page }) => {
    const toggle = page.getByTestId('theme-toggle');
    await toggle.click(); // Switch to light
    await expect(page.locator('html')).toHaveClass(/light-mode/);

    // Navigate to settings (assuming it exists)
    await page.goto('/settings');
    await expect(page.locator('html')).toHaveClass(/light-mode/);
  });

  test('should follow system preference when set to system', async ({ page }) => {
    // Mock system preference to light
    await page.emulateMedia({ colorScheme: 'light' });
    await page.evaluate(() => localStorage.setItem('theme-preference', 'system'));
    await page.reload();
    
    await expect(page.locator('html')).toHaveClass(/light-mode/);

    // Mock system preference to dark
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.reload();
    await expect(page.locator('html')).not.toHaveClass(/light-mode/);
  });

  test('should prevent FOUC (Flash of Unstyled Content)', async ({ page }) => {
    // Set preference to light in localStorage
    await page.evaluate(() => localStorage.setItem('theme-preference', 'light'));
    
    // Use a script to check if the class is present immediately on load
    // We can't easily "catch" a flicker, but we can verify it's applied before React hydration
    // By checking if it's there as soon as the page is ready but before we wait for anything
    await page.goto('/');
    const htmlClass = await page.evaluate(() => document.documentElement.className);
    expect(htmlClass).toContain('light-mode');
  });
});
