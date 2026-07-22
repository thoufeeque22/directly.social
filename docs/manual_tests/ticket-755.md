# Manual Test Script: Ticket #755 - Symmetric Referral Rewards

**Objective:** Verify the "Give a Month, Get a Month" symmetric referral rewards system.

## Prerequisites
- A test Stripe account with webhooks configured.
- Two test accounts (Referrer A and Referred User B).

## Test Case 1: Personalized Onboarding Banner (Happy Path)
1. Get the referral code for Referrer A (Name: "Alice").
2. Navigate to `https://<env-url>/signup?ref=<Alice_Code>`.
3. **Expected Result:** Banner displays: "You've been gifted 1 Free Month upon upgrading by Alice!"

## Test Case 2: Social Connect Reward (Happy Path)
1. Sign up User B using Alice's code. Connect a social account.
2. **Expected Result:** User B sees `Extra Post Quota: 1`.
3. Log into Alice's account.
4. **Expected Result:** Alice's Extra Post Quota increases by 1.

## Test Case 3: Paid Conversion Reward (Happy Path)
1. User B upgrades to Monthly Plan via Stripe.
2. **Expected Result:** 100%-off coupon (duration: once) applied to User B's subscription.
3. **Expected Result:** Same coupon applied to Alice's active subscription.
4. **Expected Result:** Alice's "Earned Free Months" tracker increments by 1.

## Test Case 4: Lifetime Referrer (Edge Case)
1. User C is on `LIFETIME_DEAL`. User D signs up via User C and upgrades.
2. **Expected Result:** User D gets 1-month free coupon. User C gets +1000 AI Credits.

## Test Case 5: Self-Referral (Negative Scenario)
1. Log in as Alice. Visit `https://<env-url>/signup?ref=<Alice_Code>`.
2. **Expected Result:** Blocked with error "You cannot use your own referral code."

## Test Case 6: Refund Clawback (Negative Scenario)
1. Refund User B's payment in Stripe Dashboard.
2. **Expected Result:** Alice's "Earned Free Months" decrements by 1; coupon removed if unused.
