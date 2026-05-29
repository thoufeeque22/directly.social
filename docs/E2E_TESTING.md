# End-to-End (E2E) Testing Guide

This guide explains how to run and maintain E2E tests in Social Studio using Playwright.

## Core Philosophy

Our E2E tests are designed to be **production-reflective** and **idempotent**. 
1. **Production-Reflective**: Tests run against a full production build (`npm run build && npm run start`) to catch hydration errors and server-side issues that don't appear in `next dev`.
2. **Idempotent**: Every test run starts with a clean state. Database cleanup and seeding are handled automatically by the `global-setup.ts` script.

## Getting Started

### Prerequisites

You must have the following environment variables configured in your local `.env` or passed to the command:

- `NEXT_PUBLIC_E2E=true`: Enables the test-specific credentials provider.
- `E2E_TEST_PASSWORD`: The password for the dedicated tester account (`tester@socialstudio.ai`).

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

### Worker Isolation

When running tests in parallel, Social Studio uses the `TEST_WORKER_INDEX` environment variable to create isolated temporary directories (e.g., `tmp/e2e/worker-0/`). This prevents race conditions during file upload and processing tests.

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
