import { test, expect } from './base-test';;
import { execSync } from 'child_process';

test.describe.serial('Schedule Navigation', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/');
    // Ensure dashboard is loaded
    await expect(page.locator('h2:has-text("Upcoming Posts")').first()).toBeVisible();
    // Wait for React hydration and layout stabilization
    await page.waitForTimeout(1000);
  });

  test('should navigate to full schedule view from sidebar "View All" button', async ({ page }) => {
    const viewAllButton = page.getByTestId('sidebar-view-all-schedule');
    await expect(viewAllButton).toBeVisible({ timeout: 15000 });
    await viewAllButton.scrollIntoViewIfNeeded();
    await viewAllButton.click();

    // Verify redirect to /schedule
    await expect(page).toHaveURL(/\/schedule/);
    await expect(page.getByRole('heading', { name: 'Scheduled Posts', level: 1 })).toBeVisible();
  });

  test('should navigate to specific post in schedule view and highlight it', async ({ page, workerEmail }) => {
    const postTitle = 'Scheduled Post 2';
    const workerSuffix = workerEmail === 'tester@directly.social' ? 'legacy' : workerEmail.split('@')[0].split('-')[1];
    const postId = `e2e-post-2-${workerSuffix}`;
    
    const sidebarLink = page.getByTestId(`sidebar-post-${postId}`);
    await expect(sidebarLink).toBeVisible({ timeout: 15000 });
    await sidebarLink.scrollIntoViewIfNeeded();
    await expect(sidebarLink).toContainText(postTitle);
    await sidebarLink.click();

    // Verify redirect with ID param
    await expect(page).toHaveURL(new RegExp(`/schedule\\?id=${postId}`));
    
    // Verify specific post card is visible in schedule
    const scheduleCard = page.getByTestId(`schedule-post-${postId}`);
    await expect(scheduleCard).toBeVisible();
    await expect(scheduleCard).toContainText(postTitle);
    
    // Check if highlight class is applied (MUI pulse animation is usually in CSS modules)
    // We can check if the element has the highlighted class or the styles associated
    // Based on the code: className={`${styles.postCard} ${targetId === post.id ? styles.highlightedPost : ''}`}
    // We can check for the attribute or style
    await expect(scheduleCard).toHaveClass(/highlightedPost/);
  });

  test('should handle non-existent post ID gracefully', async ({ page }) => {
    // Mock empty result for invalid ID to ensure it doesn't crash
    await page.route('**/api/activity*', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] }) });
    });

    const invalidId = 'non-existent-id-123';
    await page.goto(`/schedule?id=${invalidId}`);

    // Should still load the schedule page
    await expect(page.getByRole('heading', { name: 'Scheduled Posts', level: 1 })).toBeVisible();
  });

  test('should load all posts when no ID is provided', async ({ page, workerEmail }) => {
    await page.goto('/schedule');
    
    // Should show the list of posts (since we seeded 3)
    const workerSuffix = workerEmail === 'tester@directly.social' ? 'legacy' : workerEmail.split('@')[0].split('-')[1];
    await expect(page.getByTestId(`schedule-post-e2e-post-1-${workerSuffix}`)).toBeVisible();
    
    // None should be highlighted
    const highlighted = page.locator('.highlightedPost');
    await expect(highlighted).toHaveCount(0);
  });

  test('should work on mobile viewport', async ({ page, workerEmail }) => {
    // Set viewport to mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // In our app, sidebar might be at the bottom or hidden behind a menu.
    // Let's check if "Upcoming Posts" section is visible.
    await expect(page.getByRole('heading', { name: 'Upcoming Posts' }).first()).toBeVisible();
    
    const workerSuffix = workerEmail === 'tester@directly.social' ? 'legacy' : workerEmail.split('@')[0].split('-')[1];
    const sidebarLink = page.getByTestId(`sidebar-post-e2e-post-1-${workerSuffix}`);
    await expect(sidebarLink).toBeVisible({ timeout: 15000 });
    await sidebarLink.scrollIntoViewIfNeeded();
    await sidebarLink.click();

    await expect(page).toHaveURL(new RegExp(`/schedule\\?id=e2e-post-1-${workerSuffix}`));
    await expect(page.getByTestId(`schedule-post-e2e-post-1-${workerSuffix}`)).toBeVisible();
  });
});
