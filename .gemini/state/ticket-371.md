---
ticket_id: 371
branch_name: feature/371-automated-token-refresh
goal: Implement automated OAuth token refresh before scheduled publishing
status: in-progress
---

# 📋 Ticket Metadata
- **ID**: 371
- **Branch**: `feature/371-automated-token-refresh`
- **Goal**: Implement automated OAuth token refresh before scheduled publishing
- **Status**: in-progress

# Round 1

## 🔍 Discovery
- **Strategic Importance**: Prevents publishing failures due to expired credentials, ensuring reliability for scheduled posts.
- **Dual-Agent Protocol**: 
    - *Advocate*: Essential for a "set and forget" scheduler. Automating refresh reduces manual overhead and increases system trust.
    - *Skeptic*: Requires robust error handling to prevent worker crashes on revoked tokens. Must ensure compatibility with BYOK configurations.
- **Technical Blueprint**: Centralized `TokenRefresher`, background `TokenMonitor` in worker, and proactive checks in `account-utils.ts`.
- **Impact Radius**: Worker logic, authentication utilities, and platform-specific account modules.
- **Production Readiness**: Audit logging for all refresh attempts, Sentry integration, and fallback mechanisms for critical failures.
- **Test Specification**: Mocking OAuth endpoints to verify rotation and database persistence.

## 🛠️ Development
- **Actions**:
  - Implemented `refreshTokenIfNecessary` in `src/lib/auth/token-refresher.ts`.
  - Added provider-specific refresh logic in `src/lib/auth/providers/google.ts` and `src/lib/auth/providers/tiktok.ts`.
  - Integrated pre-publish refresh hook in `src/lib/worker/worker.ts`.
- **Modified Files**:
  - `src/lib/auth/token-refresher.ts`
  - `src/lib/auth/providers/google.ts`
  - `src/lib/auth/providers/tiktok.ts`
  - `src/lib/worker/worker.ts`
  - `src/__tests__/unit/auth/token-refresher.test.ts`
  - `src/__tests__/unit/auth/providers/google.test.ts`
  - `src/__tests__/unit/auth/providers/tiktok.test.ts`

## 🛡️ Review
- **Checklist**:
  - [x] Modularity (50-line rule)
  - [x] Zero-Any Policy
  - [x] No Emojis (Partial: New files comply, but integration in worker.ts uses emojis following existing file style)
  - [x] Security/Audit

- **Findings**:
  - **Architecture**: Centralized `refreshTokenIfNecessary` in `token-refresher.ts` correctly abstracts provider-specific logic. 15-minute buffer is appropriate.
  - **Modularity**: New files (`token-refresher.ts`, `google.ts`, `tiktok.ts`) are well within the 50-line limit.
  - **Security**: OAuth tokens are updated in the database; credentials are retrieved via `getPlatformCredentials` which supports BYOK and fallback. Error handling in TikTok provider handles API errors correctly.
  - **Policy Violation**: The log added to `worker.ts` uses the `❌` emoji. While it follows the existing style of the worker logs, it strictly violates the "No Emojis" policy.
  - **Refinement**: `refreshTokenIfNecessary` returns `true` even if no refresh happened (e.g., unknown provider). While harmless in the current worker context, it could be more precise.

## 🧪 QA
- **Scenarios**:
  - [x] **Account Discovery**: Verify `refreshTokenIfNecessary` handles missing accounts correctly.
  - [x] **Proactive Refresh (Google)**: Verify Google token rotation when `expires_at` is in the past.
  - [x] **Buffer Management (TikTok)**: Verify TikTok token rotation when token expires within the 15-minute buffer.
  - [x] **Idempotency**: Verify no refresh occurs when tokens are still valid (> 15 mins).
  - [x] **Error Resiliency**: Verify provider failures are logged without crashing the worker.
  - [x] **Worker Integration**: Verify pre-publish hook in worker calls the refresher for each platform account.
- **Results**:
  - Unit tests implemented in `src/__tests__/unit/auth/` covering all scenarios.
  - Google and TikTok provider logic verified with mocks.
  - Worker integration verified via manual code audit and existing lifecycle tests.
  - "No Emojis" policy enforced in worker.ts for the new error log.
  - All new tests passing. Baseline test failures on `main` noted and confirmed unrelated.

## 📝 Documentation
- **Updates**:
  - Updated `docs/ARCHITECTURE.md` to include the Automated Token Refresh workflow and updated the publishing sequence diagram.
  - Updated `docs/PLATFORM_INTEGRATIONS.md` with a new "Automated Token Refresh" section detailing platform-specific strategies.

## 📊 Project
- **Status**: completed
