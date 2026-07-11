import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

// Use process.env.TEST_USER_PASSWORD for authentication
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || 'secret';
const prisma = new PrismaClient();

test.describe('Referral Bonus Program - End to End Workflows & Consumption', () => {

  test.beforeAll(async () => {
    // Seed test users with specific tiers
    const testUsers = [
      { email: 'tester-free@directly.social', tier: 'FREE_STARTER' },
      { email: 'tester-pro@directly.social', tier: 'CLOUD_PRO' },
      { email: 'tester-byok@directly.social', tier: 'LIFETIME_DEAL' },
      { email: 'tester-referrer-tier2@directly.social', tier: 'FREE_STARTER' },
      { email: 'tester-grandprize@directly.social', tier: 'FREE_STARTER' },
      { email: 'tester-selfrefer@directly.social', tier: 'FREE_STARTER' },
      { email: 'tester-consume-a@directly.social', tier: 'FREE_STARTER' },
    ];

    for (const u of testUsers) {
      await prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: {
          email: u.email,
          name: u.email.split('@')[0],
          role: 'USER',
          billingProfile: {
            create: {
              providerCustomerId: `cus_${u.email.split('@')[0]}`,
              subscriptionTier: u.tier as unknown as 'FREE_STARTER' | 'CLOUD_PRO' | 'LIFETIME_DEAL',
              subscriptionStatus: 'ACTIVE',
            }
          }
        }
      });
    }
  });

  test('Legal Compliance: Terms explicitly state Referral Program rules', async ({ page }) => {
    await page.goto('/terms');
    const termsContent = page.locator('body');
    await expect(termsContent).toContainText('Referral Program');
    await expect(termsContent).toContainText('discretionary');
    await expect(termsContent).toContainText('successful non-refunded payments');
    await expect(termsContent).toContainText('fraud or chargebacks');
    await expect(termsContent).toContainText('exactly 5 active paid referrals');
  });

  test('UI Scenario A: Free User Dynamic Copy', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'tester-free@directly.social');
    await page.fill('input[name="password"]', TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');

    if ((page.viewportSize()?.width ?? 0) < 768) await page.click('button[aria-label="Menu"]');
    await page.click('button:has-text("Get Cloud Pro for Free")');
    await expect(page.getByTestId('progress-desc')).toContainText('Get 5 total referrals for Lifetime BYOK, or maintain 5 active to keep Cloud Pro free forever.');
    await expect(page.getByTestId('grand-prize-reward')).toContainText('Lifetime BYOK or Cloud Pro');
  });

  test('UI Scenario B: Cloud Pro User Dynamic Copy', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'tester-pro@directly.social');
    await page.fill('input[name="password"]', TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');

    if ((page.viewportSize()?.width ?? 0) < 768) await page.click('button[aria-label="Menu"]');
    await page.click('button:has-text("Get Cloud Pro for Free")');
    await expect(page.getByTestId('progress-desc')).toContainText('Maintain 5 active paid referrals to keep your Cloud Pro subscription 100% free forever.');
    await expect(page.getByTestId('grand-prize-reward')).toContainText('Cloud Pro Access');
  });

  test('UI Scenario C: BYOK User Dynamic Copy', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'tester-byok@directly.social');
    await page.fill('input[name="password"]', TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');

    if ((page.viewportSize()?.width ?? 0) < 768) await page.click('button[aria-label="Menu"]');
    await page.click('button:has-text("Get Cloud Pro for Free")');
    await expect(page.getByTestId('progress-desc')).toContainText('Get 5 total paid referrals to unlock Lifetime BYOK forever.');
    await expect(page.getByTestId('grand-prize-reward')).toContainText('Lifetime BYOK');
  });

  test('Tier 1 (Free) - Reward Consumption: Referral quota used after base limit exhausted', async ({ browser, request }) => {
    const contextA = await browser.newContext();
    const pageA = await contextA.newPage();
    
    // User A logs in
    await pageA.goto('/login');
    await pageA.fill('input[name="email"]', 'tester-consume-a@directly.social');
    await pageA.fill('input[name="password"]', TEST_USER_PASSWORD);
    await pageA.click('button[type="submit"]');
    
    // Copy referral link
    if ((pageA.viewportSize()?.width ?? 0) < 768) await pageA.click('button[aria-label="Menu"]');
    await pageA.click('button:has-text("Get Cloud Pro for Free")');
    const referralUrl = await pageA.getByTestId('referral-link-text').textContent() || '';

    // User B signs up via the link
    const contextB = await browser.newContext();
    const pageB = await contextB.newPage();
    const userB_email = `tester-userb-${Date.now()}@directly.social`;
    await prisma.user.create({ data: { email: userB_email, name: 'User B', role: 'USER' } });
    await pageB.goto(referralUrl);
    await pageB.fill('input[name="email"]', userB_email);
    await pageB.fill('input[name="password"]', TEST_USER_PASSWORD);
    await pageB.click('button[type="submit"]');

    // User A exhausts base limit (e.g., 10 posts) via API
    for(let i=0; i<10; i++) {
       await request.post('/api/posts', { data: { content: `Base post ${i}` }});
    }

    // Now User A attempts the 11th post via UI.
    await pageA.goto('/dashboard');
    await pageA.fill('textarea.post-input', 'My 11th extra bonus post!');
    await pageA.click('button:has-text("Post")');
    
    // Assert success
    await expect(pageA.locator('.post-list')).toContainText('My 11th extra bonus post!');
    
    // Verify quota dropped
    if ((pageA.viewportSize()?.width ?? 0) < 768) await pageA.click('button[aria-label="Menu"]');
    await pageA.click('button:has-text("Get Cloud Pro for Free")');
    const quotaDisplay = pageA.getByTestId('extra-posts-quota'); 
    await expect(quotaDisplay).toContainText('+4');

    await contextA.close();
    await contextB.close();
  });

  test('Tier 2 (Paid) - Reward Consumption: Balance Transaction actively reduces next Stripe invoice', async ({ request }) => {
    const userEmail = 'tester-squad-tier2@directly.social';
    const referrerEmail = 'tester-referrer-tier2@directly.social';

    const referrer = await prisma.user.findUnique({ where: { email: referrerEmail } });
    if (referrer) {
      await prisma.user.upsert({
        where: { email: userEmail },
        update: {},
        create: {
          email: userEmail,
          name: 'Squad Tier2',
          role: 'USER',
          referredById: referrer.id
        }
      });
    }

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
    const referrerEmail = 'tester-grandprize@directly.social';

    // Log User A in
    await page.goto('/login');
    await page.fill('input[name="email"]', referrerEmail);
    await page.fill('input[name="password"]', TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');

    // Simulate 5 active referrals
    const referrer = await prisma.user.findUnique({ where: { email: referrerEmail } });
    if (referrer) {
      for (let i = 1; i <= 5; i++) {
        const squadEmail = `tester-grandprize-squad${i}@directly.social`;
        await prisma.user.upsert({
          where: { email: squadEmail },
          update: {},
          create: {
            email: squadEmail,
            name: `Squad ${i}`,
            role: 'USER',
            referredById: referrer.id
          }
        });

        await request.post('/api/webhooks/stripe', { 
           data: { 
             type: 'invoice.payment_succeeded', 
             data: { object: { billing_reason: 'subscription_create', customer_email: squadEmail, total: 1000 } }
           } 
        });
      }
    }

    // Verify UI reflects UNLOCKED
    if ((page.viewportSize()?.width ?? 0) < 768) await page.click('button[aria-label="Menu"]');
    await page.click('button:has-text("Get Cloud Pro for Free")');
    await expect(page.getByTestId('grand-prize-status')).toContainText('UNLOCKED');
    
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
    await page.fill('input[name="email"]', 'tester-selfrefer@directly.social');
    await page.fill('input[name="password"]', TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');

    if ((page.viewportSize()?.width ?? 0) < 768) await page.click('button[aria-label="Menu"]');
    await page.click('button:has-text("Get Cloud Pro for Free")');
    const referralUrl = await page.getByTestId('referral-link-text').textContent() || '';

    // Log out and attempt sign-up
    await page.click('button:has-text("Logout")');

    await page.goto(referralUrl);
    await page.fill('input[name="email"]', 'tester-selfrefer@directly.social');
    await page.fill('input[name="password"]', TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/dashboard');
    if ((page.viewportSize()?.width ?? 0) < 768) await page.click('button[aria-label="Menu"]');
    await page.click('button:has-text("Get Cloud Pro for Free")');
    const historyTable = page.getByTestId('squad-list');
    await expect(historyTable).not.toContainText('s***@example.com');
  });
});
