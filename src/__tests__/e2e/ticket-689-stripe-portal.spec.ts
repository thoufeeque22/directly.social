import { test, expect } from './base-test';

test.describe('Ticket 689: Stripe Customer Portal', () => {
  test.use({ authRole: 'tester' });

  test('Free users should see Upgrade button instead of Manage Subscription', async ({ page }) => {
    await page.goto('/settings?tab=account');
    const accountTab = page.locator('text=Subscription & Billing').first();
    await expect(accountTab).toBeVisible();

    const manageSubBtn = page.locator('text=Manage Subscription');
    await expect(manageSubBtn).toHaveCount(0);
    
    const upgradeBtn = page.locator('text=View Plans & Upgrade').first();
    await expect(upgradeBtn).toBeVisible();
  });
});

import { execSync } from 'child_process';

test.describe('Ticket 689: Stripe Customer Portal (Admin/Pro)', () => {
  test.use({ authRole: 'admin' });

  test('Admin users (mocked as Pro) should see Manage Subscription button', async ({ page, adminEmail }) => {
    execSync(`npx tsx src/__tests__/scripts/seed-billing-pro.ts ${adminEmail}`, { stdio: 'inherit' });

    await page.goto('/settings?tab=account');
    
    const accountTab = page.locator('text=Subscription & Billing').first();
    await expect(accountTab).toBeVisible();

    const manageSubBtn = page.locator('text=Manage Subscription').first();
    await expect(manageSubBtn).toBeVisible();
  });
});
