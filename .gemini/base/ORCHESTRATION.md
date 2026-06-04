# Agent Orchestration & Workflow

## Core Mandates
- **Active Inquisitiveness (Collaborative Inquiry):** AI agents MUST act as collaborative partners, not just execution machines. If any request, requirement, or technical path is ambiguous, the agent MUST stop and ask the user for clarification before proceeding. "Guessing" is a terminal violation.
- **Strict Initialization:** Before any work begins, the Orchestrator MUST:
  1. Fetch the ticket description (body) from GitHub (e.g., using `mcp_github_get_issue`).
  2. Check the current branch. If NOT on the target feature branch (`feature/<id>-...`):
     a. Switch to `main` and pull latest (`git checkout main && git pull`).
     b. Create the dedicated feature branch (`git checkout -b feature/<id>-<desc>`).
  3. If ALREADY on the target feature branch, skip the `main` synchronization and branch creation steps.
  4. Create a state directory `.gemini/state/ticket-<id>/` with a `MAIN.md` file following the **MAIN.md Template** (skip if state already exists).
- **Manual Environment Management:** The User always manages the development server (`npm run dev`) and network tunnels (e.g., `tailscale funnel`) manually. AI agents MUST NOT attempt to start, restart, or check the connectivity of these services.
- **Strict Sequential Workflow:** ALL tickets MUST follow this exact sequence:
  `Product` -> `Discovery` -> `Development` -> `Audit` -> `QA` -> `Documentation`.
- **Guardrail Mandates (Terminal Violations):**
  1. **Issue-First Protocol:** Before starting any work, the Orchestrator MUST ensure a corresponding GitHub issue exists. If the task is new or doesn't have an ID, the Orchestrator MUST invoke the `project-agent` to create the issue FIRST.
  2. **No Direct Main Push:** AI agents are STRICTLY FORBIDDEN from merging into or pushing directly to the `main` branch. ALL code changes MUST live on a dedicated feature branch (`feature/<id>-...`).
  3. **PR-Only Handoff:** The final handoff to the user MUST be for **Pull Request creation**. The agent must never perform the final merge locally.
  4. **State-First Protocol:** NEVER start work without initializing the state directory and `MAIN.md`.
- **Phase Termination & Failure Protocol:**
  1. **Atomic Phases:** An agent MUST NOT proceed to the next phase in the sequence. It MUST update the state file, set its **Verdict**, and return control to the Orchestrator.
  2. **Next Step Suggestion:** Upon completing a phase, the agent MUST explicitly suggest the next sub-agent in the sequence to the user (e.g., "Next step: Invoke `discovery-agent` for technical planning").
  3. **Immediate Stop on Failure:** If any phase (especially `Audit` or `QA`) results in a **FAIL** verdict, the current round MUST terminate immediately. No further agents (Doc, Project, etc.) can be invoked in that round.
  4. **Round 2+ Entry Point:** If a round fails during `Audit` or `QA`, the subsequent round MUST begin with the `dev-agent` to address the identified issues. The sequence then restarts from `Development`.
- **Human-in-the-Loop Workflow:** ALL transitions between agent phases MUST be mediated by the user. 
  1. **Inquiry-First Protocol:** The initial turn of any planning agent (`Product`, `Discovery`) SHOULD focus on asking questions to resolve ambiguity. If the agent is in doubt, it MUST set its Verdict to **NEEDS-INFO** and present its questions to the user.
  2. **Update State File ONLY via Hook:** The active agent MUST execute the state manager hook (see below) to update `MAIN.md` and their round-specific file. Agents are STRICTLY FORBIDDEN from manually editing these files using `write_file` or `replace` tools.
  3. **Manual Review:** The user reviews the changes and the ticket state.
  4. **Explicit Approval & Auto-Commit:** When the User provides approval to proceed to the *next* phase (e.g., "Invoke discovery-agent"), the Orchestrator MUST automatically commit any pending changes from the current phase before starting the next one. The commit message MUST be dynamic and descriptive (e.g., `feat(ticket-400): complete product phase - defined UX layout`), derived from the `MAIN.md` status or the summary of the completed phase. This commit is implicitly approved by the user's directive to proceed.
