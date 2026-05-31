import { test, expect } from './base-test';;

test.describe('Settings Page Tab Interface', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
  });

  test('should navigate between all tabs and persist URL', async ({ page }) => {
    // Correct mapping based on TABS array in SettingsContent.tsx
    const tabMapping = [
      { label: 'Destinations', id: 'destinations' },
      { label: 'Snippets', id: 'snippets' },
      { label: 'AI Providers', id: 'ai' },
      { label: 'Storage (BYOS)', id: 'storage' }
    ];
    
    for (const tab of tabMapping) {
      await page.getByRole('tab', { name: tab.label, exact: true }).click();
      
      if (tab.id === 'destinations') {
          // Allow default URL
          const currentUrl = page.url();
          expect(currentUrl.includes('/settings') && (currentUrl.includes('tab=destinations') || !currentUrl.includes('tab='))).toBeTruthy();
      } else {
          await page.waitForURL(`**/settings?tab=${tab.id}`, { timeout: 5000 });
          await expect(page).toHaveURL(new RegExp(`tab=${tab.id}`));
      }
      
      // Visual audit
      await page.screenshot({ path: `verification/settings-tab-${tab.id}.png`, fullPage: true });
    }
  });

  test('should have all elements visible in the unified platform view', async ({ page }) => {
    // AI Providers tab
    await page.getByRole('tab', { name: /ai providers/i }).click();
    await expect(page.getByRole('heading', { name: /ai providers/i })).toBeVisible();
    
    // Switch back to Destinations
    await page.getByRole('tab', { name: /destinations/i }).click();
    await expect(page.getByRole('button', { name: /suggest platform/i })).toBeVisible();
  });
});
