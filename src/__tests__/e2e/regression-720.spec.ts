// regression-720.spec.ts
import { test, expect } from '@playwright/test';

/**
 * Automated regression tests for issue #720.
 * Covers Activity pagination, BYOS credential handling, Calendar initial load
 * and responsiveness, Sign Out flow, and Activity Hub video placeholder.
 */

test.describe('Regression Issue #720', () => {
  test('Activity Domain - Load More pagination', async ({ page }) => {
    await page.goto('/activity');
    // Ensure initial items are loaded
    await expect(page.locator('[data-testid="activity-item"]').first()).toBeVisible();
    // Click Load More button
    const loadMore = page.locator('button', { hasText: /load more/i });
    await loadMore.click();
    // Verify additional items appear
    await expect(page.locator('[data-testid="activity-item"]').nth(10)).toBeVisible();
  });

  test('BYOS - Invalid credentials timeout handling', async ({ page }) => {
    await page.goto('/byos');
    // Fill credentials with invalid data
    await page.fill('[data-testid="username-input"]', 'invalid_user');
    await page.fill('[data-testid="password-input"]', 'wrong_pass');
    await page.click('[data-testid="submit-button"]');
    // Expect error toast within timeout
    const errorToast = page.locator('[role="alert"]').first();
    await expect(errorToast).toContainText('Invalid credentials');
  });

  test('Calendar Content Planner - Initial load defaults and mobile layout', async ({ page }) => {
    // Desktop view
    await page.goto('/calendar');
    // Timeline should be visible by default
    await expect(page.locator('[data-testid="timeline"]')).toBeVisible();

    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload();
    // Verify mobile-specific element is present
    await expect(page.locator('[data-testid="mobile-calendar"]')).toBeVisible();
  });

  test('Sign Out flow redirects with success message', async ({ page }) => {
    await page.goto('/');
    // Assume user is logged in; perform sign out
    await page.click('[data-testid="signout-button"]');
    // Verify redirect to landing page
    await expect(page).toHaveURL('/landing');
    // Success message present
    await expect(page.locator('[data-testid="toast-success"]')).toContainText('Signed out successfully');
  });

  test('Ticket 637 - Activity Hub video placeholder loads', async ({ page }) => {
    await page.goto('/activity-hub');
    const video = page.locator('video[data-testid="activity-video"]');
    await expect(video).toHaveAttribute('src', /video-placeholder\.mp4$/);
    // Verify video can play (metadata loaded)
    await expect(video).toHaveAttribute('readyState', /4/);
  });
});
