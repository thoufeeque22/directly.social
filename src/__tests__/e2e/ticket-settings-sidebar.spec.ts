import { test, expect } from './base-test';

test.describe('Settings Nested Sidebar Refactor', () => {
  test('desktop layout displays nested settings links in the main sidebar', async ({ page, isMobile }) => {
    // Skip this test if running on mobile viewports
    if (isMobile) test.skip();

    await page.goto('/settings');
    await expect(page).toHaveURL(/\/settings/);

    // Verify main sidebar exists and contains the nested settings links
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    // Verify that the sub-navigation links are visible in the sidebar
    const supportLink = sidebar.getByRole('link', { name: 'Support', exact: true });
    await expect(supportLink).toBeVisible();

    // Verify clicking a nested link updates the URL and content pane
    await supportLink.click();
    await expect(page).toHaveURL(/tab=support/);
    await expect(page.locator('h5', { hasText: /Support/i })).toBeVisible();
  });

});
