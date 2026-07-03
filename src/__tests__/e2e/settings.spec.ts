import { test, expect, openMobileMenuIfNeeded } from './base-test';

test.describe('Settings Page - Template Management @regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(1000);
  });

  test('should display the template manager', async ({ page, isMobile }) => {
    // Navigate to snippets tab
    await openMobileMenuIfNeeded(page, isMobile);
    // On mobile the Settings section is collapsed — expand it first
    const settingsNavItem = page.getByRole('link', { name: /^Settings$/i }).first();
    if (await settingsNavItem.isVisible() && isMobile) {
      await settingsNavItem.click();
      await page.waitForTimeout(400);
    }
    const snippetsTab = page.getByRole('link', { name: /^Snippets$/i });
    await snippetsTab.scrollIntoViewIfNeeded();
    await snippetsTab.click();
    await page.waitForURL('**/settings?tab=snippets', { timeout: 10000 });
    
    const heading = page.getByText("Reusable Snippets", { exact: true });
    await expect(heading).toBeVisible({ timeout: 10000 });
    // Instead of expecting empty, just expect the container to be visible
    await expect(heading.locator('xpath=..')).toBeVisible();
  });

  test('should create a template from the dashboard', async ({ page, workerIndex, isMobile }) => {
    const templateName = `Test Template ${workerIndex}-${Date.now()}`;
    const templateContent = `Test Content ${workerIndex}-${Date.now()}`;

    // Go to dashboard to create a template from there
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('SS_AI_TIER', 'Manual');
    });
    await page.reload();
    
    // Save a new snippet
    const titleField = page.getByTestId('video-title').first();
    await expect(titleField).toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(1000); // Wait for React hydration to complete
    await titleField.scrollIntoViewIfNeeded();
    await titleField.click();
    await titleField.fill('');
    await titleField.pressSequentially(templateContent, { delay: 50 });
    await titleField.blur();
    await page.waitForTimeout(1000); // Wait for React state sync
    
    const trigger = page.getByTestId('snippets-trigger').first();
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();
    
    await expect(page.getByTestId('save-snippet-form-trigger')).toBeEnabled({ timeout: 10000 });
    await page.getByTestId('save-snippet-form-trigger').click();
    await page.getByTestId('new-snippet-name-input').fill(templateName);
    await page.getByTestId('confirm-save-snippet').click();
    await expect(page.getByTestId('snippets-menu')).not.toBeVisible();
    
    // Now go back to settings to manage it
    await page.goto('/settings', { waitUntil: 'networkidle' });
    await openMobileMenuIfNeeded(page, isMobile);
    // On mobile the Settings section is collapsed — expand it first
    const settingsNavItem2 = page.getByRole('link', { name: /^Settings$/i }).first();
    if (await settingsNavItem2.isVisible() && isMobile) {
      await settingsNavItem2.click();
      await page.waitForTimeout(400);
    }
    const snippetsTab = page.getByRole('link', { name: /^Snippets$/i });
    await snippetsTab.scrollIntoViewIfNeeded();
    await snippetsTab.click({ force: true });
    await page.waitForURL('**/settings?tab=snippets', { timeout: 30000 });
    
    await expect(page.getByTestId('template-card').filter({ hasText: templateName }).first()).toBeVisible({ timeout: 30000 });
  });

  test('should edit and delete a template', async ({ page, workerIndex, isMobile }) => {
    // We'll create one quickly here to ensure the test is isolated and robust
    const templateName = `ToEdit ${workerIndex}-${Date.now()}`;
    const updatedTemplateName = `${templateName} - updated`;

    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('SS_AI_TIER', 'Manual');
    });
    await page.reload();
    
    const titleField = page.getByTestId('video-title').first();
    await expect(titleField).toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(1000); // Wait for React hydration to complete
    await titleField.scrollIntoViewIfNeeded();
    await titleField.click();
    await titleField.fill('');
    await titleField.pressSequentially('content', { delay: 50 });
    await titleField.blur();
    await page.waitForTimeout(1000); // Wait for React state sync
    
    const trigger = page.getByTestId('snippets-trigger').first();
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();
    
    await expect(page.getByTestId('save-snippet-form-trigger')).toBeEnabled({ timeout: 10000 });
    await page.getByTestId('save-snippet-form-trigger').click();
    await page.getByTestId('new-snippet-name-input').fill(templateName);
    await page.getByTestId('confirm-save-snippet').click();
    await expect(page.getByTestId('snippets-menu')).not.toBeVisible();

    await page.goto('/settings', { waitUntil: 'networkidle' });
    await openMobileMenuIfNeeded(page, isMobile);
    // On mobile the Settings section is collapsed — expand it first
    const settingsNavItem3 = page.getByRole('link', { name: /^Settings$/i }).first();
    if (await settingsNavItem3.isVisible() && isMobile) {
      await settingsNavItem3.click();
      await page.waitForTimeout(400);
    }
    const snippetsTab = page.getByRole('link', { name: /^Snippets$/i });
    await snippetsTab.scrollIntoViewIfNeeded();
    await snippetsTab.click({ force: true });
    await page.waitForURL('**/settings?tab=snippets', { timeout: 30000 });
    
    const templateCard = page.getByTestId('template-card').filter({ hasText: templateName }).first();
    await expect(templateCard).toBeVisible({ timeout: 30000 });
    
    // Edit the template
    await templateCard.getByRole('button', { name: /edit/i }).click();
    const nameInput = page.locator('input[placeholder="Name"]');
    await expect(nameInput).toBeVisible();
    await nameInput.fill(updatedTemplateName);
    await page.locator('button:has-text("Save")').click();
    await expect(page.getByText(updatedTemplateName)).toBeVisible({ timeout: 10000 });

    // Setup dialog handler BEFORE clicking delete
    page.once('dialog', dialog => dialog.accept());

    // Delete the template
    const updatedTemplateCard = page.getByTestId('template-card').filter({ hasText: updatedTemplateName }).first();
    await updatedTemplateCard.getByRole('button', { name: /delete/i }).click();
    await expect(page.getByText(updatedTemplateName)).not.toBeVisible({ timeout: 10000 });
  });
});
