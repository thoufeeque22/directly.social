---
ticket_id: 369
branch_name: feature/369
goal: Persist user AI preferences (Strategy and Provider) across sessions using DB and localStorage.
status: in-progress
---

# Round 1

## 🔍 Discovery
- **Strategic Importance**: Reduces user friction by remembering AI configuration, leading to a more personalized and efficient workflow.
- **Dual-Agent Protocol**: 
    - *Advocate*: Providing both DB and localStorage persistence ensures a robust experience regardless of connectivity or session state.
    - *Skeptic*: Need to ensure that adding more fields to the `User` model doesn't bloat the schema unnecessarily and that the synchronization between `localStorage` and DB is handled gracefully without race conditions.
- **Technical Blueprint**:
    - Add `preferredAIProvider` to `User` model in Prisma.
    - Create server actions for fetching and updating AI provider preference.
    - Add `AIProviderSelector` component to the `UploadForm`.
    - Update `DashboardClient` to manage `aiProvider` state and persist it.
    - Pass `preferredProvider` through the AI generation pipeline (`ai-writer.ts` -> `ai.ts`).
- **Impact Radius**: `prisma/schema.prisma`, `src/app/actions/user.ts`, `src/components/dashboard/UploadForm/`, `src/lib/core/ai.ts`, `src/lib/utils/ai-writer.ts`.
- **Production Readiness**: Fallback to `localStorage` handles offline/guest scenarios. Standard error handling for DB operations.
- **Test Specification**: 
    - Verify persistence after page reload.
    - Verify persistence across different devices (DB sync).
    - Verify `localStorage` fallback when DB is unavailable or user is not logged in.

## 🛠️ Development
- **Actions**:
    - Updated Prisma schema with `preferredAIProvider` and `preferredAIStyleMode`.
    - Added server actions in `user.ts` for pre-fetching and updating preferences.
    - Created `AIProviderSelector` component for the dashboard.
    - Updated `DashboardClient` to manage and persist AI state (Tier, Style, Provider).
    - Passed preferred provider to AI generation pipeline.
- **Modified Files**:
    - `prisma/schema.prisma`
    - `src/app/actions/user.ts`
    - `src/lib/core/ai.ts`
    - `src/lib/utils/ai-writer.ts`
    - `src/components/dashboard/UploadForm/AIProviderSelector.tsx`
    - `src/components/dashboard/DashboardClient.tsx`
    - `src/components/dashboard/UploadForm/UploadFormContext.types.ts`
    - `src/components/dashboard/UploadForm/UploadFormInner.tsx`
    - `src/app/page.tsx`
    - `src/app/actions/ai.ts`
    - `src/components/dashboard/UploadForm/AIStrategyNotice.tsx`

## 🛡️ Review
- **Checklist**:
  - [x] Modularity (50-line rule)
  - [x] Zero-Any Policy
  - [x] No Emojis
  - [x] Security/Audit

## 🧪 QA
- **Scenarios**:
    - **Database Actions**: Verified server actions for fetching and updating `preferredAIProvider` and `preferredAIStyleMode` in `src/__tests__/unit/user-settings.test.ts`.
    - **Persistence Logic**: Verified `DashboardClient` synchronization (prioritizing `localStorage` over server props on mount) in `src/__tests__/integration/ai-preference-persistence.test.tsx`.
    - **UI Feedback**: Verified that `AIStrategyNotice` correctly reflects the active configuration.
- **Results**: Pass

## 📝 Documentation
- **Updates**: Updated `docs/manual_tests/373-multi-provider-ai-strategy.md` to include UI-based testing steps.

## 📊 Project
- **Status**: Completed
