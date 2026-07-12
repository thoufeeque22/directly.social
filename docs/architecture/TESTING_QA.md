# Testing & Quality Assurance

The application maintains a high standard of quality through automated testing and strict TypeScript enforcement.

## 1. E2E Testing (Playwright)

End-to-End tests are located in `src/__tests__/e2e/`.

- **Manual Environment Mandate:** To ensure stability and prevent server collisions, the E2E suite strictly targets `http://localhost:3000`. The server MUST be started manually by the developer/user. Agents are prohibited from using Playwright's `webServer` feature or attempting to manage the server lifecycle.
- **Production Mode Stability:** E2E suite runs against a production build (`npm run build && npm run start`).
- **Global Setup & Seeding:** Full database cleanup and idempotent seeding performed once before tests.
- **Automated Authentication:** Setup project performs login and saves session state.
- **Worker Isolation:** Backend worker supports namespaced temp directories via `TEST_WORKER_INDEX`.
- **Zero Console Error Policy:** E2E tests automatically fail if any unhandled exceptions or `console.error` logs occur during execution. This is enforced via the `consoleChecker` fixture in `base-test.ts`, ensuring high UI stability and preventing silent failures or hydration mismatches.
- **Landing Page Stabilization:** The marketing surface is covered by dedicated E2E specs (`landing-page.spec.ts`) that verify hero content, theme awareness, and core navigation links, ensuring the first-contact experience remains high-quality.

## 2. Unit & Integration Testing (Vitest)

Unit tests for utilities and integration tests for server actions are in `src/__tests__/unit/` and `src/__tests__/integration/`.

- **Test Environment:** Mock `ENCRYPTION_KEY` injected globally for credential-related tests.
- **Mocking Strategy:** External APIs and platform dependencies are heavily mocked.

## 3. Database & Test Utilities

Utility scripts for database management and test data seeding are located in `src/__tests__/scripts/`. These scripts are exposed via `package.json` for ease of use:


- **E2E Seeding:** `npm run seed:e2e`. Seeds a standard test user and session.
- **Activity Cleanup:** `npm run clear-activity`. Clears all activity records for a clean state.
- **Feature Seeding:** `npm run seed:schedule` and `npm run seed:whats-new`. Seeds specific feature data for development and testing.

## 4. Agent Orchestration

The project uses specialized AI agents (Discovery, Dev, Review, QA) to manage the development lifecycle. Core orchestration rules are modularized in `.agents/base/`.

## 5. Modularity Enforcement (The 100-Line Rule)

The project enforces a strict 100-line limit for all source files to ensure high maintainability.
- **Automation:** Enforced via ESLint's `max-lines` rule.
- **Exceptions:** Test files and scripts in `src/__tests__/**` are exempt.
- **Legacy Support:** Existing files exceed limit use `/* eslint-disable max-lines */`.
- **Debt Reduction Protocol:** Any interaction with a legacy file MUST include logic extraction into new, compliant modules.

## 6. Modern Web Standards

Adherence to modern web performance and quality standards is ensured via specialized audits during Review and QA phases.
- **Optimization Focus:** Continuous monitoring of Core Web Vitals (LCP, INP, CLS).
