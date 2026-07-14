# Manual Test: Privacy Policy Compliance for Google OAuth

**Feature**: Privacy Policy Update for Google OAuth Verification
**Component**: `src/components/legal/PrivacyContent.tsx`

## Prerequisites
1. Local Next.js dev server running on `http://localhost:3000`

## Scenario 1: Verify Google API Services Data Handling Section
1. Navigate to `http://localhost:3000/privacy`.
2. Scroll to the "Google API Services Data Handling" section (or equivalent).
3. **Expected**: The following disclosures are explicitly present:
   - What data is accessed (YouTube video uploads).
   - How data is used.
   - What data is transferred.
   - How data is secured.
   - Data retention and deletion policies.
   - A statement explicitly prohibiting the use of data for targeted advertising or selling to third parties.
   - A statement explicitly prohibiting the use of Google user data to train generalized AI/ML models.
   - The exact "Limited Use Compliance Statement": "The use of raw or derived user data received from Workspace APIs will adhere to the Google User Data Policy, including the Limited Use requirements."
