# Manual Test Script for Ticket 496 (Legal & Compliance)

**Objective**: Verify that all legal and compliance documents are accessible, render correctly, and contain valid links to third-party policies.

## Pre-requisites
- Application must be running locally (e.g., `pnpm dev` or `http://localhost:3000`).

## Scenarios

### M-1: Verify Legal Pages Rendering
1. Navigate to `http://localhost:3000/terms`.
2. **Verify**: The Terms of Service content is fully legible and adapts to different window sizes (test on desktop and mobile viewports).
3. Navigate to `http://localhost:3000/privacy`.
4. **Verify**: The Privacy Policy renders correctly and sections (Data We Collect, API Usage, etc.) are clearly separated.
5. Navigate to `http://localhost:3000/cookies`.
6. **Verify**: The Cookie Policy renders correctly, displaying strictly necessary cookies and analytics usage clearly.

### M-2: Verify External Links Validity
1. Navigate to `http://localhost:3000/terms`.
2. Click the links for YouTube, TikTok, Meta, and Stripe terms of service.
3. **Verify**: Each link opens the correct policy page in a new tab without returning a 404 error.
4. Navigate to `http://localhost:3000/privacy`.
5. Click the links for YouTube Terms of Service, Google Privacy Policy, and Google API Services User Data Policy.
6. **Verify**: Each link successfully loads the corresponding policy.

### M-3: Verify Contact Links
1. Navigate to `http://localhost:3000/terms`.
2. Click the `legal@...` contact email link.
3. **Verify**: It attempts to open your device's default mail client with the correct "to" address.
4. Navigate to `http://localhost:3000/privacy`.
5. Click the `privacy@...` contact email link.
6. **Verify**: It attempts to open your device's default mail client.
