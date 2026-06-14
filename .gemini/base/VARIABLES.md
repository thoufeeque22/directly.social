# Orchestration & Workflow Variables

This file centralizes all global constants, patterns, and strings used in the project's agent orchestration. Reference these variables in all instructions to ensure consistency.

## 🔀 Git & Branching
- **MAIN_BRANCH**: `main`
- **FEATURE_BRANCH_PREFIX**: `feature/`
- **FEATURE_BRANCH_PATTERN**: `feature/<id>-<description>`
- **COMMIT_MSG_PATTERN**: `<type>(ticket-<id>): <summary>`

## 📂 State Management
- **STATE_ROOT_DIR**: `.gemini/state/`
- **TICKET_STATE_DIR**: `.gemini/state/ticket-<id>/`
- **MAIN_STATE_FILE**: `MAIN.md`
- **ROUND_DIR_PATTERN**: `round-<N>/`
- **OBSERVATIONS_FILE**: `.gemini/incidental_observations.json`

## 🔄 Phase Sequence
- **PHASE_ORDER**: `Product` -> `Discovery` -> `Development` -> `Audit` -> `QA` -> `Documentation`
- **PHASES**:
  - `product`: Product Designer & UX Strategist
  - `discovery`: Technical Blueprint & Test Spec
  - `development`: Implementation (arxitect:architect)
  - `audit`: Security, Performance & Quality Audit
  - `qa`: E2E Test Automation & Manual Scripts
  - `doc`: Documentation & Orchestration Audit
  - `pm`: Project Management (project-agent)

## ✅ Verdicts & Statuses
- **GLOBAL_VERDICTS**: `SUCCESS`, `FAIL`, `BLOCKED`, `NEEDS-INFO`
- **PHASE_SPECIFIC_VERDICTS**:
  - `product/discovery`: `APPROVED`, `NEEDS-INFO`, `REJECTED`
  - `development`: `SUCCESS`, `BLOCKED`
  - `audit/qa`: `PASS`, `FAIL`
- **TICKET_STATUSES**: `in-progress`, `completed`, `blocked`

## 🛠 Scripts & Commands
- **STATE_UPDATE_CMD**: `npm run state:update -- --agent="<agent>" --verdict="<verdict>" --summary="<summary>" --content="<content>"`
- **SMOKE_TEST_CMD**: `npm run test:smoke`
- **REGRESSION_TEST_CMD**: `npm run test:regression`
- **LINT_CMD**: `npm run lint`
- **BUILD_CMD**: `npm run build`
- **TYPE_CHECK_CMD**: `npx tsc --noEmit`
- **NOTEBOOK_BUNDLE_CMD**: `npm run notebook:package`

## 📚 Documentation & Manual Tests
- **MANUAL_TEST_DIR**: `docs/manual_tests/`
- **MANUAL_TEST_FILE_PATTERN**: `docs/manual_tests/ticket-<id>.md`

## 🧩 Agent Skills
- **ARCHITECT_SKILL**: `arxitect:architect`
- **AUDITOR_SKILL**: `orchestration-auditor`
- **GH_ISSUE_MANAGER_SKILL**: `gh-project-issue-manager`

## 💎 Application Constants (App Source of Truth)
- **BRAND_CONFIG**: `src/lib/core/brand.ts` (Name, Tagline, URLs)
- **EMAIL_CONFIG**: `src/lib/core/emails.ts` (Support, Legal, Privacy emails)
- **APP_CONFIG**: `src/lib/core/config.ts` (App ID, User Agent, Env URLs)
- **APP_CONSTANTS**: `src/lib/core/constants.ts` (Platforms, AI Tiers, Storage Quotas)
- **PRODUCT_DATA**: `src/lib/core/product-data.ts` (Pricing, Features, Steps)
