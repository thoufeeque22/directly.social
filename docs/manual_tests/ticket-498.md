# Manual Test Script for Ticket #498: Stripe Integration

## Prerequisites
1. Have Stripe CLI installed and authenticated locally (`stripe login`).
2. Run `stripe listen --forward-to localhost:3000/api/stripe/webhook` in a separate terminal.
3. Keep the Webhook Secret provided by the Stripe CLI and set it in your `.env` file as `STRIPE_WEBHOOK_SECRET`.
4. Ensure `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` are also set.
5. Create test products (Creator Pro, Cloud Pro, Lifetime Deal) in the Stripe dashboard and map their Price IDs in `.env` if necessary.

## Test Cases

### TC-1: Verify Pricing Page Checkout Redirection
1. Start the local server `pnpm dev`.
2. Navigate to `http://localhost:3000/pricing`.
3. Verify that the new pricing tiers (Power Pass, Creator Pro, Cloud Pro, Lifetime Deal) are visible.
4. Click the "Subscribe" or "Get Started" button on the **Creator Pro** tier.
5. **Expected Result:** You are securely redirected to a Stripe Checkout page.

### TC-2: Verify Test Purchase & Webhook
1. On the Stripe Checkout page, enter a Stripe test card (e.g. `4242 4242 4242 4242`) and dummy details.
2. Complete the purchase.
3. **Expected Result:** You are redirected back to the application (e.g., `/dashboard` or a success page).
4. **Expected Result:** Check the terminal running `stripe listen`. It should show `checkout.session.completed` and `invoice.payment_succeeded` events being received (200 OK).
5. Verify the Supabase Postgres database (`User` table) for the purchasing user.
   - `stripeCustomerId` should be populated.
   - `stripeSubscriptionId` should be populated.
   - `subscriptionTier` should reflect the purchased tier (e.g., `creator-pro`).
   - `subscriptionStatus` should be `active`.

### TC-3: Verify Subscription Cancellation
1. In the Stripe Dashboard (Test Mode), locate the Customer that was just created and cancel their active subscription.
2. **Expected Result:** The `stripe listen` terminal should log a `customer.subscription.deleted` event (200 OK).
3. Verify the Supabase Postgres database (`User` table).
   - `subscriptionStatus` should be updated to reflect cancellation (e.g., `canceled` or `inactive`).
