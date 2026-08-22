import { test, expect } from './base-test';
import { prisma } from '@/lib/core/prisma';

test.describe('Ticket #699: GenAI Terms Tracking', () => {
  test.use({ authRole: 'tester' });
  
  test.beforeEach(({ page }) => { page.on("console", msg => console.log("BROWSER LOG:", msg.text())); });

  test.beforeEach(async ({ page, workerEmail, baseURL }) => {
    // Inject the worker email into the e2e-bypass cookie so auth() can fetch the correct DB user
    await page.context().addCookies([{ name: 'e2e-bypass', value: workerEmail, url: baseURL || 'http://localhost:3000' }]);
    
    // Ensure the test user has aiProcessingConsent set to false before the test
    // and wipe out the tracking fields
    const user = await prisma.user.findFirst({ where: { email: workerEmail } });
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          aiProcessingConsent: false,
          genAITermsAcceptedAt: null,
          genAITermsVersion: null
        }
      });
    }
    await page.goto('/');
  });

  test('Consenting to AI Terms updates database tracking fields with timestamp and version', async ({ page, workerEmail }) => {
    // 1. Upload a video
    const fileInput = page.locator('input#file-upload');
    await fileInput.setInputFiles({
      name: 'real-upload.mp4',
      mimeType: 'video/mp4',
      buffer: Buffer.from('mock video content')
    });

    // 2. Select AI Tier (Generate)
    const generateTierBtn = page.getByRole('button', { name: /Generate/i });
    if (await generateTierBtn.isVisible()) {
      await generateTierBtn.click();
    }

    // 3. Check the consent checkbox
    const consentLabel = page.locator('label[for="ai-consent"]');
    await consentLabel.click();
    
    // 3.5 Fill out required title field so HTML5 validation passes
    const titleInput = page.getByPlaceholder(/Describe your video concept|Catchy title/i);
    if (await titleInput.isVisible()) {
      await titleInput.fill('My Awesome Test Video');
    }

    // 4. Submit the form
    const submitBtn = page.getByRole('button', { name: /Review AI Strategy|Post Video/i });
    await expect(submitBtn).toBeEnabled();
    await page.evaluate(() => console.log("CLICKING SUBMIT!")); await submitBtn.click(); await page.evaluate(() => console.log("CLICKED SUBMIT!"));

    // 5. Wait for the upload/backend action to complete and verify DB
    await expect(async () => {
      const updatedUser = await prisma.user.findFirst({ where: { email: workerEmail } });
      expect(updatedUser?.aiProcessingConsent).toBe(true);
      expect(updatedUser?.genAITermsAcceptedAt).not.toBeNull();
      expect(updatedUser?.genAITermsVersion).toBe('1.0');
    }).toPass({ timeout: 15000 });
  });
});
