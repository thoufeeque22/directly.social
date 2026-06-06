import { test, expect } from './base-test';;
import { execSync } from 'child_process';

test.describe('Parallel Distribution Channels', () => {

  test.beforeAll(async ({}, testInfo) => {
    const workerIndex = testInfo.workerIndex;
    const email = `tester-${workerIndex % 10}@directly.social`;
    // Seed accounts to ensure platforms are recognized for this worker
    execSync(`npx tsx -e "
      import { PrismaClient } from '@prisma/client';
      const prisma = new PrismaClient();
      async function main() {
        const user = await prisma.user.findUnique({ where: { email: '${email}' } });
        if (user) {
          const platforms = ['youtube', 'facebook', 'instagram', 'tiktok'];
          for (let i = 0; i < platforms.length; i++) {
            const p = platforms[i];
            await prisma.account.upsert({
              where: { provider_providerAccountId: { provider: p, providerAccountId: p + ':local-dev-' + (i+1) } },
              update: { userId: user.id },
              create: {
                userId: user.id,
                type: 'oauth',
                provider: p,
                providerAccountId: p + ':local-dev-' + (i+1),
                access_token: 'mock-token'
              }
            });
          }
        }
      }
      main().finally(() => prisma.\\$disconnect());
    "`);
  });

  test('should process multiple platform uploads concurrently', async ({ page }) => {
    // 1. Mock activity to be empty initially
    await page.route('**/api/activity*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [] })
      });
    });
    
    let activeUploads = 0;
    let maxConcurrency = 0;
    let totalUploads = 0;
    
    // Intercept upload API calls
    await page.route('**/api/upload/*', async (route) => {
      if (route.request().url().includes('/api/upload/init')) {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ success: true, data: { activityId: 'e2e-activity-123' } })
        });
        return;
      }

      activeUploads++;
      totalUploads++;
      if (activeUploads > maxConcurrency) {
        maxConcurrency = activeUploads;
      }
      
      await new Promise(r => setTimeout(r, 1500));
      
      activeUploads--;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          success: true, 
          data: { url: 'http://test', id: 'video-123' } 
        })
      });
    });

    // We will inject a pending post that requests uploading to 4 platforms
    await page.goto('/activity');

    await page.evaluate(() => {
      localStorage.setItem('SS_PENDING_POST', JSON.stringify({
        resumeActivityId: 'e2e-activity-123',
        title: 'Parallel E2E Test',
        videoFormat: 'short',
        platforms: [
          { platform: 'youtube', accountId: 'youtube:local-dev-1' },
          { platform: 'facebook', accountId: 'facebook:local-dev-2' },
          { platform: 'instagram', accountId: 'instagram:local-dev-3' },
          { platform: 'tiktok', accountId: 'tiktok:local-dev-4' }
        ],
        galleryFileId: 'mock-file-123',
        galleryFileName: 'mock.mp4',
        aiTier: 'Manual'
      }));
    });

    await page.goto('/activity?action=distribute');

    const ghostCard = page.getByText(/Parallel E2E Test/i);
    await expect(ghostCard).toBeVisible();

    await expect.poll(() => maxConcurrency, { timeout: 15000 }).toBeGreaterThanOrEqual(3);
    await expect.poll(() => totalUploads, { timeout: 15000 }).toBe(4);
    expect(maxConcurrency).toBeLessThanOrEqual(3);
  });
});
