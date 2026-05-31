---
ticket_id: 393
branch_name: feature/393-ai-studio-billing-check
goal: Implement automated credit balance monitoring and alerts for AI studio
status: review
current_round: 1
---

# 📋 Ticket Metadata
- **ID**: 393
- **Branch**: `feature/393-ai-studio-billing-check`
- **Goal**: Implement automated credit balance monitoring and alerts for AI studio
- **Current Status**: review

# 🔄 Round History
- **Round 1**: [IN-PROGRESS]

# 📅 Timeline
- **[2026-05-31 20:38:00]**: Discovery started by `discovery-agent`.
- **[2026-05-31 20:41:06]**: DISCOVERY [NECESSARY] - Socratic Inquiry complete. Confirmed missing 'aiCredits' in schema. Identified AI consumption points (chat API and ai actions). BYOK users should be excluded. Can use existing Notification model for alerts and Header for dashboard display.
- **[2026-05-31 20:47:27]**: DEV [SUCCESS] - Implemented aiCredits logic: updated schema, auth, credits utility, and injected checks into chat API and AI generation actions. Added UI display in UserActions and error handling.
- **[2026-05-31 20:50:32]**: REVIEW [FAIL] - **VERDICT:** FAIL

**FAILURES:**
1. `src/lib/core/credits.ts:22` - The comment claims to use a transaction to prevent race conditions (`// 2. Fetch the current user balance using transaction to prevent race conditions`), but it actually executes two separate queries (`prisma.user.findUnique` followed by `prisma.user.update`). This allows a race condition where multiple concurrent requests can pass the balance check and drive the balance below zero. You should use `prisma.$transaction` or an atomic `updateMany` with a where clause `aiCredits: { gt: 0 }`.
2. UI/UX Synchronization - The user's AI credits are deducted in the database via `consumeAiCredit`, but the NextAuth session is never updated on the client. As a result, the "AI Credits remaining" chip in `UserActions.tsx` becomes stale immediately after generation. The `ai.ts` action and `chat/route.ts` need to pass the updated balance back to the client, or the client needs to explicitly call NextAuth's `update()` method to sync the session, otherwise the UI is permanently incorrect until a hard reload/re-login.
- **[2026-05-31 21:01:38]**: DEV [SUCCESS] - Fixed consumeAiCredit race condition with atomic updateMany. Resolved NextAuth session sync by fetching new balance via server action and calling update({ aiCredits }) post-generation across all UI consumers (Dashboard, Schedule, Chat, Cockpit).
