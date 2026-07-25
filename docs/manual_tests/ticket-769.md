# Manual Test Script for Ticket 769: Adjustable Rolling Cap for Lifetime Deal Scarcity

## Prerequisites
- Local development server running (`npm run dev`).
- Access to the local database (Prisma Studio via `npx prisma studio` or your preferred database client).
- Postman, curl, or a browser console for API testing.

## Scenario 1: Happy Path (Counter Display)
1. **Setup**: Ensure `LIFETIME_CAP` in your `.env` file is set to a value significantly higher than the number of existing `LIFETIME_DEAL` records in your database (e.g., `LIFETIME_CAP=20`).
2. **Action**: Navigate to the pricing page (usually `/` or `/pricing` depending on layout).
3. **Verify**: Locate the Lifetime Deal tier card (PowerUserSection).
4. **Assert**: You should see a highlighted UI element (like a Chip) indicating the correct number of licenses left (e.g., "🔥 Only {N} licenses left", where `N` is `LIFETIME_CAP` minus the current database count).
5. **Assert**: The Checkout button for the Lifetime Deal should be enabled and display its normal text (e.g., "Get Lifetime Deal").

## Scenario 2: Sold Out State (UI)
1. **Setup**: Count the number of `LIFETIME_DEAL` records in your `BillingProfile` table.
2. **Setup**: Update the `LIFETIME_CAP` variable in your `.env` file to perfectly match that count. (You may need to restart the Next.js server to pick up the new `.env` value, depending on your setup).
3. **Action**: Hard refresh the pricing page.
4. **Verify**: Locate the Lifetime Deal tier card.
5. **Assert**: The checkout button text must change to "Sold Out".
6. **Assert**: The checkout button must be visually disabled and unclickable (`disabled` prop).

## Scenario 3: Checkout Validation (API Security)
1. **Setup**: Ensure the application is still in the "Sold Out" state as configured in Scenario 2.
2. **Action**: Open Postman or your browser's Developer Tools Console (on the app's domain).
3. **Action**: Perform a POST request directly to the Stripe checkout API for the lifetime deal.
   ```javascript
   fetch('/api/stripe/checkout', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ tierId: 'lifetime-deal' })
   }).then(res => res.json().then(data => console.log(res.status, data)));
   ```
4. **Assert**: The server must return a `400 Bad Request` HTTP status.
5. **Assert**: The response body must contain an error message indicating the deal is sold out.
6. **Assert**: The server must NOT return a Stripe checkout session URL.

## Scenario 4: Caching Verification
1. **Setup**: Set `LIFETIME_CAP` to a value higher than the DB count (e.g., 20). Refresh the page to see the count (e.g., "Only 15 licenses left").
2. **Action**: In Prisma Studio, manually delete one `LIFETIME_DEAL` billing profile record (or manually add one) to change the actual count in the database.
3. **Action**: Immediately refresh the pricing page (within 10-20 seconds).
4. **Assert**: The UI should **still display the old count** (e.g., 15) because of the 60-second TTL cache (`unstable_cache`).
5. **Action**: Wait for at least 60 seconds.
6. **Action**: Refresh the pricing page again.
7. **Assert**: The UI should now display the **new, updated count** (e.g., 16 or 14, depending on whether you deleted or added a record).
