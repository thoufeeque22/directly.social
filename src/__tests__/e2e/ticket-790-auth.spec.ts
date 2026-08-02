import { test, expect } from '@playwright/test';

test.describe('Streamlined Authentication: Supabase Auth', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display only Google and Email login options', async ({ page }) => {
    // Expect Google button to be visible
    const googleBtn = page.getByRole('button', { name: /continue with google/i });
    await expect(googleBtn).toBeVisible();

    // Expect Email input field to be visible
    const emailInput = page.getByPlaceholder(/email/i);
    await expect(emailInput).toBeVisible();
    
    const emailBtn = page.getByRole('button', { name: /continue with email/i });
    await expect(emailBtn).toBeVisible();

    // Expect Facebook and TikTok buttons to NOT be visible
    await expect(page.getByRole('button', { name: /continue with facebook/i })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /continue with tiktok/i })).toHaveCount(0);
  });

  test('should not have next-auth session endpoints', async ({ request }) => {
    // next-auth endpoints should return 404 once ripped out
    const response = await request.get('/api/auth/session');
    expect(response.status()).toBe(404);
  });
});
