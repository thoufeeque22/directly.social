# Referral Bonus Program

## Overview
The Referral Bonus Program is a dual-sided growth loop ("Give a month, get a month") designed to incentivize user acquisition.

## Mechanics
- **Tier 1 (Free Users)**: Referrals grant `+1` extra social media post quota.
- **Tier 2 (Paid Users - Cloud Pro & BYOK)**: Referrals grant `$10` Stripe credits toward the referrer's next invoice.
- **Grand Prize (Lifetime Unlock)**: Achieving 5 active paid referrals unlocks "Lifetime Cloud Pro" or "Lifetime BYOK" status (`lifetimeUnlock = true`).

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
4. The system calculates the count of Active Paid Referrals. If `>= 5`, the system sets `lifetimeUnlock = true` and applies a `100_OFF` coupon to the Referrer's Stripe Subscription.

## E2E Testing
The system utilizes Playwright for E2E testing. 
For local testing, the `NEXT_PUBLIC_E2E=true` environment variable exposes the `<E2ELoginForm />` which allows secure bypass of NextAuth magic links, and the E2E bypass routes explicitly disable Stripe signature validation.
