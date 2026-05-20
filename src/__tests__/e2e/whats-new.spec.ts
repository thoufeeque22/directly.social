import { test, expect } from '@playwright/test';

test.describe('Whats New Notification', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/');
  });

  test('Scenario 1: Unseen update displays notification badge', async ({ page }) => {
    // Reload to ensure the hook fetches the new seeded data
    await page.reload();
    
    // The component uses 'whats-new-badge-container' for the badge wrapper
    const badgeContainer = page.getByTestId('whats-new-badge-container');
    await expect(badgeContainer).toBeVisible({ timeout: 15000 });
    
    // Generate visual artifact
    await page.screenshot({ path: 'verification/whats-new-badge.png', fullPage: true });
  });

  test('Scenario 2: Clicking badge opens the What is New modal', async ({ page }) => {
    // Reload to ensure state
    await page.reload();
    const badge = page.getByTestId('whats-new-badge');
    await badge.click();
    
    // Wait for modal
    const modal = page.getByTestId('whats-new-modal');
    await expect(modal).toBeVisible({ timeout: 10000 });
    
    // Generate visual artifact
    await page.screenshot({ path: 'verification/whats-new-modal.png', fullPage: true });
  });

  test('Scenario 3: Closing modal marks as seen and hides badge', async ({ page }) => {
    // Reload to ensure state
    await page.reload();
    const badge = page.getByTestId('whats-new-badge');
    await badge.click();
    
    const closeButton = page.getByTestId('whats-new-modal-close');
    await closeButton.click();
    
    await expect(page.getByTestId('whats-new-modal')).not.toBeVisible();
    await page.reload();
    await expect(page.getByTestId('whats-new-badge-container')).not.toBeVisible();
  });
});
