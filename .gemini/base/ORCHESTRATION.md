# Agent Orchestration & Workflow

## Core Mandates
- **Strict Initialization:** Before any work begins, the Orchestrator MUST:
  1. Switch to `main` and pull latest (`git checkout main && git pull`).
  2. Create a dedicated feature branch (`feature/<id>-short-description`).
  3. Create a state directory `.gemini/state/ticket-<id>/` with a `MAIN.md` file following the **MAIN.md Template**.
- **Strict Sequential Workflow:** ALL tickets MUST follow this exact sequence:
  `Discovery` -> `Development` -> `Review` -> `QA` -> `Documentation` -> `Project Management`.
- **Phase Termination & Failure Protocol:**
  1. **Atomic Phases:** An agent MUST NOT proceed to the next phase in the sequence. It MUST update the state file, set its **Verdict**, and return control to the Orchestrator.
  2. **Next Step Suggestion:** Upon completing a phase, the agent MUST explicitly suggest the next sub-agent in the sequence to the user (e.g., "Next step: Invoke `dev-agent` for implementation").
  3. **Immediate Stop on Failure:** If any phase (especially `Review` or `QA`) results in a **FAIL** verdict, the current round MUST terminate immediately. No further agents (Doc, Project, etc.) can be invoked in that round.
  4. **Round 2+ Entry Point:** If a round fails during `Review` or `QA`, the subsequent round MUST begin with the `dev-agent` to address the identified issues. The sequence then restarts from `Development`.
- **Human-in-the-Loop Workflow:** ALL transitions between agent phases MUST be mediated by the user. 
  1. **Update State File First:** The active agent MUST update the `ticket.md` file with the results/verdicts before presenting for review.
  2. **Manual Review:** The user reviews the changes and the ticket state.
  3. **Explicit Approval:** The user provides approval to proceed to the *next* phase in the sequence.
- **Traceable Status:** EVERY agent MUST update their section with a clear **Verdict** before handoff.

## E2E Performance Optimization
- **Server Reuse:** To save time, E2E tests are configured to reuse an existing server on port 3005 (`reuseExistingServer: true`).
- **Agent Protocol:** Before running `npx playwright test`, agents SHOULD check if a server is already responding on `http://127.0.0.1:3005`. If it is, they MUST NOT attempt to start another one. If not, they may trigger the test command which will handle the build/start automatically.
- **Background Server:** Agents are permitted to start the E2E server in the background using `run_shell_command(..., is_background: true)` if multiple test runs are expected within a single session.

## State Management & Isolation (Directory-First)
- **Directory Structure:** ALL ticket state MUST be managed within a dedicated directory: `.gemini/state/ticket-<id>/`.
- **Append-Only Mandate:** Agents MUST NOT destructive-overwrite previous entries. They MUST append new actions, findings, or logs to the end of their designated files using the `replace` tool or targeted `write_file` (if creating for the first time).
- **File Isolation Mandate:** Agents MUST NOT overwrite a single shared file. They MUST only write to their designated files within the current round's directory.
- **State Layout:**
  ```
  .gemini/state/ticket-<id>/
  ├── MAIN.md              # Global Metadata, Status, History, and TIMELINE
  ├── round-1/
  │   ├── discovery.md     # Discovery agent only
  │   ├── development.md   # Dev agent only
  │   ├── review.md        # Review agent only
  │   └── qa.md            # QA agent only
  └── round-2/
      ├── development.md
      └── ...
  ```

## MAIN.md Template
```markdown
---
ticket_id: <id>
branch_name: feature/...
goal: Concise goal statement
status: [discovery|development|review|qa|doc|pm]
current_round: 1
---

# 📋 Ticket Metadata
- **ID**: <id>
- **Branch**: `feature/...`
- **Goal**: Concise goal statement
- **Current Status**: in-progress

# 🔄 Round History
- **Round 1**: [FAILED @ Review] - Violated 50-line rule.
- **Round 2**: [IN-PROGRESS]

# 📅 Timeline
- **[YYYY-MM-DD HH:mm:ss]**: Discovery started by `discovery-agent`.
- **[YYYY-MM-DD HH:mm:ss]**: Development completed by `dev-agent`.
- **[YYYY-MM-DD HH:mm:ss]**: Review FAIL: Modularity regression in `page.tsx`.
```


## Agent Specific State Files

### discovery.md
- **Verdict**: [APPROVED / NEEDS-INFO / REJECTED]
- **Socratic Log**: ...
- **Technical Blueprint**: ...
- **Test Specification**: ...

### development.md
- **Verdict**: [SUCCESS / BLOCKED]
- **Summary**: ...
- **Modified Files**: ...
- **Verification Logs**: [Link to build/lint results]

### review.md
- **Verdict**: [PASS / FAIL]
- **Security Audit**: ...
- **Performance Audit**: ...
- **Failures**: [If FAIL, list specific file:line and reason]

### qa.md
- **Verdict**: [PASS / FAIL]
- **Test Results**: [Playwright/Maestro output]
- **Manual Script**: [Link to doc/manual_tests/ticket-<id>.md]

