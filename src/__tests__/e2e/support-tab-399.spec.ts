import { test, expect } from './base-test';

test.describe('Support Tab (Ticket 399)', () => {
  test('should verify Support link in sidebar, navigation, and content', async ({ page, isMobile }) => {
    // Go to the dashboard
    await page.goto('/');

    // If on mobile, the sidebar might be hidden, so we need to open it
    if (isMobile) {
      const menuButton = page.getByRole('button', { name: '☰' });
      if (await menuButton.isVisible()) {
        await menuButton.click();
      }
    }

    // Verify the Sidebar has a "Support" link
    const supportLink = page.getByRole('link', { name: 'Support' });
    await expect(supportLink).toBeVisible();

    // Click the Support link (use JS click on mobile to bypass strict viewport checks)
    await supportLink.evaluate((el) => (el as HTMLElement).click());

    // Verify it navigates to /settings?tab=support
    await page.waitForURL('**/settings?tab=support');
    await expect(page).toHaveURL(/.*\/settings\?tab=support/);

    // Verify the Support tab content
    await expect(page.getByRole('heading', { name: 'Support & Help' })).toBeVisible();
    await expect(page.getByText('Need assistance or have questions? We\'re here to help!')).toBeVisible();

    // Verify the "Email Support" button
    const emailSupportBtn = page.getByRole('link', { name: 'Email Support' });
    await expect(emailSupportBtn).toBeVisible();
    await expect(emailSupportBtn).toHaveAttribute('href', 'mailto:support.directly.social@gmail.com');

    // Verify Frequently Asked Questions are present
    await expect(page.getByRole('heading', { name: 'Frequently Asked Questions' })).toBeVisible();
    await expect(page.getByText('How do I connect my social media accounts?')).toBeVisible();
    await expect(page.getByText('Can I use my own API keys for AI generation?')).toBeVisible();
  });
});
