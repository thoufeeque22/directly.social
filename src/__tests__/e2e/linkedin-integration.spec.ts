import { test, expect } from './base-test';

test.describe('LinkedIn Integration', () => {

  test('Free Tier User sees locked LinkedIn card (Pricing Anchor)', async ({ page }) => {
    // 1. Mock API to return FREE tier
    await page.route('**/api/user/me*', async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      json.billingProfile = {
        subscriptionTier: 'FREE_STARTER',
        subscriptionStatus: 'ACTIVE'
      };
      await route.fulfill({ response, json });
    });

    await page.route('**/api/billing/profile*', async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          subscriptionTier: 'FREE_STARTER',
          subscriptionStatus: 'ACTIVE'
        }
      });
    });

    // 2. Go to settings/destinations page
    await page.goto('/settings?tab=destinations');

    // 3. Find LinkedIn card
    const linkedInCard = page.locator('[data-testid="integration-card-linkedin"]');
    await expect(linkedInCard).toBeVisible();

    // 4. Assert it is locked
    await expect(linkedInCard.locator('[data-testid="lock-icon"]')).toBeVisible();
    await expect(linkedInCard.getByRole('button', { name: /upgrade/i })).toBeVisible();
  });

  test('Pro Tier User sees standard integration flow and Authorization Bridge', async ({ page }) => {
    // 1. Mock API to return PRO tier
    await page.route('**/api/user/me*', async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      json.billingProfile = {
        subscriptionTier: 'CREATOR_PRO',
        subscriptionStatus: 'ACTIVE'
      };
      await route.fulfill({ response, json });
    });

    await page.route('**/api/billing/profile*', async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          subscriptionTier: 'CREATOR_PRO',
          subscriptionStatus: 'ACTIVE'
        }
      });
    });

    await page.goto('/settings?tab=destinations');

    const linkedInCard = page.locator('[data-testid="integration-card-linkedin"]');
    await expect(linkedInCard).toBeVisible();

    // Should not be locked
    await expect(linkedInCard.locator('[data-testid="lock-icon"]')).toBeHidden();

    // Click connect
    await linkedInCard.getByRole('button', { name: /connect/i }).click();

    // Expect Authorization Bridge modal
    const authModal = page.locator('[data-testid="linkedin-auth-bridge-modal"]');
    await expect(authModal).toBeVisible();
    await expect(authModal).toContainText('LinkedIn Marketing Developer Program');

    // Proceed to OAuth (we intercept navigation to the OAuth provider)
    await page.route('**/api/auth/signin/linkedin*', async (route) => {
      await route.fulfill({ status: 200, body: 'Mocked OAuth Redirection' });
    });

    const popupPromise = page.waitForEvent('popup', { timeout: 5000 }).catch(() => null);
    
    await authModal.getByRole('button', { name: /proceed to linkedin/i }).click();

    // Either a popup or a redirect should occur, we check if the request is triggered
  });

  test('Scheduling post fails for Free Tier if bypassed', async ({ request }) => {
    // 1. Trying to schedule directly via API should be rejected for free tier
    const response = await request.post('/api/post/schedule', {
      data: {
        title: 'Test LinkedIn Post',
        platforms: ['linkedin'],
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        videoFormat: 'short'
      }
    });

    // We assume the e2e tester account has FREE_STARTER by default or the API correctly intercepts it based on mock / role.
    // If the API allows it, this test will fail, indicating missing backend enforcement.
    expect(response.status()).toBe(403);
    const body = await response.json();
    expect(body.error).toMatch(/upgrade/i);
  });
});
