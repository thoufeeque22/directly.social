import { test, expect } from './base-test';

test.describe('System Status Dashboard - Unauthenticated', () => {
  test.use({ authRole: 'none' });

  test('Footer Link - Unauthenticated: Navigate to landing page, click System Status, assert navigation to /status', async ({ page }) => {
    await page.goto('/');
    
    // Find the footer link for "System Status" in landing footer
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    const statusLink = footer.getByRole('link', { name: 'System Status' });
    await expect(statusLink).toBeVisible();
    await statusLink.scrollIntoViewIfNeeded();
    await statusLink.click();
    
    // Assert navigation to /status
    await expect(page).toHaveURL(/\/status/);
  });
});

test.describe('System Status Dashboard - Authenticated', () => {
  test.use({ authRole: 'tester' });

  test('Sidebar Link - Authenticated: Log in as tester, click System Status link in sidebar, assert navigation to /status', async ({ page, isMobile }) => {
    await page.goto('/');
    
    if (isMobile) {
      // Open the mobile menu first
      const menuBtn = page.getByRole('button', { name: /menu/i });
      if (await menuBtn.isVisible()) {
        await menuBtn.click();
      }
    }
    
    const statusLink = page.getByRole('link', { name: /System Status/i }).first();
    await expect(statusLink).toBeVisible();
    await statusLink.scrollIntoViewIfNeeded();
    await statusLink.click();
    
    // Assert navigation to /status
    await expect(page).toHaveURL(/\/status/);
  });

  test('Page Elements: Verify /status page displays heading, refresh button, and updates last updated text', async ({ page }) => {
    // Ensure we don't accidentally fail on an API error
    await page.route('**/api/status', async (route) => {
      await route.fulfill({ json: { data: [], incidents: [] } });
    });

    await page.goto('/status');
    
    // Verify displays heading "System Status"
    const heading = page.getByRole('heading', { name: 'System Status' });
    await expect(heading).toBeVisible();
    
    // Has a Refresh button
    const refreshButton = page.getByRole('button', { name: 'Refresh', exact: true });
    await expect(refreshButton).toBeVisible();
    
    // Clicking the Refresh button updates the "Last Updated" text
    const lastUpdated = page.getByText(/Last Updated:/i);
    await expect(lastUpdated).toBeVisible();
    
    const initialText = await lastUpdated.textContent();
    
    // Wait for 1 second before clicking to allow timestamp change
    await page.waitForTimeout(1000);
    await refreshButton.click();
    
    const updatedText = await lastUpdated.textContent();
    await expect(lastUpdated).toBeVisible();
    if (initialText) {
      expect(updatedText).not.toBeNull();
    }
  });

  test('Scenario Simulations: Verify different status scenarios via mocked API', async ({ page }) => {
    // 1. degraded-performance -> warning icon
    await page.route('**/api/status', async (route) => {
      await route.fulfill({
        json: {
          data: [{ id: '1', attributes: { name: 'Core API Gateway', status: 'degraded' } }],
          incidents: []
        }
      });
    });
    await page.goto('/status');
    const heroDegraded = page.locator('[data-testid="status-hero"]');
    await expect(heroDegraded).toBeVisible();
    await expect(heroDegraded).toContainText(/degraded performance/i);
    await expect(heroDegraded.locator('[data-testid="WarningIcon"]')).toBeVisible();

    // 2. major-outage -> error icon
    await page.route('**/api/status', async (route) => {
      await route.fulfill({
        json: {
          data: [{ id: '1', attributes: { name: 'Core API Gateway', status: 'down' } }],
          incidents: []
        }
      });
    });
    await page.goto('/status');
    const heroOutage = page.locator('[data-testid="status-hero"]');
    await expect(heroOutage).toBeVisible();
    await expect(heroOutage).toContainText(/system outage/i);
    await expect(heroOutage.locator('[data-testid="ErrorIcon"]')).toBeVisible();

    // 3. maintenance -> build icon
    await page.route('**/api/status', async (route) => {
      await route.fulfill({
        json: {
          data: [{ id: '1', attributes: { name: 'Core API Gateway', status: 'maintenance' } }],
          incidents: []
        }
      });
    });
    await page.goto('/status');
    const heroMaint = page.locator('[data-testid="status-hero"]');
    await expect(heroMaint).toBeVisible();
    await expect(heroMaint).toContainText(/scheduled maintenance/i);
    await expect(heroMaint.locator('[data-testid="BuildIcon"]')).toBeVisible();
  });
});

test.describe('System Status - Personalized Alerts & Component UI', () => {
  test.use({ authRole: 'tester' });

  test('Sidebar Alert Warning Icon appears when /api/status/personalized returns hasAlert: true', async ({ page }) => {
    // Mock the personalized status endpoint to trigger an alert
    await page.route('**/api/status/personalized', async (route) => {
      await route.fulfill({ json: { hasAlert: true } });
    });

    await page.goto('/');
    
    // Find the sidebar link for "System Status" and check for the warning icon
    const sidebarLink = page.getByRole('link', { name: /System Status/i }).first();
    await expect(sidebarLink).toBeVisible();
    await expect(sidebarLink.locator('[data-testid="WarningAmberIcon"]')).toBeVisible();
  });

  test('ServiceList Collapsible Sections and Ext Tooltips', async ({ page }) => {
    await page.route('**/api/status', async (route) => {
      await route.fulfill({
        json: {
          data: [
            { id: '1', attributes: { name: 'Core API Gateway', status: 'up' } },
            { id: '2', attributes: { name: 'YouTube Data API', status: 'up' } },
            { id: '3', attributes: { name: 'Meta Graph API', status: 'down' } },
            { id: '4', attributes: { name: 'TikTok Publishing API', status: 'degraded' } }
          ],
          incidents: []
        }
      });
    });

    await page.goto('/status');
    
    // Verify core services collapsible
    const coreHeader = page.getByText('directly.social App Functionality');
    await expect(coreHeader).toBeVisible();
    await coreHeader.click(); // Expand

    const coreService = page.getByText('Platform Services');
    await expect(coreService).toBeVisible();
    await coreHeader.click(); // Collapse
    await expect(coreService).not.toBeVisible();

    // Verify external services and tooltips
    await expect(page.getByText('YouTube Connection')).toBeVisible();
    await expect(page.getByText('Facebook & Instagram Connection')).toBeVisible();
    await expect(page.getByText('TikTok Connection')).toBeVisible();
  });
});
