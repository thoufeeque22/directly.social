# Referral Bonus Program

## Overview
The Referral Bonus Program is a dual-sided growth loop ("Give a month, get a month") designed to incentivize user acquisition with symmetric rewards.

## Mechanics
The referral program maps specific rewards to the referrer's current subscription plan when a referred user completes a qualified action. Rewards apply to BOTH the referrer and the referred user.

### Qualified Actions
Rewards are triggered by two distinct actions:
1. **Qualified Sign-Up:** The referred user creates a new account and links at least one social media account.
2. **Qualified Purchase:** The referred user successfully purchases a paid subscription plan.

### Tiered Symmetric Rewards
- **Referrer Tier: Free**
  - **Sign-Up:** +1 Extra Post Quota (Both Users)
  - **Purchase:** 1 Free Month of Pro (Both Users)

- **Referrer Tier: Paid**
  - **Sign-Up:** +50 AI Credits (Referrer), +1 Post Quota (Referred)
  - **Purchase:** 1 Free Month of Pro (Both Users)

- **Referrer Tier: Lifetime**
  - **Sign-Up:** +50 AI Credits (Referrer), +1 Post Quota (Referred)
  - **Purchase:** +1,000 AI Credits (Referrer), 1 Free Month of Pro (Referred)

### The Grand Prize (Lifetime Unlock or Cloud Pro)
In addition to symmetric rewards, any referrer who reaches **5 total Qualified Purchases** unlocks a permanent bonus. They will see a "Claim Grand Prize" button in their referral dashboard to explicitly choose:
- **100% Free Cloud Pro**: Applies a 100% off coupon to their Stripe subscription.
- **Lifetime BYOK**: Cancels active subscriptions and permanently unlocks lifetime access (`lifetimeUnlock = true`).

## Database Architecture
- `User` model includes:
  - `referralCode` (Unique String)
  - `referredById` (Foreign Key -> User)
  - `extraPostsQuota` (Int)
  - `lifetimeUnlock` (Boolean)

## Webhook Architecture
Stripe webhooks (`/api/webhooks/stripe`) listen for the `invoice.payment_succeeded` event specifically when `billing_reason === 'subscription_create'`. 

### Security
The Stripe Webhook is secured using `stripe.webhooks.constructEvent()` combined with `STRIPE_WEBHOOK_SECRET` environment variable to prevent replay and forgery attacks.

### Flow
1. User pays for a subscription.
2. Webhook fires and locates the `invoice.customer_email` in our Prisma database.
3. If the user has a `referredById`, we issue symmetric rewards via Balance Transactions (e.g., a `$10.00` credit for "1 Free Month") in Stripe to both the Referrer's and Referred User's Stripe Customer IDs, depending on their tier.
4. The user tracks their progress on the frontend. Once they hit 5 active paid referrals, they explicitly invoke the `POST /api/referral/redeem` endpoint via the UI to choose their Grand Prize.

## E2E Testing
The system utilizes Playwright for E2E testing. 
For local testing, the `NEXT_PUBLIC_E2E=true` environment variable exposes the `<E2ELoginForm />` which allows secure bypass of NextAuth magic links, and the E2E bypass routes explicitly disable Stripe signature validation.
