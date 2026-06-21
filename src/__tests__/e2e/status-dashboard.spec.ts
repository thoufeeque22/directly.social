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

  test('Footer Link - Authenticated: Log in as tester, click Status link in app layout footer, assert navigation to /status', async ({ page }) => {
    await page.goto('/');
    
    // Find the footer link for "Status" in dashboard footer
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    const statusLink = footer.getByRole('link', { name: 'Status', exact: true });
    await expect(statusLink).toBeVisible();
    await statusLink.scrollIntoViewIfNeeded();
    await statusLink.click();
    
    // Assert navigation to /status
    await expect(page).toHaveURL(/\/status/);
  });

  test('Page Elements: Verify /status page displays heading, refresh button, and updates last updated text', async ({ page }) => {
    await page.goto('/status');
    
    // Verify displays heading "System Status"
    const heading = page.getByRole('heading', { name: 'System Status' });
    await expect(heading).toBeVisible();
    
    // Has a Refresh button
    const refreshButton = page.getByRole('button', { name: 'Refresh' });
    await expect(refreshButton).toBeVisible();
    
    // Clicking the Refresh button updates the "Last Updated" text
    const lastUpdated = page.getByText(/Last Updated:/i);
    await expect(lastUpdated).toBeVisible();
    
    // Wait for 1 second before clicking to allow timestamp change
    await page.waitForTimeout(1000);
    await refreshButton.click();
    
    const updatedText = await lastUpdated.textContent();
    await expect(lastUpdated).toBeVisible();
    expect(updatedText).not.toBeNull();
  });

  test('Scenario Simulations: Verify different status query parameters', async ({ page }) => {
    // 1. ?scenario=degraded-performance -> warning icon
    await page.goto('/status?scenario=degraded-performance');
    const heroDegraded = page.locator('[data-testid="status-hero"]');
    await expect(heroDegraded).toBeVisible();
    await expect(heroDegraded).toContainText(/degraded performance/i);
    await expect(heroDegraded.locator('[data-testid="WarningIcon"]')).toBeVisible();

    // 2. ?scenario=major-outage -> error icon
    await page.goto('/status?scenario=major-outage');
    const heroOutage = page.locator('[data-testid="status-hero"]');
    await expect(heroOutage).toBeVisible();
    await expect(heroOutage).toContainText(/system outage/i);
    await expect(heroOutage.locator('[data-testid="ErrorIcon"]')).toBeVisible();

    // 3. ?scenario=maintenance -> build icon
    await page.goto('/status?scenario=maintenance');
    const heroMaint = page.locator('[data-testid="status-hero"]');
    await expect(heroMaint).toBeVisible();
    await expect(heroMaint).toContainText(/scheduled maintenance/i);
    await expect(heroMaint.locator('[data-testid="BuildIcon"]')).toBeVisible();

    // 4. ?scenario=error -> MUI Alert severity="error"
    await page.goto('/status?scenario=error');
    const errorAlert = page.getByRole('alert');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText(/error/i);
  });
});
