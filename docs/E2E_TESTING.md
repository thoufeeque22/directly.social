# End-to-End (E2E) Testing Guide

This guide explains how to run and maintain E2E tests in Directly using Playwright.

## Core Philosophy

Our E2E tests are designed to be **production-reflective** and **idempotent**. 
1. **Production-Reflective**: Tests run against a full production build (`npm run build && npm run start`) to catch hydration errors and server-side issues that don't appear in `next dev`.
2. **Idempotent**: Every test run starts with a clean state. Database cleanup and seeding are handled automatically by the `global-setup.ts` script.

## Getting Started

### Prerequisites

You must have the following environment variables configured in your local `.env` or passed to the command:

- `NEXT_PUBLIC_E2E=true`: Enables the test-specific credentials provider.
- `E2E_TEST_PASSWORD`: The password for the dedicated tester account (`tester@directly.social`).

### Running Tests

To run the entire suite:

```bash
npx playwright test
```

To run a specific test file:

```bash
npx playwright test src/__tests__/e2e/auth.spec.ts
```

To run in UI mode:

```bash
npx playwright test --ui
```

## Infrastructure

### Production Build Integration

The `playwright.config.ts` uses the `webServer` feature to automatically build and start the app:

```ts
command: 'npm run build && npm run start -- -p 3005'
```

*Note: The first run might be slow due to the build step. Subsequent runs in the same session (using `--reuse-existing-server`) are faster.*

### Global Setup

Located at `src/__tests__/e2e/global-setup.ts`, this script:
1. Clears existing activity and temp files (`npm run clear-activity`).
2. Seeds the database with the standard test user and initial schedule.

### Authentication State

We use a "Setup Project" pattern. Playwright runs `auth.setup.ts` first, which logs in the user and saves the storage state to `.auth/user.json`. All other tests depend on this state, so they don't need to perform the login flow.

### Parallel Test Isolation

When running tests in parallel, Directly relies on Playwright's `testInfo.parallelIndex` to allocate completely isolated tester identities and storage states (e.g., `v2-tester-0.json`, `v2-tester-1.json`, etc.). 

**Crucial Architecture Note:** Never use `testInfo.workerIndex` for database or user identity isolation. Because Playwright dynamically spins up and tears down workers during execution, multiple parallel workers can be assigned the identical modulo `workerIndex`, leading to Cross-Test Database Pollution (race conditions where independent tests manipulate the same database records). `parallelIndex` is strictly guaranteed to be unique for concurrent execution lines.

## Troubleshooting

### Stability Issues (`ECONNRESET`)

If you encounter `ECONNRESET` or `FETCH_ERROR`, ensure that:
1. You are NOT running `next dev` in another terminal on the same port.
2. The server has enough memory (build step is resource-intensive).
3. `reuseExistingServer` is set correctly in `playwright.config.ts`.

### Hydration Mismatch

Because E2E tests run in production mode, they are very sensitive to hydration mismatches (client/server HTML differences). If a test fails with a hydration error, check if your component uses browser-only APIs (`window`, `localStorage`) without a `useEffect` or `mounted` check.

### Database State

If tests fail due to "already exists" or "not found" errors, try manually resetting the database:

```bash
npm run clear-activity && npm run seed:e2e
```

### Error Boundary Verification

To reliably test the global `ErrorBoundary` fallback UI, a dedicated test route `src/app/test-error/page.tsx` is implemented. This route intentionally throws a client-side error during render. End-to-end tests can navigate to `/test-error` and verify that the app correctly displays the error card and "Try again" button instead of crashing or showing a blank screen.

## Server Action Mocking Strategy

Traditional E2E mocking often uses `page.route` to intercept REST API calls. However, Next.js **Server Actions** use an internal RSC (React Server Component) wire protocol that is version-sensitive and fragile to manually reconstruct.

### The Bypass Pattern

To ensure stable E2E tests, we use an **Internal Bypass Pattern** rather than intercepting the network layer:

1. **Environmental Flag**: Actions check for `process.env.NEXT_PUBLIC_E2E === 'true'`.
2. **Stable E2E Identity**: During setup, we use a stable user ID (e.g., `e2e-tester-id-stable`) to trigger mocks.
3. **Keyword Triggers**: Use special keywords in input fields to simulate different server behaviors:
   - `valid`: Triggers success in platform validators.
   - `invalid-id` or `invalid-key`: Triggers specific error objects.
   - `sk-mock-key`: Bypasses real AI SDK generation with a mock response.

### Example (Server Side)

```ts
export async function saveByosConfigAction(data: unknown) {
  return protectedAction(async (userId) => {
    if (process.env.NEXT_PUBLIC_E2E === 'true') {
      // Return a stable mock object instantly
      return { success: true, config: { provider: 'S3', ... } };
    }
    // Real logic...
  });
}
```

This strategy ensures that our E2E tests verify the **full functional flow** (UI -> Client -> Server -> Client) without the instability of manual RSC protocol mocking.
