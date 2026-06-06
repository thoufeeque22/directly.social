import { test, expect } from './base-test';;
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function safeExec(command: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return execSync(command, { stdio: 'inherit' });
    } catch (error) {
      if (i === retries - 1) throw error;
      console.warn(`[E2E] Command failed, retrying (${i + 1}/${retries}): ${command}`);
    }
  }
}

test.describe('Analytics Dashboard', () => {
  // Use admin role for this file by default
  test.use({ authRole: 'admin' });

  test.beforeAll(async () => {
    // Seed mock data for the charts
    // We don't deleteMany() anymore to avoid breaking other parallel tests
    
    const today = new Date();
    
    const getDaysAgo = (days: number) => {
      const date = new Date(today);
      date.setDate(date.getDate() - days);
      return date;
    };

    const days = Array.from({ length: 7 }, (_, i) => getDaysAgo(6 - i));

    // Fluctuating values for a 7-day period with different peaks
    const chatbotUsage = [20, 85, 30, 45, 50, 15, 60];
    const calendarUsage = [10, 30, 90, 40, 35, 55, 10];
    const snippetsUsage = [80, 15, 10, 25, 20, 95, 30];
    const searchUsage = [5, 10, 8, 15, 12, 20, 18];
    const mediaUsage = [25, 50, 40, 80, 55, 10, 90];
    const manualUsage = [15, 10, 20, 5, 85, 30, 40];

    const featureData = days.flatMap((date, i) => [
      { name: 'feature:usage:ai_chatbot', value: chatbotUsage[i], timestamp: date },
      { name: 'feature:usage:calendar', value: calendarUsage[i], timestamp: date },
      { name: 'feature:usage:snippets', value: snippetsUsage[i], timestamp: date },
      { name: 'feature:usage:global_search', value: searchUsage[i], timestamp: date },
      { name: 'feature:usage:media_picker', value: mediaUsage[i], timestamp: date },
      { name: 'feature:usage:manual_mode', value: manualUsage[i], timestamp: date },
    ]);

    await prisma.systemMetric.createMany({
      data: [
        ...featureData,
        // Platform Success/Errors (Totals over the period)
        { name: 'platform:success:youtube', value: 320, timestamp: today },
        { name: 'platform:error:youtube', value: 15, timestamp: today },
        { name: 'platform:success:instagram', value: 285, timestamp: today },
        { name: 'platform:error:instagram', value: 32, timestamp: today },
        { name: 'platform:success:tiktok', value: 410, timestamp: today },
        { name: 'platform:error:tiktok', value: 18, timestamp: today },
        
        // General API Usage
        { name: 'api:consumption:google', value: 1450, timestamp: today },
        { name: 'api:consumption:sentry', value: 124, timestamp: today },
      ],
    });
  });

  test.afterAll(async () => {
    await prisma.$disconnect();
  });

  test.describe('admin access', () => {
    // No need to override storageState here, the describe-level one is admin.json
    test('admin can view analytics dashboard with populated data', async ({ page }) => {
      await page.goto('/admin/analytics', { waitUntil: 'networkidle' });

      // Check for dashboard component
      const dashboard = page.getByTestId('admin-analytics-dashboard');
      await expect(dashboard).toBeVisible({ timeout: 20000 });
      await expect(page.getByTestId('feature-adoption-chart')).toBeVisible({ timeout: 10000 });

      // Wait a brief moment to ensure charts render animations
      await page.waitForTimeout(2000);

      // Take screenshot
      await dashboard.screenshot({ path: 'verification/admin-analytics-dashboard.png' });
    });
    });



    test.describe('non-admin access', () => {
      // Force a regular user session for this block
      test.use({ authRole: 'tester' });

      test('non-admin user is redirected or denied access', async ({ page }) => {
        // First go to dashboard to confirm we are logged in and healthy
        await page.goto('/', { waitUntil: 'networkidle' });
        await expect(page.locator('h2:has-text("Upload & Automate")').first()).toBeVisible();

        // Now try to access admin analytics
        try {
          await page.goto('/admin/analytics', { waitUntil: 'commit' });
        } catch (e) {
          // Ignore fast-redirect network aborts
          console.log('[E2E] Handled fast redirect abort during goto.');
        }

        // Our middleware redirects to home
        await expect(page).toHaveURL(/\/$/, { timeout: 15000 });
        await expect(page.getByTestId('admin-analytics-dashboard')).not.toBeVisible();
      });
    });
});
