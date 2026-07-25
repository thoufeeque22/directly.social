import { test, expect } from './base-test';

/**
 * E2E Tests — LinkedIn Integration (Ticket #412)
 *
 * TDD finish line established by the QA Agent.
 * Tests cover:
 *  1. Free Tier restriction (locked card / Pricing Anchor)
 *  2. Pro Tier flow (auth bridge modal before OAuth)
 *  3. Backend enforcement (API 403 for Free Tier)
 */

test.describe('LinkedIn Integration — Free Tier Restrictions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings?tab=destinations');
    await expect(page.locator('[data-testid="settings-content-pane"]')).toBeVisible({
      timeout: 15000,
    });
  });

  test('should show locked LinkedIn card for Free Tier users', async ({ page }) => {
    const linkedInCard = page.locator('[data-testid="integration-card-linkedin"]');
    await expect(linkedInCard).toBeVisible({ timeout: 10000 });
    const upgradeBtn = linkedInCard.locator('[data-testid="linkedin-upgrade-cta"]');
    await expect(upgradeBtn).toBeVisible();
    await expect(upgradeBtn).toHaveText('Upgrade to Pro');
  });

  test('should not show connect button for Free Tier users', async ({ page }) => {
    const connectBtn = page.locator('[data-testid="linkedin-connect-btn"]');
    await expect(connectBtn).not.toBeVisible({ timeout: 5000 });
  });
});

test.describe('LinkedIn Integration — Pro Tier Flow', () => {
  test.use({ authRole: 'admin' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/settings?tab=destinations');
    await expect(page.locator('[data-testid="settings-content-pane"]')).toBeVisible({
      timeout: 15000,
    });
  });

  test('should show auth bridge modal when clicking connect', async ({ page }) => {
    const linkedInCard = page.locator('[data-testid="integration-card-linkedin"]');
    await expect(linkedInCard).toBeVisible({ timeout: 10000 });

    const connectBtn = linkedInCard.locator('[data-testid="linkedin-connect-btn"]');
    await expect(connectBtn).toBeVisible({ timeout: 5000 });
    await connectBtn.click();

    const modal = page.locator('[data-testid="linkedin-auth-bridge-modal"]');
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(modal.getByTestId('linkedin-auth-bridge-confirm')).toBeVisible();
  });

  test('should close auth bridge modal on cancel', async ({ page }) => {
    const connectBtn = page.locator('[data-testid="linkedin-connect-btn"]');
    await expect(connectBtn).toBeVisible({ timeout: 10000 });
    await connectBtn.click();

    const modal = page.locator('[data-testid="linkedin-auth-bridge-modal"]');
    await expect(modal).toBeVisible({ timeout: 5000 });
    await modal.getByRole('button', { name: 'Cancel' }).click();
    await expect(modal).not.toBeVisible({ timeout: 5000 });
  });
});

test.describe('LinkedIn Integration — Backend Enforcement', () => {
  test('should return 403 for Free Tier users attempting to schedule a post', async ({
    request,
  }) => {
    const res = await request.post('/api/linkedin/posts', {
      data: { text: 'Test post from Free Tier' },
    });
    expect(res.status()).toBe(403);
    const body = (await res.json()) as { error?: string };
    expect(body.error).toContain('Pro');
  });
});
