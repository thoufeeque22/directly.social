import { test, expect } from './base-test';

test.describe('Ticket-637: UI Audit & Metadata Refactor @regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Ensure dashboard is loaded
    await expect(page.locator('#create-post-section')).toBeVisible({ timeout: 15000 });
  });

  test('should verify platform-specific metadata capture, clear, and undo', async ({ page }) => {
    // 1. Ensure AI Tier is "Manual"
    const manualTierButton = page.getByRole('button', { name: 'Manual', exact: true });
    await manualTierButton.click();

    // 2. Select platforms
    const youtubeButton = page.getByRole('button', { name: /YouTube:/i }).first();
    const tiktokButton = page.getByRole('button', { name: /Tiktok:/i }).first();
    
    // Wait for buttons to be present
    await expect(youtubeButton).toBeVisible();
    await expect(tiktokButton).toBeVisible();

    if (await youtubeButton.getAttribute('aria-pressed') !== 'true') {
      await youtubeButton.click();
    }
    if (await tiktokButton.getAttribute('aria-pressed') !== 'true') {
      await tiktokButton.click();
    }

    // 3. Navigate to Youtube Tab and fill fields
    await page.getByRole('tab', { name: 'Youtube' }).click();
    await page.getByRole('button', { name: 'Customize for youtube' }).click();
    
    const youtubeTitle = page.locator('input[name="title_youtube"]:not([type="hidden"])');
    const youtubeDesc = page.locator('textarea[name="description_youtube"]:not([type="hidden"])');
    await expect(youtubeTitle).toBeVisible();
    await expect(youtubeDesc).toBeVisible();
    
    await youtubeTitle.fill('YouTube Specific Title');
    await youtubeDesc.fill('YouTube Specific Description');

    // 4. Navigate to Tiktok Tab and fill fields
    await page.getByRole('tab', { name: 'Tiktok' }).click();
    await page.getByRole('button', { name: 'Customize for tiktok' }).click();
    
    const tiktokTitle = page.locator('input[name="title_tiktok"]:not([type="hidden"])');
    const tiktokDesc = page.locator('textarea[name="description_tiktok"]:not([type="hidden"])');
    await expect(tiktokTitle).toBeVisible();
    await expect(tiktokDesc).toBeVisible();

    await tiktokTitle.fill('TikTok Specific Title');
    await tiktokDesc.fill('TikTok Specific Description');

    // 5. Test Clear (✕) on Youtube tab
    await page.getByRole('tab', { name: 'Youtube' }).click();
    const youtubeTitleClear = page.locator('div:has(> input[name="title_youtube"]) > button').filter({ hasText: '✕' });
    await youtubeTitleClear.click();
    await expect(youtubeTitle).toHaveValue('');

    // 6. Test Undo on Youtube tab
    const youtubeTitleUndo = page.getByRole('button', { name: /Undo Clear/i }).first();
    await youtubeTitleUndo.click();
    await expect(youtubeTitle).toHaveValue('YouTube Specific Title');

    // 7. Verify Capture (TikTok remains unchanged)
    await page.getByRole('tab', { name: 'Tiktok' }).click();
    await expect(tiktokTitle).toHaveValue('TikTok Specific Title');
  });

  test('should verify Activity Hub title promotion and Multi-Title badge', async ({ page }) => {
    // 1. Ensure AI Tier is "Manual"
    await page.getByRole('button', { name: 'Manual', exact: true }).click();

    // 2. Select YouTube
    const youtubeButton = page.getByRole('button', { name: /YouTube:/i }).first();
    if (await youtubeButton.getAttribute('aria-pressed') !== 'true') {
      await youtubeButton.click();
    }
    
    // 3. Set platform specific title, keep global empty
    await page.getByRole('tab', { name: 'Youtube' }).click();
    await page.getByRole('button', { name: 'Customize for youtube' }).click();
    await page.locator('input[name="title_youtube"]:not([type="hidden"])').fill('Promoted YouTube Title');
    
    // 4. Select a file
    await page.locator('input[type="file"]').setInputFiles({
      name: 'test-video.mp4',
      mimeType: 'video/mp4',
      buffer: Buffer.from('fake-video-content'),
    });

    // 5. Submit
    await page.getByRole('button', { name: /Upload Now|Post Video/i }).click();

    // 6. Wait for navigation to /activity
    await page.waitForURL(/.*\/activity.*/, { timeout: 20000 });

    // 7. Verify first activity card title
    const firstCardTitle = page.locator('h3[class*="postTitle"]').first();
    await expect(firstCardTitle).toContainText('Promoted YouTube Title');

    // 8. Go back and test Multi-Title badge
    await page.goto('/');
    await page.getByRole('button', { name: 'Manual', exact: true }).click();
    const ytBtn = page.getByRole('button', { name: /YouTube:/i }).first();
    const igBtn = page.getByRole('button', { name: /Tiktok:/i }).first();
    if (await ytBtn.getAttribute('aria-pressed') !== 'true') await ytBtn.click();
    if (await igBtn.getAttribute('aria-pressed') !== 'true') await igBtn.click();
    
    await page.getByRole('tab', { name: 'Youtube' }).click();
    await page.getByRole('button', { name: 'Customize for youtube' }).click();
    await page.locator('input[name="title_youtube"]:not([type="hidden"])').fill('Title A');
    
    await page.getByRole('tab', { name: 'Tiktok' }).click();
    await page.getByRole('button', { name: 'Customize for tiktok' }).click();
    await page.locator('input[name="title_tiktok"]:not([type="hidden"])').fill('Title B');
    
    // Re-upload and submit
    await page.locator('input[type="file"]').setInputFiles({
      name: 'test-video-2.mp4',
      mimeType: 'video/mp4',
      buffer: Buffer.from('fake-video-content-2'),
    });
    
    await page.getByRole('button', { name: /Upload Now|Post Video/i }).click();
    await page.waitForURL(/.*\/activity.*/, { timeout: 20000 });

    // 9. Verify Multi-Title badge
    const multiTitleBadge = page.getByText('Multi-Title').first();
    await expect(multiTitleBadge).toBeVisible();
    
    // 10. Verify tooltip
    const youtubePill = page.locator('[class*="platformPill"]').filter({ hasText: 'YouTube' }).first();
    await expect(youtubePill).toHaveAttribute('title', /(Status:|Waiting for worker)/);
  });
});
