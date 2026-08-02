import { test, expect } from './base-test';

/**
 * E2E Tests — LinkedIn Integration (Ticket #412)
 *
 * TDD finish line updated to reflect General Availability (no Pro tier gate).
 * Tests cover:
 *  1. Connect button visible for all users.
 *  2. Auth bridge modal opens on connect click.
 *  3. Auth bridge modal closes on cancel.
 */

test.describe('LinkedIn Integration — General Availability', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings?tab=destinations');
    await expect(page.locator('[data-testid="settings-content-pane"]')).toBeVisible({
      timeout: 15000,
    });
  });

  test('should show connect button for all users', async ({ page }) => {
    const linkedInCard = page.locator('[data-testid="integration-card-linkedin"]');
    await expect(linkedInCard).toBeVisible({ timeout: 10000 });
    
    const connectBtn = linkedInCard.locator('[data-testid="linkedin-connect-btn"]');
    await expect(connectBtn).toBeVisible();
    await expect(connectBtn).toHaveText('Connect LinkedIn');
  });

  test('should show auth bridge modal when clicking connect', async ({ page }) => {
    const linkedInCard = page.locator('[data-testid="integration-card-linkedin"]');
    await expect(linkedInCard).toBeVisible({ timeout: 10000 });

    const connectBtn = linkedInCard.locator('[data-testid="linkedin-connect-btn"]');
    await expect(connectBtn).toBeVisible({ timeout: 5000 });
    await connectBtn.click({ force: true });

    const modal = page.locator('[data-testid="linkedin-auth-bridge-modal"]');
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(modal.getByTestId('linkedin-auth-bridge-confirm')).toBeVisible();
  });

  test('should close auth bridge modal on cancel', async ({ page }) => {
    const connectBtn = page.locator('[data-testid="linkedin-connect-btn"]');
    await expect(connectBtn).toBeVisible({ timeout: 10000 });
    await connectBtn.click({ force: true });

    const modal = page.locator('[data-testid="linkedin-auth-bridge-modal"]');
    await expect(modal).toBeVisible({ timeout: 5000 });
    await modal.getByRole('button', { name: 'Cancel' }).click();
    await expect(modal).not.toBeVisible({ timeout: 5000 });
  });
});
