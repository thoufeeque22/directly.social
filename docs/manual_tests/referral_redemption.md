# Manual Test: Referral Redemption Flow

**Feature**: Referral Redemption Flow (Issue #750)
**Component**: `src/components/referral/ClaimPrizeModal.tsx`, `src/app/api/referral/redeem/route.ts`

## Prerequisites
1. Local Next.js dev server running on `http://localhost:3000`
2. Stripe Local Webhooks running (optional, if simulating real payments)
3. Prisma Studio running `npx prisma studio`

## Scenario 1: Reaching 5 Referrals & Viewing the Button
1. Log in with a test user (`User A`).
2. Navigate to `http://localhost:3000/referral`.
3. Verify the progress bar shows `0 / 5 Paid Squad`.
4. Open Prisma Studio and manually create 5 User records where `referredById` matches User A's ID. 
5. For each of the 5 referred users, create a `BillingProfile` where `subscriptionTier` is `CREATOR_PRO` and `subscriptionStatus` is `ACTIVE`.
6. Refresh the referral page on `http://localhost:3000/referral`.
7. **Expected**: The progress bar is gone, replaced by a pulsing, glowing "Claim Grand Prize" button.

## Scenario 2: Choosing "Free Cloud Pro"
1. Click the "Claim Grand Prize" button.
2. **Expected**: A modal pops up titled "Choose Your Reward".
3. Click the "100% Free Cloud Pro" option.
4. **Expected**: The modal shows a loading spinner briefly, then succeeds and the page reloads. The "Claim Grand Prize" button is now hidden and the progress section does not show the button anymore.
5. Open Prisma Studio and check User A's `BillingProfile`.
6. **Expected**: User A's `subscriptionTier` is now `CLOUD_PRO`. `lifetimeUnlock` on User A is true.

## Scenario 3: Choosing "Lifetime BYOK" (Paid User)
1. Set up a new `User B` who has a Stripe subscription (in Stripe Dashboard, create a test subscription).
2. Seed 5 active referrals for `User B`.
3. Open the claim modal and select "Lifetime BYOK".
4. **Expected**: Modal succeeds, page reloads.
5. Open Stripe Dashboard.
6. **Expected**: User B's active subscription is now **Canceled**.
7. Open Prisma Studio.
8. **Expected**: User B's `subscriptionTier` is `LIFETIME_DEAL`.