## Phase Termination & Failure Protocol
1. **Atomic Phases:** An agent MUST NOT proceed to the next phase. It MUST update its specific `.md` file in the current `round-N/` folder, update the `status` and `current_round` in `MAIN.md`, and return control.
2. **Failure Recovery:** If `review.md` or `qa.md` results in a **FAIL**, the user MUST trigger a new round. The `dev-agent` will then start by creating `round-(N+1)/` and initializing `development.md`.
3. **Traceable Fixes:** Dev agents in Round 2+ MUST read the previous round's `review.md` or `qa.md` to ensure all reported issues are addressed.


## Agent Specific Workflows

### Discovery (Architecture & Planning)
- **Role:** Read-only consultant. Create blueprints.
- **Mandate:** MUST provide an explicit **Socratic Log** (via `discovery-agent`) followed by a **Test Specification** block with high-level manual and automated test scenarios.
- **Verdict:** Approved -> Dev | Needs-Info -> Round 2 | Rejected -> Close.

### Development (Implementation)
- **Role:** Staff Engineer. Clean, modular code.
- **Verdict:** Success -> Review | Blocked -> Discovery/Manual.
- **Exhaustive Verification:** MUST run `npm run build` and `npm run lint`.
- **Commit Mandate:** After successful verification, the agent MUST present a summary and ask for permission to commit the implementation code before handoff.

### Review (QA & Security Audit)
- **Role:** Senior Auditor. **READ-ONLY**.
- **Mandate:** 
  1. **Security & Quality**: MUST NOT modify code. If issues exist, Verdict MUST be "FAIL".
  2. **Performance Audit**: MUST run a "Web Vitals / Performance Audit" using the `@GoogleChrome/modern-web-guidance` extension. Verify that no deprecated patterns are introduced and that Core Web Vitals (LCP, INP, CLS) are considered.
- **Verdict:** Pass -> QA | Fail -> Return to Dev.

### QA (E2E Test Automation & Manual Scripts)
- **Role:** Automation Engineer. **READ-ONLY (except for test files)**.
- **Mandate:** 
  1. **Automation**: Write and execute Playwright/Maestro tests.
  2. **Manual**: Formalize the Discovery test spec into a detailed step-by-step manual test script in `docs/manual_tests/ticket-<id>.md`.
  3. **No App Edits**: MUST NOT modify application source code.
  4. **Commit Mandate**: After successful verification, the agent MUST present a summary and ask for permission to commit the test files and manual scripts before handoff.
- **Verdict:** Pass -> Documentation | Fail -> Return to Dev.

### Documentation
- **Role**: Tech Writer & Orchestration Architect. Finalize feature docs and optimize instruction layer.
- **Commit Mandate**: After finishing documentation, the agent MUST present a summary and ask for permission to commit the docs.
- **Orchestration Audit**: The agent MUST periodically run the `orchestration-auditor` skill to identify contradictions or redundancies in `GEMINI.md` and `.gemini/base/*.md`.
- **Incidental Check**: After committing, the agent MUST read `.gemini/incidental_observations.json`.
  - If **Observations exist**: Suggest invoking `project-agent` to resolve them.
  - If **No Observations exist**: Suggest the **User** for final PR creation.
- **Verdict**: [COMPLETE].

### Project Agent
- **Role**: Issue Architect. Specialized in resolving technical debt and requirement refinement.
- **Mandate**: 
  1. **Direct Requests**: Can be invoked by the **User** at any time to create, update, or refine GitHub issues, even outside the standard ticket sequence.
  2. **Incidental Resolution**: When invoked during the ticket lifecycle, it MUST read `.gemini/incidental_observations.json`. For each observation, verify the issue and create a new GitHub issue if appropriate. CLEAR the file (`[]`) after resolution.
  3. **Issue Enhancement**: When creating issues, the agent should include technical context, suggested implementation paths, and labels/priorities.
  4. **Next Step**: After processing requests or observations, suggest the **User** for the next logical step (e.g., final PR creation or returning to another task).
- **No App Edits**: STRICTLY forbidden from modifying application code (`src/`).
- **Verdict**: [ISSUES-MANAGED].

## Incidental Observations Protocol
- **Purpose**: To capture bugs, technical debt, or optimization opportunities discovered *outside* the scope of the current ticket without derailing the primary task.
- **Logging**: Any agent (Dev, Review, QA, etc.) that discovers an incidental issue MUST append it to `.gemini/incidental_observations.json`. 
- **Format**: 
  ```json
  {
    "id": "OBS-<timestamp>",
    "discovery_agent": "dev-agent",
    "observation": "Brief description of the issue",
    "file": "path/to/file:line",
    "severity": "low/medium/high"
  }
  ```
- **Resolution**: The **Project Agent** is responsible for processing this file.

## Human-Centric Closure
- **Role**: User (Human).
- **Mandate**: The user performs the final project synchronization and PR creation.
- **Steps**:
  1. Final review of the `.gemini/state/ticket-<id>/` directory.
  2. `git add .gemini/state/ticket-<id>/ && git commit -m "docs: finalize ticket <id> state"`.
  3. `git push origin feature/<branch>`.
  4. `gh pr create --title "..." --body "..."`.


## Routing & Pipelines

- **Manual Redirection:** Any **FAIL** or **NEEDS-INFO** verdict requires manual redirection back to Development or Discovery by the user.
- **Single Workflow Mandate:** ALL changes MUST follow this sequence. No 'Fast-Track' to main.
- **Protocol Failure:** Any deviation is a terminal violation and must be corrected immediately.
