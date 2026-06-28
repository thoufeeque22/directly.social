# Manual Test Script for Ticket #689 (Stripe Customer Portal & Freemium Guard)

## Prerequisites
- A local instance running `npm run dev` or `pnpm dev`.
- A Stripe sandbox account configured with Webhook secrets, Price IDs, and Public/Secret keys in `.env`.
- Database seeded with at least one free user and one Pro user.

## Scenario 1: Customer Portal Button for Subscribers
1. Login to the application as a user who HAS an active Stripe subscription (e.g. `subscriptionTier = PRO`).
2. Navigate to `/settings` and scroll/click to the **Subscription & Billing** section.
3. Verify that instead of "View Plans & Upgrade", there is a **"Manage Subscription"** button.
4. Click **"Manage Subscription"**.
5. Verify that the application redirects to the Stripe Customer Portal successfully.
6. Verify you can see your billing details in the portal.

## Scenario 2: Upgrade Prompt for Free Users
1. Login to the application as a user with a `FREE` subscription tier (or no subscription).
2. Navigate to `/settings` -> **Subscription & Billing**.
3. Verify that the **"Manage Subscription"** button is NOT present.
4. Verify that the **"View Plans & Upgrade"** button IS present.

## Scenario 3: Freemium Guard Blocks Video Uploads (Free Tier)
1. In the database, manually seed the `PostActivity` table so the free user has exactly `10` video uploads in the current month.
2. Login to the application as the free user.
3. Attempt to upload a new video.
4. Verify that the upload fails and an error message is displayed (e.g. `402 Payment Required` or `403 Forbidden` - "Monthly quota exceeded").
5. Verify that the application prompts you to upgrade to a higher tier.

## Scenario 4: Freemium Guard Allows Video Uploads (Pro Tier)
1. In the database, ensure the Pro user has `10` or more video uploads in the current month.
2. Login as the Pro user.
3. Attempt to upload a new video.
4. Verify that the upload succeeds because Pro has unlimited (or a much higher) limit.