- **Traceable Status:** EVERY agent MUST update their section with a clear **Verdict** before handoff.

## Tiered Testing Strategy
To maintain speed and context efficiency, the project uses a tiered testing model based on tags (`@smoke`, `@regression`):

- **Smoke Suite (`@smoke`):** Critical paths only (Login, Main Dashboard load, Core Upload start). Must take < 60 seconds.
- **Regression Suite (`@regression`):** Broad feature coverage (Settings, AI generation, Gallery, Filtering).
- **Full Suite:** The complete test directory, including long-running E2E and edge-case unit tests.

### Agent Test Mandates
- **dev-agent:** MUST use the `arxitect:architect` skill for all changes. MUST run `npm run test:smoke` and `npm run lint`.
- **audit-agent:** READ-ONLY. Focus on Security, Privacy (PII), and Performance (Web Vitals) audits.
- **qa-agent:** MUST run `npm run test:regression`. For features with specific impact, they may also run relevant individual tests.
- **Human-in-the-Loop:** The **User** SHOULD run the full suite (`npm test`) before the final merge.

### package.json Scripts (Implementation)
- `test:smoke`: `npx playwright test --grep @smoke`
- `test:regression`: `npx playwright test --grep @regression`

## State Management & Isolation (Hook-Only)
- **Directory Structure:** ALL ticket state MUST be managed within a dedicated directory: `.gemini/state/ticket-<id>/`.
- **State Manager Hook:** Agents MUST NOT manually edit `MAIN.md` or their individual round files. Instead, agents MUST execute the state manager hook as their final action:
  `npm run state:update -- --agent="dev" --verdict="SUCCESS" --summary="<SHORT_TIMELINE_SUMMARY>" --content="<FULL_REPORT_CONTENT>" [--status="audit"]`
  *The script will automatically update the `MAIN.md` timeline and append your content to the correct `round-<N>` file.*
  - **TIMELINE SUMMARY:** A concise, one-line summary of the milestone for the `MAIN.md` timeline.
  - **FULL CONTENT:** The **entire** generated report/blueprint/audit for that phase. This ensures context persistence for subsequent agents in the round file.
- **State Layout:****

  ```
  .gemini/state/ticket-<id>/
  ├── MAIN.md              # Global Metadata, Status, History, and TIMELINE
  ├── round-1/
  │   ├── product.md       # Product agent only
  │   ├── discovery.md     # Discovery agent only
  │   ├── development.md   # Dev agent only
  │   ├── audit.md         # Audit agent only
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
status: [product|discovery|development|audit|qa|doc|pm]
current_round: 1
---

# 📋 Ticket Metadata
- **ID**: <id>
- **Branch**: `feature/...`
- **Goal**: Concise goal statement
- **Current Status**: in-progress

# 📝 Ticket Description
<INSERT_FULL_ISSUE_BODY_HERE>

# 🔄 Round History
- **Round 1**: [FAILED @ Audit] - Violated 100-line rule.
- **Round 2**: [IN-PROGRESS]

# 📅 Timeline
- **[YYYY-MM-DD HH:mm:ss]**: Product phase started by `product-agent`.
- **[YYYY-MM-DD HH:mm:ss]**: Discovery started by `discovery-agent`.
- **[YYYY-MM-DD HH:mm:ss]**: Development completed by `dev-agent`.
- **[YYYY-MM-DD HH:mm:ss]**: Audit FAIL: Modularity regression in `page.tsx`.
```


## Agent Specific State Files

### product.md
- **Verdict**: [APPROVED / NEEDS-INFO / REJECTED]
- **UX Strategy**: Analysis of the best solution/flow.
- **Industry Standards**: Research on competitive benchmarks.
- **UI Layout**: Detailed instructions on element placement.

