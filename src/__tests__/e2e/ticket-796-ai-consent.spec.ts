import { test, expect } from './base-test';
import { prisma } from '@/lib/core/prisma';

test.describe('Ticket #796: AI Processing Consent', () => {
  test.use({ authRole: 'tester' });
  
  test.beforeEach(async ({ page, workerEmail }) => {
    // Ensure the test user has aiProcessingConsent set to false before the test
    const user = await prisma.user.findFirst({ where: { email: workerEmail } });
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { aiProcessingConsent: false }
      });
    }
    await page.goto('/');
  });

  test('Upload button is disabled until AI consent is checked', async ({ page }) => {
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

    // 3. Verify consent checkbox is visible
    const consentCheckbox = page.locator('input[name="aiConsent"]');
    await expect(consentCheckbox).toBeVisible();
    await expect(consentCheckbox).not.toBeChecked();

    // 4. Verify submit button is disabled
    const submitBtn = page.getByRole('button', { name: /Review AI Strategy|Post Video/i });
    await expect(submitBtn).toBeDisabled();

    // 5. Check the consent checkbox
    const consentLabel = page.locator('label[for="ai-consent"]');
    await consentLabel.click();
    await expect(consentCheckbox).toBeChecked();

    // 6. Verify submit button is enabled
    await expect(submitBtn).toBeEnabled();
  });
});
