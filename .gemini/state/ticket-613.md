---
ticket_id: 613
branch_name: feature/613-byok-byos-wizard-fix
goal: Fix critical functional failures in BYOK (AI & Platform) and BYOS configuration wizards.
status: in-progress
---

# 📋 Ticket Metadata
- **ID**: 613
- **Branch**: `feature/613-byok-byos-wizard-fix`
- **Goal**: Fix critical functional failures in BYOK (AI & Platform) and BYOS configuration wizards.
- **Status**: in-progress

# Round 1

## 🔍 Discovery
- **Verdict**: APPROVED
- **Socratic Log**: 
    1. **Feasibility**: High. The core issues are architectural mismatches between tests (REST mocks) and code (Server Actions).
    2. **Strategic Alignment**: Crucial for onboarding. Configuration is the entry point.
    3. **Architectural Integrity**: Current state is a "half-migrated" hybrid (Server Actions for mutations, REST for some deletions). Needs harmonization.
    4. **Necessity/Priority**: Critical. Blocked by E2E failures.
    5. **External Dependencies**: None.
- **Technical Blueprint**: 
    1. **Harmonize Data layer**:
        - Convert all remaining BYOK/BYOS REST calls to Server Actions.
        - Specifically: Change `handleDelete` in `useByosWizard` to use a new `deleteByosConfigAction`.
    2. **Fix E2E Tests**:
        - The tests fail because they mock `/api/...` routes which are no longer called.
        - **Strategy**: Update Playwright tests to intercept the Server Action POST requests or use a test-specific API helper to prepare the environment. For immediate stability, we will ensure that the REST API endpoints call the same service logic as Server Actions, and update the frontend to use the REST endpoints if mocking Server Actions proves too brittle in Playwright.
    3. **Clarify Nomenclature & UI**:
        - Rename components to distinguish between `AiByokWizard` (OpenAI/Anthropic) and `PlatformByokWizard` (YouTube/TikTok).
        - Standardize "Validation Failed" and "Connection Active" UI feedback across both wizards.
    4. **State Persistence**:
        - Ensure `revalidatePath("/")` is called in all settings actions to fix the "Badge not showing on dashboard" issue.
- **Test Specification**: 
    - **Happy Path (AI BYOK)**: Enter key, save, verify "Successfully saved" message and key suffix display.
    - **Happy Path (Platform BYOK)**: Enter credentials for YouTube, save, verify "Connection Successful" message.
    - **Happy Path (BYOS)**: Complete 4-step stepper, verify "Connection Active" alert, navigate to Dashboard, verify "BYOS: [Provider] Active Pipeline" badge is visible.
    - **Negative Path (Validation)**: Provide invalid keys/credentials, verify that the error message from the Server Action is correctly displayed in the `Alert` component.
    - **Regression Check**: Verify that `localStorage` (for AI BYOK) and `Prisma` (for BYOS/Platform) stay in sync after page refreshes.

## 🛠️ Development
- **Verdict**: PENDING
- **Actions**: ...

## 🛡️ Review
- **Verdict**: PENDING
- **Checklist**: ...

## 🧪 QA
- **Verdict**: PENDING
- **Results**: ...

## 📝 Documentation
- **Verdict**: PENDING

## 📊 Project
- **Verdict**: OPEN
