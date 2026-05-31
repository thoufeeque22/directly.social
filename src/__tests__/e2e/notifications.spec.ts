import { test, expect } from './base-test';;
import { execSync } from 'child_process';

function runDbScript(scriptName: string) {
  try {
    console.log(`[E2E DB Setup] Running ${scriptName}...`);
    execSync(`npx tsx src/__tests__/scripts/${scriptName}`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`[E2E DB Setup Error] Failed to run ${scriptName}:`, error);
  }
}

test.describe("Notification Utility E2E Tests @regression", () => {
  test.beforeEach(async ({ page }) => {
    // Seed notifications before each test
    runDbScript('seed-notifications.ts');
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Visibility of NotificationBell and Badge', async ({ page }) => {
    const bell = page.getByTestId('notification-bell');
    await expect(bell).toBeVisible();

    // In our seed, we have 3 unread notifications
    const badge = bell.locator('.MuiBadge-badge');
    await expect(badge).toHaveText('3');
  });

  test('Opening the NotificationPopover and verifying items', async ({ page }) => {
    const bell = page.getByTestId('notification-bell');
    await bell.click();

    // Verify popover is visible
    await expect(page.getByText('Notifications', { exact: true })).toBeVisible();

    // Verify specific notification messages from seed
    await expect(page.getByText('Post successfully published to Twitter')).toBeVisible();
    await expect(page.getByText('Failed to upload video to YouTube')).toBeVisible();
    await expect(page.getByText('AI Task: Title generation complete')).toBeVisible();
    await expect(page.getByText('Account connection expiring in 3 days')).toBeVisible();
  });

  test('Mark as Read functionality', async ({ page }) => {
    const bell = page.getByTestId('notification-bell');
    await bell.click();

    const notificationText = 'Post successfully published to Twitter';
    const unreadItem = page.locator('li').filter({ hasText: notificationText });
    
    // Check initial state (unread should have specific background or font weight)
    // We can't easily check computed style for everything, but we can click it.
    await unreadItem.click();

    // After clicking, the badge should decrease
    // Wait for the popover to close (it doesn't close automatically on mark read unless it has a link, but let's see)
    // Actually, NotificationItem.tsx:30 calls markAsRead(notification.id).
    // The popover stays open.
    
    // Check badge count decrease
    const badge = bell.locator('.MuiBadge-badge');
    await expect(badge).toHaveText('2');
  });

  test('Mark all as Read functionality', async ({ page }) => {
    const bell = page.getByTestId('notification-bell');
    await bell.click();

    const markAllBtn = page.getByRole('button', { name: 'Mark all as read' });
    await expect(markAllBtn).toBeVisible();
    await markAllBtn.click();

    // Badge should be hidden or 0
    const badge = bell.locator('.MuiBadge-badge');
    await expect(badge).toBeHidden();
  });

  test('Empty state visibility', async ({ page }) => {
    // Run cleanup script
    runDbScript('cleanup-notifications.ts');
    await page.reload();
    await page.waitForLoadState('networkidle');

    const bell = page.getByTestId('notification-bell');
    await bell.click();

    await expect(page.getByText('No notifications yet.')).toBeVisible();
    
    // "Mark all as read" should not be visible
    await expect(page.getByRole('button', { name: 'Mark all as read' })).toBeHidden();
  });
});