### discovery.md
- **Verdict**: [APPROVED / NEEDS-INFO / REJECTED]
- **Feedback Analysis (Round 2+ only)**: Analyze why the previous blueprint was rejected or revised.
- **Technical Blueprint**: Architecture based on the Product Spec.
- **Test Specification**: ...

### development.md
- **Verdict**: [SUCCESS / BLOCKED]
- **Root Cause Analysis (Round 2+ only)**: Explicitly identify WHY the previous round was rejected (e.g., "Violated 100-line rule").
- **Remediation Strategy (Round 2+ only)**: Detail the specific changes made to address the failure and prevent regression.
- **Summary**: ...

### audit.md
- **Verdict**: [PASS / FAIL]
- **Audit Gap Analysis (Round 2+ only)**: If the previous audit was overridden or if QA found issues missed here, analyze the gap in the audit protocol.
- **Security Audit**: ...
- **Performance Audit**: ...
- **Failures**: [If FAIL, list specific file:line and reason]

### qa.md
- **Verdict**: [PASS / FAIL]
- **Test Gap Analysis (Round 2+ only)**: If a bug was found manually that this suite missed, identify the missing test scenario.
- **Test Results**: [Playwright/Maestro output]
- **Manual Script**: [Link to doc/manual_tests/ticket-<id>.md]

## Phase Termination & Failure Protocol
1. **Atomic Phases:** An agent MUST NOT proceed to the next phase. It MUST execute the state manager hook to update the `status` and `current_round` in `MAIN.md` and record its progress, then return control.
2. **Failure Recovery:** If `audit.md` or `qa.md` results in a **FAIL**, the user MUST trigger a new round. The `dev-agent` will then start by creating `round-(N+1)/` and initializing `development.md`.
3. **Traceable Fixes:** Dev agents in Round 2+ MUST read the previous round's `audit.md` or `qa.md` to ensure all reported issues are addressed.


## Agent Specific Workflows

### Product (Design & Benchmarking)
- **Role:** Product Designer & UX Strategist.
- **Mandate:** MUST research industry standards and competitive benchmarks (using `google_web_search` or `web_fetch`). MUST define the optimal UX flow and UI placement BEFORE any technical planning occurs.
- **Verdict:** Approved -> Discovery | Needs-Info -> Round 2.

### Discovery (Architecture & Planning)
- **Role:** Read-only consultant and rigorous interrogator. Create blueprints.
- **Mandate:** MUST grill the user and ask deep and thorough questions to resolve all ambiguities before drafting blueprints. MUST provide an explicit **Socratic Log** (via `discovery-agent`) followed by a **Test Specification** block with high-level manual and automated test scenarios.
- **NotebookLM Synthesis:** For tickets involving complex integrations, legacy refactors, or deep architectural changes, the agent SHOULD recommend a NotebookLM synthesis step. Use `npm run notebook:package` to bundle context for high-fidelity research.
- **Verdict:** Approved -> Dev | Needs-Info -> Round 2 | Rejected -> Close.

### Development (Implementation)
- **Role:** Staff Engineer. Clean, modular code.
- **Mandate:** MUST execute all implementation via the `arxitect:architect` skill. This ensures that every change is validated through mandatory **Object-Oriented Design**, **Clean Architecture**, and **API Design** review loops before the phase is considered complete.
- **Verdict:** Success -> Audit | Blocked -> Discovery/Manual.
- **Exhaustive Verification:** MUST run `npm run build` and `npm run lint`.

### Audit (QA & Security Audit)
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
- **Verdict:** Pass -> Documentation | Fail -> Return to Dev.

### Documentation
- **Role**: Tech Writer & Orchestration Architect. Finalize feature docs and optimize instruction layer.
- **Orchestration Audit**: The agent MUST periodically run the `orchestration-auditor` skill to identify contradictions or redundancies in `GEMINI.md` and `.gemini/base/*.md`.
- **Incidental Check**: After finishing work, the agent MUST read `.gemini/incidental_observations.json`.
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
