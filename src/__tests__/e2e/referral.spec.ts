import { test, expect } from '@playwright/test';

// Use process.env.TEST_USER_PASSWORD for authentication
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || 'secret';

test.describe('Referral Bonus Program - End to End Workflows & Consumption', () => {

  test('Legal Compliance: Terms explicitly state Referral Program rules', async ({ page }) => {
    await page.goto('/terms');
    const termsContent = page.locator('body');
    await expect(termsContent).toContainText('Referral Program');
    await expect(termsContent).toContainText('discretionary');
    await expect(termsContent).toContainText('successful non-refunded payments');
    await expect(termsContent).toContainText('fraud or chargebacks');
    await expect(termsContent).toContainText('exactly 5 active paid referrals');
  });

  test('Tier 1 (Free) - Reward Consumption: Referral quota used after base limit exhausted', async ({ browser, request }) => {
    const contextA = await browser.newContext();
    const pageA = await contextA.newPage();
    
    // User A logs in
    await pageA.goto('/login');
    await pageA.fill('input[name="email"]', 'usera_consume@example.com');
    await pageA.fill('input[name="password"]', TEST_USER_PASSWORD);
    await pageA.click('button[type="submit"]');
    
    // Copy referral link
    await pageA.click('button:has-text("🚀 Get Cloud Pro for Free")');
    const referralUrl = await pageA.locator('input.referral-link').inputValue();

    // User B signs up via the link
    const contextB = await browser.newContext();
    const pageB = await contextB.newPage();
    await pageB.goto(referralUrl);
    await pageB.fill('input[name="email"]', 'userb_consume@example.com');
    await pageB.fill('input[name="password"]', TEST_USER_PASSWORD);
    await pageB.click('button[type="submit"]');

    // User A exhausts base limit (e.g., 10 posts) via API
    for(let i=0; i<10; i++) {
       await request.post('/api/posts', { data: { content: `Base post ${i}` }});
    }

    // Now User A attempts the 11th post via UI. Normally this would fail, but they have +5 from referral.
    await pageA.goto('/dashboard');
    await pageA.fill('textarea.post-input', 'My 11th extra bonus post!');
    await pageA.click('button:has-text("Post")');
    
    // Assert success
    await expect(pageA.locator('.post-list')).toContainText('My 11th extra bonus post!');
    
    // Verify quota dropped
    await pageA.click('button:has-text("🚀 Get Cloud Pro for Free")');
    const quotaDisplay = pageA.locator('.extra-posts-quota-remaining'); 
    await expect(quotaDisplay).toContainText('4');

    await contextA.close();
    await contextB.close();
  });

  test('Tier 2 (Paid) - Reward Consumption: Balance Transaction actively reduces next Stripe invoice', async ({ request }) => {
    const userEmail = 'squad_tier2@example.com';
    const referrerEmail = 'referrer_tier2@example.com';

    // Simulate User B upgrading via Webhook
    const webhookPayload = {
       type: 'invoice.payment_succeeded',
       data: { object: { billing_reason: 'subscription_create', customer_email: userEmail, total: 1000 } }
    };
    await request.post('/api/webhooks/stripe', { data: webhookPayload });

    // Assert that User A's Stripe Customer object now has a negative customer_balance (Stripe credit)
    const checkBalance = await request.get(`/api/testing/stripe-customer?email=${referrerEmail}`);
    const balanceData = await checkBalance.json();
    
    // E.g., a $10 invoice gives a -$1000 cents balance transaction to the referrer
    expect(balanceData.balance).toBeLessThan(0);
    
    // Simulate generation of User A's next upcoming invoice via Stripe
    const invoicePreview = await request.get(`/api/testing/stripe-invoice-preview?email=${referrerEmail}`);
    const invoiceData = await invoicePreview.json();
    
    // The upcoming invoice total should reflect the applied balance subtraction
    expect(invoiceData.amount_due).toBeLessThan(invoiceData.subtotal);
  });

  test('Grand Prize (Option B) - Reward Consumption: Next invoice is $0 and Pro features remain active', async ({ page, request }) => {
    const referrerEmail = 'grandprize@example.com';

    // Log User A in
    await page.goto('/login');
    await page.fill('input[name="email"]', referrerEmail);
    await page.fill('input[name="password"]', TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');

    // Simulate 5 active referrals
    for (let i = 1; i <= 5; i++) {
      await request.post('/api/webhooks/stripe', { 
         data: { 
           type: 'invoice.payment_succeeded', 
           data: { object: { billing_reason: 'subscription_create', customer_email: `grandprize_squad${i}@example.com`, total: 1000 } }
         } 
      });
    }

    // Verify UI reflects 100% discount
    await page.click('button:has-text("🚀 Get Cloud Pro for Free")');
    await expect(page.locator('.subscription-status')).toContainText('100% Free Cloud Pro');
    
    // Simulate generation of User A's next upcoming invoice
    const invoicePreview = await request.get(`/api/testing/stripe-invoice-preview?email=${referrerEmail}`);
    const invoiceData = await invoicePreview.json();
    
    // Invoice must be exactly 0 due to 100% coupon
    expect(invoiceData.amount_due).toBe(0);

    // Verify User A can successfully use a Cloud Pro exclusive feature
    await page.goto('/pro-dashboard');
    await expect(page.locator('.pro-locked-overlay')).not.toBeVisible();
    await page.click('button:has-text("Generate Pro Report")');
    await expect(page.locator('.report-success-banner')).toBeVisible();
  });

  test('Self-Referral Prevention - Cannot use own referral link', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'selfrefer@example.com');
    await page.fill('input[name="password"]', TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');

    await page.click('button:has-text("🚀 Get Cloud Pro for Free")');
    const referralUrl = await page.locator('input.referral-link').inputValue();

    // Log out and attempt sign-up
    await page.click('button:has-text("Logout")');

    await page.goto(referralUrl);
    await page.fill('input[name="email"]', 'selfrefer@example.com');
    await page.fill('input[name="password"]', TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/dashboard');
    await page.click('button:has-text("🚀 Get Cloud Pro for Free")');
    const historyTable = page.locator('.referral-history-table tbody');
    await expect(historyTable).not.toContainText('s***@example.com');
  });
});
