import { test, expect } from '@playwright/test';

test.describe('Staging Integrations Validation', () => {
  // We explicitly skip this test in production environments to avoid accidental failures or leaks.
  test.skip(process.env.NEXT_PUBLIC_APP_ENV === 'production', 'This test is strictly for non-production environments.');

  test('Validates that external staging integrations are configured correctly', async ({ request }) => {
    // We make a direct API request to the backend diagnostic endpoint
    const response = await request.get('/api/testing/env-validation');
    
    // The endpoint should successfully respond (403 means safety switch blocked it, 500 means crash)
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();

    // 1. Assert Environment is Staging
    expect(data.environment).toBe('staging');

    // 2. Assert Stripe Test Mode
    expect(data.stripe.connected).toBe(true);
    expect(data.stripe.mode).toBe('test');

    // 3. Assert Database is Live
    expect(data.database.connected).toBe(true);

    // 4. Assert Resend is Present
    expect(data.resend.connected).toBe(true);
  });
});
