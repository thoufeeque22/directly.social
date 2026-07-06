# Manual Test Script: Referral Bonus Program (Ticket #484)

## Pre-requisites & Environment Modes
You can validate this feature in two modes:

**Mode A: Full E2E Mock Mode (Recommended for Local UI QA)**
- Run the dev server with `NEXT_PUBLIC_E2E=true npm run dev`
- **Crucial**: When logging in, you MUST use test emails ending in `@directly.social` (e.g., `tester-usera@directly.social`) and password `secret` (from `E2E_TEST_PASSWORD`).
- Stripe interactions (Balances and Upcoming Invoices) are safely mocked via `/api/testing/*` routes.
- You can simulate webhooks directly by POSTing to `/api/webhooks/stripe`.

**Mode B: Real Stripe Test Mode**
- Ensure local database and Stripe CLI are running to intercept webhooks (`stripe listen --forward-to localhost:3000/api/webhooks/stripe`).
- Create 6 fresh test users using normal OAuth or standard login flows.

## Scenario 1: Legal Compliance
1. Navigate to `/terms`.
2. Verify explicit text stating rewards are discretionary, dependent on successful non-refunded payments, subject to revocation, and Grand Prize requires exactly 5 active paid referrals.

## Scenario 2: Tier 1 (Free) Reward Issue & Consumption
1. **User A** logs into Dashboard. Click the sidebar button: `🚀 Get Cloud Pro for Free`. Copy `referralCode` link.
2. Open an Incognito window, navigate to the link, and sign up as **User B** (e.g., `tester-userb@directly.social`). 
3. Navigate back to **User A**'s window and refresh. Verify `extraPostsQuota` reads `5`.
4. **Consumption Validation:** Exhaust **User A**'s base limit (e.g. 10 posts). Attempt to post an 11th time. 
5. Verify the 11th post succeeds. Verify `extraPostsQuota` decrements to `4`.

## Scenario 3: Cap Enforcement
1. Use **User A**'s link to sign up Users C, D, E, F, G, H.
2. Verify **User A**'s `extraPostsQuota` halts exactly at `25` and does not exceed it.

## Scenario 4: Tier 2 (Paid) Reward Issue & Consumption
1. Log into **User B**. Complete checkout to upgrade to a Paid Subscription (or simulate via webhook in Mock Mode).
2. **Mode B:** Observe local Stripe CLI to verify `invoice.payment_succeeded` fires.
3. **Mode B:** Verify via Stripe Dashboard that a Balance Transaction matching the invoice total was issued to **User A**.
4. Log back into **User A**. Open Referral Hub. Verify confetti animation plays and Table shows **User B** Status as `Active`.
5. **Consumption Validation:** Preview the next upcoming invoice for **User A** (via UI or Stripe Dashboard). Verify the total amount due is reduced strictly by the credited balance transaction amount.

## Scenario 5: Grand Prize (Option B) Reward Issue & Consumption
1. Trigger `invoice.payment_succeeded` webhooks for Users C, D, E, and F, marking them as Paid Upgrades (via API POST or Stripe CLI).
2. Log into **User A**, open Referral Hub. Verify Progress Bar displays `5 / 5 Active Squad Members`.
3. Check **User A**'s subscription status. Verify the label says `100% Free Cloud Pro`.
4. **Consumption Validation:** Preview the next upcoming invoice for **User A**. Verify the amount due is exactly `$0.00`.
5. In the App, navigate to a Cloud Pro exclusive feature (e.g., "Generate Pro Report"). Verify **User A** can successfully execute it without hitting a paywall.

## Scenario 6: Churn Dynamics
1. Trigger a `customer.subscription.deleted` webhook for **User C**.
2. Refresh **User A**'s window. Verify Progress Bar updates to `4 / 5 Active Squad Members` and `100% Free Cloud Pro` label is removed. Verify next Stripe invoice preview returns to standard price.

## Scenario 7: Self-Referral Prevention
1. As **User A**, copy your referral link.
2. Attempt to sign up using the exact same email address (e.g., `tester-usera@directly.social`).
3. Verify the referral does not increment quota, does not create a squad member, and grants no bonus.
