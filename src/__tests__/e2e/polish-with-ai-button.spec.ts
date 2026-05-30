import { test, expect } from '@playwright/test';

test.describe('Manual Mode: Polish with AI Button', () => {
  // Use existing auth state for tests
  test.use({ storageState: '.auth/user.json' });

  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/');
    
    // Force AI Tier to 'Manual'
    await page.evaluate(() => {
      localStorage.setItem('SS_AI_TIER', 'Manual');
    });
    await page.reload();

    // Wait for the form to be visible
    await expect(page.locator('h2:has-text("Upload & Automate")').first()).toBeVisible();
  });

  test('Visibility and Interaction of Polish with AI button', async ({ page }) => {
    const polishButton = page.getByRole('button', { name: /Polish with AI/i });
    const postVideoButton = page.getByRole('button', { name: /Post Video/i });

    // Ensure both buttons are visible in Manual mode
    await expect(polishButton).toBeVisible();
    await expect(postVideoButton).toBeVisible();

    // Capture visual audit screenshot
    await page.screenshot({ path: 'verification/514-enrich-button.png', fullPage: true });

    // Click the Polish with AI button
    await polishButton.click();

    // Verify UI state changes indicating tier change to "Enrich"
    // The submit button text should change from "Post Video" to "Review AI Strategy"
    const reviewAiButton = page.getByRole('button', { name: /Review AI Strategy/i });
    await expect(reviewAiButton).toBeVisible();

    // The AITierSelector "Enrich" should be active
    const enrichTierButton = page.getByRole('button', { name: 'Enrich' });
    await expect(enrichTierButton).toBeVisible();
    await expect(enrichTierButton).toHaveCSS('font-weight', '700');

    // The "Polish with AI" button should no longer be visible since it's only for Manual mode
    await expect(polishButton).not.toBeVisible();
  });

  test('Localization & Console Audit', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore known harmless errors
        if (!text.includes('Sentry') && !text.includes('Extension') && !text.includes('429')) {
          errors.push(text);
        }
      }
    });

    page.on('pageerror', err => {
      errors.push(err.message);
    });

    const polishButton = page.getByRole('button', { name: /Polish with AI/i });
    await expect(polishButton).toBeVisible();

    // Ensure no major errors in console during page load
    expect(errors).toHaveLength(0);
  });
});
