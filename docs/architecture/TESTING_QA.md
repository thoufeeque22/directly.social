# Testing & Quality Assurance

The application maintains a high standard of quality through automated testing and strict TypeScript enforcement.

## 1. E2E Testing (Playwright)

End-to-End tests are located in `src/__tests__/e2e/`.

- **Production Mode Stability:** E2E suite runs against a production build (`npm run build && npm run start`).
- **Global Setup & Seeding:** Full database cleanup and idempotent seeding performed once before tests.
- **Automated Authentication:** Setup project performs login and saves session state.
- **Worker Isolation:** Backend worker supports namespaced temp directories via `TEST_WORKER_INDEX`.
- **Zero Console Error Policy:** E2E tests automatically fail if any unhandled exceptions or `console.error` logs occur during execution. This is enforced via the `consoleChecker` fixture in `base-test.ts`, ensuring high UI stability and preventing silent failures or hydration mismatches.

## 2. Unit & Integration Testing (Vitest)

Unit tests for utilities and integration tests for server actions are in `src/__tests__/unit/` and `src/__tests__/integration/`.

- **Test Environment:** Mock `ENCRYPTION_KEY` injected globally for credential-related tests.
- **Mocking Strategy:** External APIs and platform dependencies are heavily mocked.

## 3. Agent Orchestration

The project uses specialized AI agents (Discovery, Dev, Review, QA) to manage the development lifecycle. Core orchestration rules are modularized in `.gemini/base/`.

## 4. Modularity Enforcement (The 50-Line Rule)

The project enforces a strict 50-line limit for all source files to ensure high maintainability.
- **Automation:** Enforced via ESLint's `max-lines` rule.
- **Exceptions:** Test files are exempt.
- **Legacy Support:** Existing files exceed limit use `/* eslint-disable max-lines */`.

## 5. Modern Web Standards

Adherence to modern web performance and quality standards is ensured via specialized audits during Review and QA phases.
- **Optimization Focus:** Continuous monitoring of Core Web Vitals (LCP, INP, CLS).
