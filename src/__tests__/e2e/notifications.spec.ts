import { test, expect } from './base-test';;

const mockNotifications = [
  {
    id: 'mock-notif-1',
    type: 'SUCCESS',
    message: 'Post successfully published to Twitter',
    isRead: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'mock-notif-2',
    type: 'ERROR',
    message: 'Failed to upload video to YouTube',
    isRead: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'mock-notif-3',
    type: 'INFO',
    message: 'AI Task: Title generation complete',
    isRead: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'mock-notif-4',
    type: 'WARNING',
    message: 'Account connection expiring in 3 days',
    isRead: false,
    createdAt: new Date().toISOString()
  }
];

test.describe('Notification Utility E2E Tests @regression', () => {
  test('Visibility of NotificationBell and Badge', async ({ page }) => {
    // Inject mocks before page loads
    await page.addInitScript((notifications) => {
      (window as Window & { __MOCK_NOTIFICATIONS__?: unknown }).__MOCK_NOTIFICATIONS__ = notifications;
    }, mockNotifications);
    
    await page.goto('/');

    const bell = page.getByTestId('notification-bell');
    await expect(bell).toBeVisible();

    // In our mock, we have exactly 3 unread notifications
    const badge = bell.locator('.MuiBadge-badge');
    await expect(badge).toHaveText('3');
  });

  test('Opening the NotificationPopover and verifying items', async ({ page }) => {
    await page.addInitScript((notifications) => {
      (window as Window & { __MOCK_NOTIFICATIONS__?: unknown }).__MOCK_NOTIFICATIONS__ = notifications;
    }, mockNotifications);
    
    await page.goto('/');

    const bell = page.getByTestId('notification-bell');
    await bell.click();

    // Verify popover is visible
    await expect(page.getByText('Notifications', { exact: true })).toBeVisible();

    // Verify specific notification messages from mock
    await expect(page.getByText('Post successfully published to Twitter')).toBeVisible();
    await expect(page.getByText('Failed to upload video to YouTube')).toBeVisible();
    await expect(page.getByText('AI Task: Title generation complete')).toBeVisible();
    await expect(page.getByText('Account connection expiring in 3 days')).toBeVisible();
  });

  test('Mark as Read functionality', async ({ page }) => {
    await page.addInitScript((notifications) => {
      (window as Window & { __MOCK_NOTIFICATIONS__?: unknown }).__MOCK_NOTIFICATIONS__ = notifications;
    }, mockNotifications);
    
    await page.goto('/');

    const bell = page.getByTestId('notification-bell');
    await bell.click();
    await expect(page.getByText('Notifications', { exact: true })).toBeVisible();

    const notificationText = 'Post successfully published to Twitter';
    const unreadItem = page.locator('li').filter({ hasText: notificationText });
    await unreadItem.click();

    // After clicking, the badge should decrease to 2
    const badge = bell.locator('.MuiBadge-badge');
    await expect(badge).toHaveText('2');
  });

  test('Mark all as Read functionality', async ({ page }) => {
    await page.addInitScript((notifications) => {
      (window as Window & { __MOCK_NOTIFICATIONS__?: unknown }).__MOCK_NOTIFICATIONS__ = notifications;
    }, mockNotifications);
    
    await page.goto('/');

    const bell = page.getByTestId('notification-bell');
    await bell.click();
    await expect(page.getByText('Notifications', { exact: true })).toBeVisible();

    const markAllBtn = page.getByRole('button', { name: 'Mark all as read' });
    await expect(markAllBtn).toBeVisible();
    await markAllBtn.click();

    // Badge should be hidden or 0
    const badge = bell.locator('.MuiBadge-badge');
    await expect(badge).toBeHidden();
  });

  test('Empty state visibility', async ({ page }) => {
    await page.addInitScript(() => {
      (window as Window & { __MOCK_NOTIFICATIONS__?: unknown }).__MOCK_NOTIFICATIONS__ = [];
    });
    
    await page.goto('/');

    const bell = page.getByTestId('notification-bell');
    await bell.click();
    await expect(page.getByText('Notifications', { exact: true })).toBeVisible();

    await expect(page.getByText('No notifications yet.')).toBeVisible();
    
    // "Mark all as read" should not be visible
    await expect(page.getByRole('button', { name: 'Mark all as read' })).toBeHidden();
  });
});
