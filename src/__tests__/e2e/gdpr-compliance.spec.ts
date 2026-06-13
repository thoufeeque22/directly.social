import { test, expect } from './base-test';

test.describe('GDPR Compliance (Ticket 494-503)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings?tab=privacy');
  });

  test('should display Privacy & Data Management section', async ({ page }) => {
    await expect(page.getByText('Privacy & Data Management')).toBeVisible();
    await expect(page.getByText('Data Export')).toBeVisible();
    await expect(page.getByText('Danger Zone')).toBeVisible();
  });

  test('should trigger immediate browser download on Data Export request', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Request Data Export' }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/social-studio-export-.*\.json/);
    
    const path = await download.path();
    const fs = require('fs');
    const content = JSON.parse(fs.readFileSync(path, 'utf8'));

    expect(content).toHaveProperty('user');
    expect(content).toHaveProperty('accounts');
    expect(content).toHaveProperty('galleryAssets');
    expect(content).toHaveProperty('activities');
    expect(content).toHaveProperty('metadataTemplates');
  });

  test('should show account deletion confirmation dialog', async ({ page }) => {
    await page.getByRole('button', { name: 'Delete Account' }).click();
    await expect(page.getByText('Confirm Account Deletion')).toBeVisible();
    await expect(page.getByText('Are you absolutely sure you want to delete your account?')).toBeVisible();
  });

  test('should NOT show cookie banner', async ({ page }) => {
    await page.goto('/');
    // Check for common cookie banner text or elements
    const cookieBanner = page.locator('text=Accept All Cookies');
    await expect(cookieBanner).not.toBeVisible();
    
    const cookieBanner2 = page.locator('text=We use cookies');
    await expect(cookieBanner2).not.toBeVisible();
  });

  test('settings tabs should be horizontal and scrollable', async ({ page }) => {
    await page.goto('/settings');
    const tabs = page.locator('.MuiTabs-root');
    await expect(tabs).toBeVisible();
    
    // Check if it's horizontal (MUI default is horizontal)
    const flexDir = await tabs.evaluate(el => window.getComputedStyle(el).flexDirection);
    // MUI Tabs-root is not flex itself but contains a scroller
    const scroller = tabs.locator('.MuiTabs-scroller');
    const display = await scroller.evaluate(el => window.getComputedStyle(el).display);
    expect(display).toBe('block'); // MUI scroller is usually block with overflow hidden
    
    const flexContainer = tabs.locator('.MuiTabs-flexContainer');
    const containerFlexDir = await flexContainer.evaluate(el => window.getComputedStyle(el).flexDirection);
    expect(containerFlexDir).toBe('row'); // Horizontal
  });
});
