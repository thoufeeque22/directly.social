import { test, expect, openMobileMenuIfNeeded } from './base-test';

test.describe('Settings Page Tab Interface', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
  });

  test('should navigate between all tabs and persist URL', async ({ page, isMobile }) => {
    // Correct mapping based on TABS array in SettingsContent.tsx
    const tabMapping = [
      { label: 'Destinations', id: 'destinations' },
      { label: 'Snippets', id: 'snippets' },
      { label: 'AI Providers', id: 'ai' },
      { label: 'Storage (BYOS)', id: 'storage' }
    ];
    
    for (const tab of tabMapping) {
      await openMobileMenuIfNeeded(page, isMobile);
      const tabElement = page.getByRole('link', { name: tab.label, exact: true });
      await tabElement.scrollIntoViewIfNeeded();
      await tabElement.click();
      
      if (tab.id === 'destinations') {
          // Allow default URL
          const currentUrl = page.url();
          expect(currentUrl.includes('/settings') && (currentUrl.includes('tab=destinations') || !currentUrl.includes('tab='))).toBeTruthy();
      } else {
          await page.waitForURL(`**/settings?tab=${tab.id}`, { timeout: 10000 });
          await expect(page).toHaveURL(new RegExp(`tab=${tab.id}`));
      }
      
      // Visual audit
      await page.locator('.ptr-container').screenshot({ path: `verification/settings-tab-${tab.id}.png` });
    }
  });

  test('should have all elements visible in the unified platform view', async ({ page, isMobile }) => {
    // AI Providers tab
    await openMobileMenuIfNeeded(page, isMobile);
    const aiTab = page.getByRole('link', { name: /ai providers/i });
    await aiTab.scrollIntoViewIfNeeded();
    await aiTab.click();
    await expect(page.getByRole('heading', { name: /ai providers/i })).toBeVisible({ timeout: 10000 });
    
    // Switch back to Destinations
    await openMobileMenuIfNeeded(page, isMobile);
    const destTab = page.getByRole('link', { name: /destinations/i });
    await destTab.scrollIntoViewIfNeeded();
    await destTab.click();
    
    const suggestBtn = page.getByRole('button', { name: /suggest platform/i });
    await suggestBtn.scrollIntoViewIfNeeded();
    await expect(suggestBtn).toBeVisible({ timeout: 10000 });
  });
});
