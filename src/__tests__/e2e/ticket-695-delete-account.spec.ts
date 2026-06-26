import { test, expect } from './base-test';

test.describe('Ticket 695: Delete Account', () => {
  test('should navigate to Account tab, open Delete Account modal, and perform deletion', async ({ page }) => {

    // 2. Navigate to Settings page with Account tab selected
    await page.goto('/settings?tab=account');
    await expect(page).toHaveURL(/\/settings\?tab=account/);

    // 4. Verify Danger Zone exists
    await expect(page.locator('text=Danger Zone')).toBeVisible();

    // 5. Open Delete Account Modal
    await page.click('button:has-text("Delete Account")');

    // 6. Verify modal contents and warning text
    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("If you delete your account, your data can't be recovered, but you can create your account using the same credentials again.");

    // 7. Try to click Delete without typing DELETE (should be disabled)
    const deleteButton = dialog.locator('button', { hasText: /^Delete Account$/ });
    await expect(deleteButton).toBeDisabled();

    // 8. Type DELETE to enable the button
    await page.fill('input[placeholder="DELETE"]', 'DELETE');
    await expect(deleteButton).toBeEnabled();

    // 9. Confirm deletion
    // Intercept the API call to avoid actually deleting the test user
    await page.route('/api/settings/account', async route => {
      expect(route.request().method()).toBe('DELETE');
      await route.fulfill({ status: 200, json: { success: true } });
    });

    await deleteButton.click();

    // 10. Verify redirect to login page after deletion
    await expect(page).toHaveURL(/\/(login)?$/);
  });
});
