import { test, expect } from './base-test';;

test.describe.serial('Metadata Templates (Snippets)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should open and close the snippets menu correctly', async ({ page }) => {
    const trigger = page.getByTestId('snippets-trigger').first();
    const menu = page.getByTestId('snippets-menu');

    // Open
    await trigger.click();
    await expect(menu).toBeVisible();

    // Close via X button
    await menu.locator('button:has(svg)').first().click(); // The X button
    await expect(menu).not.toBeVisible();

    // Open again
    await trigger.click();
    await expect(menu).toBeVisible();

    // Close via clicking outside (clicking the backdrop)
    await page.mouse.click(0, 0);
    await expect(menu).not.toBeVisible();
  });

  test('should save a new snippet and close the menu on success', async ({ page }) => {
    page.on('console', msg => console.log(`[Browser Console]: ${msg.text()}`));
    const titleField = page.getByTestId('video-title').first();
    const testContent = `E2E Test Snippet ${Date.now()}`;
    const snippetName = `Name ${Date.now()}`;

    // Type content to save
    await titleField.click();
    await titleField.fill('');
    await titleField.pressSequentially(testContent, { delay: 50 });
    await titleField.blur();
    await page.waitForTimeout(1000); // Wait for React state sync

    // Open menu
    const trigger = page.getByTestId('snippets-trigger').first();
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();
    
    // Open save form - wait for it to be enabled (state sync)
    const saveTrigger = page.getByTestId('save-snippet-form-trigger');
    await expect(saveTrigger).toBeEnabled({ timeout: 10000 });
    await saveTrigger.click();
    
    // Fill name
    await page.getByTestId('new-snippet-name-input').fill(snippetName);
    
    // Save
    await page.getByTestId('confirm-save-snippet').click();

    // Verification: Menu should be CLOSED
    await expect(page.getByTestId('snippets-menu')).not.toBeVisible();

    // Verification: Re-open and check if it exists in list
    await trigger.click();
    await expect(page.getByText(snippetName)).toBeVisible();
  });

  test('should append snippet content to title and close menu', async ({ page }) => {
    const titleField = page.getByTestId('video-title').first();
    await titleField.click();
    await titleField.fill('');
    await titleField.pressSequentially('Initial text.', { delay: 50 });
    await titleField.blur();
    await page.waitForTimeout(500);

    // Open menu
    const trigger = page.getByTestId('snippets-trigger').first();
    await trigger.click();
    
    // Select first available snippet (assuming one exists from previous test or seed)
    const firstSnippet = page.locator('[data-testid^="snippet-item-"]').first();
    // Wait for templates to load
    await expect(firstSnippet).toBeVisible();
    
    const snippetText = await firstSnippet.locator('span').last().innerText();
    
    await firstSnippet.click();

    // Verification: Menu should be CLOSED
    await expect(page.getByTestId('snippets-menu')).not.toBeVisible();

    // Verification: Content should be appended
    const updatedValue = await titleField.inputValue();
    expect(updatedValue).toContain('Initial text.');
    expect(updatedValue).toContain(snippetText);
  });

  test('should work independently for platform-specific descriptions', async ({ page }) => {
    // Enable platform specific toggle if available
    const toggle = page.getByTestId('platform-specific-toggle-label');
    if (await toggle.isVisible()) {
      await toggle.click();
    }

    // This part assumes at least one platform is selected and visible
    const platformHeader = page.locator('span:has-text("Details")').first();
    if (await platformHeader.isVisible()) {
      const platformContainer = platformHeader.locator('xpath=../..');
      const platformTrigger = platformContainer.getByTestId('snippets-trigger').first();
      const platformInput = platformContainer.getByTestId('video-description-youtube');

      await platformTrigger.click();
      const firstSnippet = page.locator('[data-testid^="snippet-item-"]').first();
      await expect(firstSnippet).toBeVisible();
      await firstSnippet.click();

      // Check input updated
      await expect(platformInput).not.toHaveValue('');
    }
  });

    // This test replaces the previous generic one. Since we already test Title above, we test Description here.
  test('should create and append description snippet with newline separator', async ({ page }) => {
    const descField = page.getByTestId('video-description');
    await descField.click();
    await descField.fill('My Desc');
    await descField.blur();
    
    const trigger = page.getByTestId('snippets-trigger').nth(1); // Second trigger is Description
    await page.waitForTimeout(500);

    await trigger.click();
    const saveTrigger = page.getByTestId('save-snippet-form-trigger');
    await expect(saveTrigger).toBeEnabled({ timeout: 10000 });
    await saveTrigger.click();
    await page.getByTestId('new-snippet-name-input').fill('Desc Snippet');
    await page.getByTestId('confirm-save-snippet').click();
    await expect(page.getByTestId('snippets-menu')).not.toBeVisible();

    await trigger.click();
    await page.getByText('Desc Snippet').first().click();

    const updatedValue = await descField.inputValue();
    expect(updatedValue).toBe('My Desc\nMy Desc');
  });

  test('should create and append first comment snippet with newline separator', async ({ page }) => {
    const commentField = page.locator('textarea[name="firstComment"]');
    await commentField.click();
    await commentField.fill('My Comment');
    await commentField.blur();
    
    const trigger = page.getByTestId('snippets-trigger').nth(3); // 4th trigger is First Comment (0=Title, 1=Desc, 2=Hashtags, 3=First Comment)
    await page.waitForTimeout(500);

    await trigger.click();
    const saveTrigger = page.getByTestId('save-snippet-form-trigger');
    await expect(saveTrigger).toBeEnabled({ timeout: 10000 });
    await saveTrigger.click();
    await page.getByTestId('new-snippet-name-input').fill('Comment Snippet');
    await page.getByTestId('confirm-save-snippet').click();
    await expect(page.getByTestId('snippets-menu')).not.toBeVisible();
    await page.waitForTimeout(500);

    // Re-open and select
    await trigger.click();
    await page.getByTestId('snippets-menu').getByText('Comment Snippet').first().click();

    // Verify it appended with newline
    const updatedValue = await commentField.inputValue();
    expect(updatedValue).toBe('My Comment\nMy Comment');
  });
});
