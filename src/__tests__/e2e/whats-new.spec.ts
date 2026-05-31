import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

function runDbScript(scriptName: string) {
  try {
    console.log(`[E2E DB Setup] Running ${scriptName}...`);
    execSync(`npx tsx src/__tests__/scripts/${scriptName}`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`[E2E DB Setup Error] Failed to run ${scriptName}:`, error);
  }
}

test.describe("What's New Option A E2E & Visual Verification @regression", () => {
  test.beforeAll(async () => {
    const dir = path.join(process.cwd(), 'verification');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  test('E2E Flow: Unread Badge, Popover Dismissal, Profile Link, and Activity State', async ({ page }) => {
    // 1. Reset database to have clean unseen updates
    runDbScript('cleanup-whats-new.ts');
    runDbScript('seed-whats-new.ts');

    // 2. Navigate to dashboard and verify the unread badge exists
    console.log('Navigating to dashboard...');
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // The component uses 'whats-new-badge-container' for the badge wrapper
    const badgeContainer = page.getByTestId('whats-new-badge-container');
    await expect(badgeContainer).toBeVisible({ timeout: 15000 });

    const badgeContent = await badgeContainer.locator('.MuiBadge-badge').innerText();
    console.log(`Unread badge count is: ${badgeContent}`);
    expect(parseInt(badgeContent)).toBeGreaterThan(0);

    await page.screenshot({ path: 'verification/whats-new-badge.png', fullPage: true });

    // 3. Click the badge to open the Popover and instantly clear the count
    const badgeButton = page.getByTestId('whats-new-badge');
    
    console.log('Clicking the badge button...');
    await badgeButton.click();

    // Verify popover is visible
    const popover = page.getByTestId('whats-new-modal');
    try {
      await expect(popover).toBeVisible({ timeout: 10000 });
    } catch (e) {
      console.log('=== PAGE HTML CONTENT ON FAILURE ===');
      const html = await page.content();
      console.log(html);
      console.log('====================================');
      throw e;
    }

    const unreadList = page.getByTestId('whats-new-list');
    await expect(unreadList).toBeVisible();

    // Assert the badge dot (the red circle) has disappeared instantly in the header
    const badgeDot = badgeContainer.locator('.MuiBadge-badge');
    await expect(badgeDot).toBeHidden();

    await page.screenshot({ path: 'verification/whats-new-popover-unread.png', fullPage: true });

    // 4. Close the popover and verify the permanent profile link
    const closeButton = page.getByTestId('whats-new-modal-close');
    await closeButton.click();
    await expect(popover).not.toBeVisible();

    // Open the user profile dropdown menu first
    const profileMenuButton = page.getByTestId('profile-menu-button');
    await expect(profileMenuButton).toBeVisible();
    await profileMenuButton.click();

    // Locate the permanent link in the user profile menu
    const profileLink = page.getByTestId('whats-new-profile-link');
    await expect(profileLink).toBeVisible();

    await page.screenshot({ path: 'verification/whats-new-profile-link.png', fullPage: true });

    // 5. Open popover from Profile Link showing historical updates
    // Since we cleared the updates when opening the popover earlier, the unread count is 0
    await profileLink.click();
    await expect(popover).toBeVisible();

    const activityList = page.getByTestId('whats-new-activity-list');
    await expect(activityList).toBeVisible({ timeout: 10000 });

    await page.screenshot({ path: 'verification/whats-new-popover-activity.png', fullPage: true });

    await closeButton.click();
    await expect(popover).not.toBeVisible();
  });
});
