---
ticket_id: 661
branch_name: feature/661-redirect-to-landing-on-signout
goal: Redirect user to landing page (/) instead of login page (/login) upon sign-out.
status: dev
current_round: 1
---

# 📋 Ticket Metadata
- **ID**: 661
- **Branch**: `feature/661-redirect-to-landing-on-signout`
- **Goal**: Redirect user to landing page (/) instead of login page (/login) upon sign-out.
- **Current Status**: dev

# 📝 Ticket Description
### Description
When a user signs out, they should be redirected to the landing page instead of the login page to improve the user experience.

### Technical Context
The `signOut` call in `src/components/layout/UserActions.tsx` currently has `callbackUrl: '/login'`.
This should be updated to `/` or the configured landing page URL.

### Details
- **Priority:** Medium
- **Labels:** enhancement, ux
- **Impact:** UX improvement for authenticated users.

# 🔄 Round History
- **Round 1**: [IN-PROGRESS]

# 📅 Timeline
- **[2026-06-14 15:29:24]**: PROJECT [ISSUES-MANAGED] - Created issue #661 for sign-out redirect and added to board 4.
- **[2026-06-14 15:30:54]**: PRODUCT [APPROVED] - Redirect sign-out to landing page with success notification.
- **[2026-06-14 15:54:00]**: AUDIT [FAIL] - E2E Smoke test failure: Heading level mismatch for 'Built for Every Workflow'.
