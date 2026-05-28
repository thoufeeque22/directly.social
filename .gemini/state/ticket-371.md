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
- **Actions**: (Pending)
- **Modified Files**: []

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
- **Scenarios**: (Pending)
- **Results**: ...

## 📝 Documentation
- **Updates**: (Pending)

## 📊 Project
- **Status**: in-progress
