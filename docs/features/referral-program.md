# Referral Bonus Program

## Overview
The Referral Bonus Program is a dual-sided growth loop ("Give a month, get a month") designed to incentivize user acquisition.

## Mechanics
The referral program maps specific rewards to the user's current subscription plan:

### Free Plans (Tier 1)
Users on free plans receive **+1 extra social media post quota** per successful referral. This applies to:
- **Free Starter**
- **Free Hacker**

### Paid Recurring Plans (Tier 2)
Users on active paid subscriptions receive **$10 Stripe credits** toward their next invoice per successful referral. This applies to:
- **Creator Pro**
- **Cloud Pro**

### One-Time Plans
- **Lifetime License**: Users with a lifetime deal already enjoy permanent access and unlimited post quotas. Since they do not have recurring invoices or quota caps, the referral rewards (+1 quota / $10 credits) are not applicable to them.

### The Grand Prize (Lifetime Unlock or Cloud Pro)
Regardless of the current plan, achieving **5 active paid referrals** unlocks the Grand Prize.
Instead of being applied automatically in the background, users will see a "Claim Grand Prize" button in their referral dashboard. Clicking this opens a modal where they can explicitly choose their reward:
- **100% Free Cloud Pro**: Applies a 100% off coupon to their Stripe subscription, or upgrades their free account.
- **Lifetime BYOK**: Cancels their active Stripe subscription (to stop future billing) and permanently unlocks lifetime access (`lifetimeUnlock = true`).

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
3. If the user has a `referredById`, we issue a `-1000` ($10.00) Balance Transaction in Stripe to the Referrer's Stripe Customer ID.
4. The user tracks their progress on the frontend. Once they hit 5 active paid referrals, they explicitly invoke the `POST /api/referral/redeem` endpoint via the UI to choose their Grand Prize.

## E2E Testing
The system utilizes Playwright for E2E testing. 
For local testing, the `NEXT_PUBLIC_E2E=true` environment variable exposes the `<E2ELoginForm />` which allows secure bypass of NextAuth magic links, and the E2E bypass routes explicitly disable Stripe signature validation.
