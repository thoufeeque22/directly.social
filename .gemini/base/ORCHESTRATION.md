# Agent Orchestration & Workflow

## Core Mandates
- **Strict Initialization:** Before any work begins, the Orchestrator MUST:
  1. Switch to `main` and pull latest (`git checkout main && git pull`).
  2. Create a dedicated feature branch (`feature/<id>-short-description`).
  3. Create a state file `.gemini/state/ticket-<id>.md` following the **Markdown Lifecycle Template**.
- **Human-in-the-Loop Workflow:** ALL transitions between agent phases MUST be mediated by the user. 
  1. **Update State File First:** The active agent MUST update the `ticket.md` file with the results/verdicts before presenting for review.
  2. **Manual Review:** The user reviews the changes and the ticket state.
  3. **Explicit Approval:** The user provides approval to proceed.
  4. **Sub-Agent Execution:** ONLY AFTER approval, a sub-agent is invoked to perform the `git commit`.
- **Traceable Status:** EVERY agent MUST update their section with a clear **Verdict** before handoff.

## State Management & Pruning
- **Pruning Trigger:** If a state file exceeds 100 lines or 3 rounds, move to `archive/` and initialize a Summary section in the active file.

## Markdown Lifecycle Template
```markdown
---
ticket_id: 123
branch_name: feature/...
goal: Concise goal statement
status: in-progress
---

# 📋 Ticket Metadata
- **ID**: 123
- **Branch**: `feature/...`
- **Goal**: Concise goal statement
- **Status**: in-progress

# Round 1

## 🔍 Discovery
- **Verdict**: [APPROVED / NEEDS-INFO / REJECTED]
- **Technical Blueprint**: ...

## 🛠️ Development
- **Verdict**: [SUCCESS / BLOCKED]
- **Actions**: ...

## 🛡️ Review
- **Verdict**: [PASS / FAIL]
- **Checklist**: ...

## 🧪 QA
- **Verdict**: [PASS / FAIL]
- **Results**: ...

## 📝 Documentation
- **Verdict**: [COMPLETE]

## 📊 Project
- **Verdict**: [CLOSED]
```

## Agent Specific Workflows

### Discovery (Architecture & Planning)
- **Role:** Read-only consultant. Create blueprints.
- **Mandate:** MUST provide an explicit **Socratic Log** (via `discovery-agent`) followed by a **Test Specification** block with high-level manual and automated test scenarios.
- **Verdict:** Approved -> Dev | Needs-Info -> Round 2 | Rejected -> Close.

### Development (Implementation)
- **Role:** Staff Engineer. Clean, modular code.
- **Verdict:** Success -> Review | Blocked -> Discovery/Manual.
- **Exhaustive Verification:** MUST run `npm run build` and `npm run lint`.

### Review (QA & Security Audit)
- **Role:** Senior Auditor. **READ-ONLY**.
- **Mandate:** MUST NOT modify code. If issues exist, Verdict MUST be "FAIL".
- **Verdict:** Pass -> QA | Fail -> Return to Dev.

### QA (E2E Test Automation & Manual Scripts)
- **Role:** Automation Engineer. **READ-ONLY (except for test files)**.
- **Mandate:** 
  1. **Automation**: Write and execute Playwright/Maestro tests.
  2. **Manual**: Formalize the Discovery test spec into a detailed step-by-step manual test script in `docs/manual_tests/ticket-<id>.md`.
  3. **No App Edits**: MUST NOT modify application source code.
- **Verdict:** Pass -> Documentation | Fail -> Return to Dev.

### Documentation & Project
- **Documentation:** 
  - **Role**: Tech Writer. Finalize feature docs and architectural reports.
  - **Verdict**: [COMPLETE] -> Project.
- **Project Agent:** 
  - **Role**: Project Manager. Finalizes the ticket and creates the PR.
  - **Mandate**: 
    1. **Finalize State**: Update `ticket.md` with final summary; set status to `completed`.
    2. **Shell Operations**: Permitted to run `git add`, `git commit`, `git push`, and `gh pr create`.
    3. **No App Edits**: STRICTLY forbidden from modifying application code (`src/`).
  - **Verdict**: [CLOSED].

## Routing & Pipelines
- **Manual Redirection:** Any **FAIL** or **NEEDS-INFO** verdict requires manual redirection back to Development or Discovery by the user.
- **Single Workflow Mandate:** ALL changes MUST follow this sequence. No 'Fast-Track' to main.
- **Protocol Failure:** Any deviation is a terminal violation and must be corrected immediately.
