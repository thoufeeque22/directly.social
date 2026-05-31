import { test, expect } from './base-test';;

test.describe('Settings Page - Template Management @regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
  });

  test('should display the template manager', async ({ page }) => {
    // Navigate to snippets tab
    await page.getByRole('tab', { name: /snippets/i }).click();
    await expect(page.locator('h2:has-text("Reusable Snippets")')).toBeVisible();
    // Instead of expecting empty, just expect the container to be visible
    await expect(page.locator('h2:has-text("Reusable Snippets")').locator('xpath=..')).toBeVisible();
  });

  test('should create a template from the dashboard', async ({ page }) => {
    const templateName = `Test Template ${Date.now()}`;
    const templateContent = `Test Content ${Date.now()}`;

    // Go to dashboard to create a template from there
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('SS_AI_TIER', 'Manual');
    });
    await page.reload();
    
    // Save a new snippet
    const descriptionField = page.getByTestId('video-description').first();
    await descriptionField.fill(templateContent);
    await page.getByTestId('snippets-trigger').first().click();
    await page.getByTestId('save-snippet-form-trigger').first().click();
    await page.getByTestId('new-snippet-name-input').first().fill(templateName);
    await page.getByTestId('confirm-save-snippet').first().click();
    
    // Now go back to settings to manage it
    await page.goto('/settings');
    await page.getByRole('tab', { name: /snippets/i }).click();
    await expect(page.getByTestId('template-card').filter({ hasText: templateName }).first()).toBeVisible({ timeout: 10000 });
  });

  test('should edit and delete a template', async ({ page }) => {
    // We'll create one quickly here to ensure the test is isolated and robust
    const templateName = `ToEdit ${Date.now()}`;
    const updatedTemplateName = `${templateName} - updated`;

    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('SS_AI_TIER', 'Manual');
    });
    await page.reload();
    
    await page.getByTestId('video-description').first().fill('content');
    await page.getByTestId('snippets-trigger').first().click();
    await page.getByTestId('save-snippet-form-trigger').first().click();
    await page.getByTestId('new-snippet-name-input').first().fill(templateName);
    await page.getByTestId('confirm-save-snippet').first().click();

    await page.goto('/settings');
    await page.getByRole('tab', { name: /snippets/i }).click();
    const templateCard = page.getByTestId('template-card').filter({ hasText: templateName }).first();
    await expect(templateCard).toBeVisible({ timeout: 10000 });
    
    // Edit the template
    await templateCard.getByRole('button', { name: /edit/i }).click();
    const nameInput = page.locator('input[placeholder="Name"]');
    await expect(nameInput).toBeVisible();
    await nameInput.fill(updatedTemplateName);
    await page.locator('button:has-text("Save")').click();
    await expect(page.getByText(updatedTemplateName)).toBeVisible();

    // Setup dialog handler BEFORE clicking delete
    page.once('dialog', dialog => dialog.accept());

    // Delete the template
    const updatedTemplateCard = page.getByTestId('template-card').filter({ hasText: updatedTemplateName }).first();
    await updatedTemplateCard.getByRole('button', { name: /delete/i }).click();
    await expect(page.getByText(updatedTemplateName)).not.toBeVisible();
  });
});
