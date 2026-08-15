import { test, expect } from './base-test';

test.describe('Ticket #756: Demo Video Onboarding Flow', () => {
  test.use({ authRole: 'tester' });
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Happy Path: User can try a demo video and exit demo mode', async ({ page }) => {
    const tryDemoBtn = page.getByRole('button', { name: /Try a Demo Video/i });
    await expect(tryDemoBtn).toBeVisible();
    await tryDemoBtn.click();

    const uploadYourVideoBtn = page.getByRole('button', { name: /Upload Your Video/i });
    await expect(uploadYourVideoBtn).toBeVisible();
    
    const videoPreview = page.locator('video');
    await expect(videoPreview).toBeVisible();

    const exportBtn = page.getByRole('button', { name: /Export/i });
    await expect(exportBtn).toBeVisible();
    await expect(exportBtn).toBeEnabled();

    await uploadYourVideoBtn.click();
    await expect(tryDemoBtn).toBeVisible();
    await expect(uploadYourVideoBtn).not.toBeVisible();
  });

  test('Negative Scenario: Real upload does not trigger demo mode', async ({ page }) => {
    const fileInput = page.locator('input#file-upload');
    await fileInput.setInputFiles({
      name: 'real-upload.mp4',
      mimeType: 'video/mp4',
      buffer: Buffer.from('mock video content')
    });

    const uploadYourVideoBtn = page.getByRole('button', { name: /Upload Your Video/i });
    await expect(uploadYourVideoBtn).not.toBeVisible();
  });
});
