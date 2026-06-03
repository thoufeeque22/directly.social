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
    const youtubeButton = page.getByRole('button', { name: /YouTube:/i });
    const tiktokButton = page.getByRole('button', { name: /TikTok:/i });
    
    // Wait for buttons to be present
    await expect(youtubeButton).toBeVisible();
    await expect(tiktokButton).toBeVisible();

    if (await youtubeButton.getAttribute('aria-pressed') !== 'true') {
      await youtubeButton.click();
    }
    if (await tiktokButton.getAttribute('aria-pressed') !== 'true') {
      await tiktokButton.click();
    }

    // 3. Toggle Platform Specific Metadata
    const specificToggle = page.getByLabel('Separate titles/descriptions per platform');
    await specificToggle.check();

    // 4. Verify fields appear
    const youtubeTitle = page.locator('input[name="title_YouTube"]');
    const youtubeDesc = page.locator('textarea[name="description_YouTube"]');
    const tiktokTitle = page.locator('input[name="title_TikTok"]');
    const tiktokDesc = page.locator('textarea[name="description_TikTok"]');

    await expect(youtubeTitle).toBeVisible();
    await expect(youtubeDesc).toBeVisible();
    await expect(tiktokTitle).toBeVisible();
    await expect(tiktokDesc).toBeVisible();

    // 5. Fill in data
    await youtubeTitle.fill('YouTube Specific Title');
    await youtubeDesc.fill('YouTube Specific Description');
    await tiktokTitle.fill('TikTok Specific Title');
    await tiktokDesc.fill('TikTok Specific Description');

    // 6. Test Clear (✕)
    const youtubeTitleClear = page.locator('div:has(> input[name="title_YouTube"]) > button').filter({ hasText: '✕' });
    await youtubeTitleClear.click();
    await expect(youtubeTitle).toHaveValue('');

    // 7. Test Undo
    const youtubeTitleUndo = page.getByRole('button', { name: /Undo Clear/i }).first();
    await youtubeTitleUndo.click();
    await expect(youtubeTitle).toHaveValue('YouTube Specific Title');

    // 8. Verify Capture (TikTok remains unchanged)
    await expect(tiktokTitle).toHaveValue('TikTok Specific Title');
  });

  test('should verify Activity Hub title promotion and Multi-Title badge', async ({ page }) => {
    // 1. Ensure AI Tier is "Manual"
    await page.getByRole('button', { name: 'Manual', exact: true }).click();

    // 2. Select YouTube
    const youtubeButton = page.getByRole('button', { name: /YouTube:/i });
    if (await youtubeButton.getAttribute('aria-pressed') !== 'true') {
      await youtubeButton.click();
    }
    
    // 3. Set platform specific title, keep global empty
    await page.getByLabel('Separate titles/descriptions per platform').check();
    await page.locator('input[name="title_YouTube"]').fill('Promoted YouTube Title');
    
    // 4. Select a file
    await page.locator('input[type="file"]').setInputFiles({
      name: 'test-video.mp4',
      mimeType: 'video/mp4',
      buffer: Buffer.from('fake-video-content'),
    });

    // 5. Submit
    await page.getByRole('button', { name: /Upload Now|Post Now/i }).click();

    // 6. Wait for navigation to /activity
    await page.waitForURL('**/activity', { timeout: 20000 });

    // 7. Verify first activity card title
    const firstCardTitle = page.locator('h3[class*="postTitle"]').first();
    await expect(firstCardTitle).toContainText('Promoted YouTube Title');

    // 8. Go back and test Multi-Title badge
    await page.goto('/');
    await page.getByRole('button', { name: 'Manual', exact: true }).click();
    await page.getByRole('button', { name: /YouTube:/i }).click();
    await page.getByRole('button', { name: /TikTok:/i }).click();
    await page.getByLabel('Separate titles/descriptions per platform').check();
    
    await page.locator('input[name="title_YouTube"]').fill('Title A');
    await page.locator('input[name="title_TikTok"]').fill('Title B');
    
    // Re-upload and submit
    await page.locator('input[type="file"]').setInputFiles({
      name: 'test-video-2.mp4',
      mimeType: 'video/mp4',
      buffer: Buffer.from('fake-video-content-2'),
    });
    
    await page.getByRole('button', { name: /Upload Now|Post Now/i }).click();
    await page.waitForURL('**/activity', { timeout: 20000 });

    // 9. Verify Multi-Title badge
    const multiTitleBadge = page.getByText('Multi-Title').first();
    await expect(multiTitleBadge).toBeVisible();
    
    // 10. Verify tooltip
    const youtubePill = page.locator('[class*="platformPill"]').filter({ hasText: 'YouTube' }).first();
    await expect(youtubePill).toHaveAttribute('title', /Status:/);
  });
});
