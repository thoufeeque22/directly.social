import { test, expect } from '@playwright/test';

test.describe('Public Layout & Consolidate Routes', () => {
  test('landing page shows landing header and footer', async ({ page }) => {
    await page.goto('/');
    
    // Verify Landing Header
    await expect(page.getByTestId('landing-header')).toBeVisible();
    await expect(page.getByText('Philosophy')).toBeVisible();
    await expect(page.getByText('Features')).toBeVisible();
    await expect(page.getByText('Pricing')).toBeVisible();
    await expect(page.getByText('Docs')).toBeVisible();
    
    // Verify Landing Footer
    await expect(page.getByText('Company')).toBeVisible();
    await expect(page.getByText('Privacy Policy')).toBeVisible();
  });

  test('privacy policy page uses unified public layout', async ({ page }) => {
    await page.goto('/privacy');
    
    // Header should still be visible
    await expect(page.getByTestId('landing-header')).toBeVisible();
    
    // Content should be present
    await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();
    
    // Footer should be visible
    await expect(page.getByText('Company')).toBeVisible();
  });

  test('docs landing page uses unified public layout', async ({ page }) => {
    await page.goto('/docs');
    
    // Header should still be visible
    await expect(page.getByTestId('landing-header')).toBeVisible();
    
    // Personas should be visible
    await expect(page.getByText('User Guides')).toBeVisible();
    await expect(page.getByText('Power Users Setup')).toBeVisible();
  });

  test('dynamic docs pages load correctly with persona paths', async ({ page }) => {
    // Check User guide
    await page.goto('/docs/user/account-connection');
    await expect(page.getByRole('heading')).toContainText('Account Connection');
    
    // Check Dev guide
    await page.goto('/docs/dev/vault-setup');
    await expect(page.getByRole('heading')).toContainText('Setting Up Your Storage Vault');
  });

  test('public pages do NOT show authenticated sidebar', async ({ page }) => {
    await page.goto('/privacy');
    
    // The authenticated sidebar uses data-testid="sidebar" (mocked in unit tests, 
    // but in E2E we can check for specific dashboard text)
    await expect(page.getByText('Dashboard')).not.toBeVisible();
    // Wait, the header has a "Dashboard" button if logged in, but not the sidebar menu item.
    // Let's check for "Scheduled Posts" which is only in the sidebar.
    await expect(page.getByText('Scheduled Posts')).not.toBeVisible();
  });
});
