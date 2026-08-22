# Manual QA Plan: Issue #699 (GenAI Terms & Conditions Tracking)

## Prerequisites
1. Ensure the dev server is running on `http://localhost:3000`.
2. Ensure Prisma Studio is running or you have database access (`npx prisma studio`).

## Scenario 1: Verify New User Consent Acceptance

### Steps
1. Navigate to your Supabase/Prisma database and select a test user. Set their `genAITermsAcceptedAt` to `null` and `genAITermsVersion` to `null`.
2. Login to `http://localhost:3000` with this test user.
3. Initiate a new video upload in the dashboard.
4. Select an AI strategy (e.g., "Generate"). The terms consent checkbox should appear.
5. Check the "I consent to..." box.
6. Click the primary submit button ("Review AI Strategy" or similar).
7. Wait for the upload/backend action to complete (the "Applying AI magic..." loader).

### Expected Results
1. In the database, the user's `genAITermsAcceptedAt` field MUST contain the current UTC timestamp.
2. The `genAITermsVersion` field MUST exactly match `1` (or whatever integer version is being used).

---

## Scenario 2: Verify the Auth Session payload (DevTools)

### Steps
1. Open your browser Developer Tools (F12) while logged in on the dashboard.
2. In the Console, type `await fetch('/api/auth/session').then(r => r.json())` (or inspect the Network tab for session requests if using SSR exclusively, though next-auth/Supabase SSR session can be observed).
3. Alternatively, check the Redux/Context state for the user session if exposed in React DevTools.

### Expected Results
1. The session object should contain `user.genAITermsAcceptedAt` (populated with the ISO string date).
2. The session object should contain `user.genAITermsVersion` (`1`).
