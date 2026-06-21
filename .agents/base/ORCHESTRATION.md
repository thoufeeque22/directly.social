# Agent Orchestration & Workflow

> **MANDATORY:** All agents MUST use the centralized constants and patterns defined in [VARIABLES.md](VARIABLES.md). NEVER hardcode strings for branch names, state directories, verdicts, or commands.

## Core Mandates
- **Local Model Offloading (Zero Token Exhaustion Policy):** The Main Orchestrator and all sub-agents MUST aggressively offload high-token, repetitive, or read-heavy tasks to local models via `ollama_chat` or the `cavecrew` subagents. The cloud orchestrator MUST act strictly as a high-level manager.
  - **Large Context / Whole-File Reviews (Audit Agent):** Use `qwen-coder-64k:latest` (64k context for large files/logs).
  - **Heavy Implementation / Deep Reasoning (Architect/Discovery):** Use `deepseek-coder-v2` or `llama3.1:70b`.
  - **Fast, Surgical Edits / Boilerplate (Dev Agent/Cavecrew Builder):** Use `qwen2.5-coder:1.5b` or `phi3.5`.
  - **Code Generation & Test Writing (QA/Doc Agent):** Use `codestral`.
  - **General Purpose / Reasoning Fallback:** Use `llama3.1:8b` or `gemma4:latest`.
- **Real-Time Auditing (Cavecrew Watcher):** The Orchestrator MUST schedule a background loop (using `phi3.5` or `qwen2.5-coder:1.5b`) to continuously monitor file saves and provide 1-line real-time architectural warnings *as code is written*, rather than waiting for the formal Audit phase.
- **Active Inquisitiveness (Collaborative Inquiry):** AI agents MUST act as collaborative partners, not just execution machines. If any request, requirement, or technical path is ambiguous, the agent MUST stop and ask the user for clarification before proceeding. "Guessing" is a terminal violation.
- **Strict Initialization:** Before any work begins, the Orchestrator MUST follow this **Dependency Rule**: `Ticket Description -> Git Branch -> State Directory`.
  1. Fetch the ticket description (body) from GitHub (e.g., using `mcp_github_get_issue`).
  2. Check the current branch. If NOT on the target feature branch (`FEATURE_BRANCH_PATTERN`):
     a. Switch to `MAIN_BRANCH` and pull latest (`git checkout main && git pull`).
     b. Create the dedicated feature branch (`git checkout -b <FEATURE_BRANCH_PATTERN>`).
  3. **MANDATORY:** Verify the branch exists and matches the full slug before proceeding.
  4. Create a state directory `TICKET_STATE_DIR` with a `MAIN_STATE_FILE` file following the **MAIN_STATE_FILE Template**.
  5. **MANDATORY:** The `MAIN_STATE_FILE` MUST contain the final, resolved `branch_name`. **NEVER** use placeholders or patterns like `FEATURE_BRANCH_PATTERN` in the final file.
  6. Skip if state already exists.
- **Manual Environment Management:** The User always manages the development server (`pnpm dev`), the E2E test server (`http://localhost:3000`), and network tunnels (e.g., `tailscale funnel`) manually. AI agents MUST NOT attempt to start, restart, check the connectivity of these services, or modify/enable any Playwright `webServer` configuration. ALL E2E tests are strictly bound to `http://localhost:3000`.
- **Strict Sequential Workflow:** ALL tickets MUST follow the `PHASE_ORDER`.
- **Guardrail Mandates (Terminal Violations):**
  1. **Issue-First Protocol:** Before starting any work, the Orchestrator MUST ensure a corresponding GitHub issue exists. If the task is new or doesn't have an ID, the Orchestrator MUST invoke the `project-agent` to create the issue FIRST.
  2. **No Direct Main Push:** AI agents are STRICTLY FORBIDDEN from merging into or pushing directly to the `MAIN_BRANCH`. ALL code changes MUST live on a dedicated feature branch (`FEATURE_BRANCH_PATTERN`).
  3. **PR-Only Handoff:** The final handoff to the user MUST be for **Pull Request creation**. The agent must never perform the final merge locally.
  4. **State-First Protocol:** NEVER start work without initializing the state directory and `MAIN_STATE_FILE`.
- **Phase Termination & Failure Protocol:**
  1. **Atomic Phases:** An agent MUST NOT proceed to the next phase in the sequence. It MUST update the state file, set its **Verdict**, and return control to the Orchestrator.
  2. **Next Step Suggestion:** Upon completing a phase, the agent MUST explicitly suggest the next sub-agent in the sequence to the user (e.g., "Next step: Invoke `discovery-agent` for technical planning").
  3. **Immediate Stop on Failure:** If any phase (especially `Audit` or `QA`) results in a **FAIL** verdict, the current round MUST terminate immediately. No further agents (Doc, Project, etc.) can be invoked in that round.
  4. **Round 2+ Entry Point:** If a round fails during `Audit` or `QA`, the subsequent round MUST begin with the `dev-agent` to address the identified issues. The sequence then restarts from `Development`.
- **Human-in-the-Loop Workflow (HARD STOP):** ALL transitions between agent phases MUST be mediated by the user. **The Orchestrator MUST immediately HALT execution and return control to the User after a phase's state file (e.g., `development.md`) is written. The Orchestrator is STRICTLY FORBIDDEN from automatically chaining to the next phase (e.g., jumping from Dev to Audit) or running multiple sub-agents in a single turn without explicit user approval. This applies universally, even to autonomous teamwork systems.**
  1. **Inquiry-First Protocol:** The initial turn of any planning agent (`Product`, `Discovery`) SHOULD focus on asking questions to resolve ambiguity. If the agent is in doubt, it MUST set its Verdict to **NEEDS-INFO** and present its questions to the user.
  2. **State-First Protocol (Robust Updates):** Agents MUST update the state directory BEFORE terminating. To prevent shell escaping issues or command length limits, agents MUST:
     a. Write their full report/content to a temporary file (e.g., `.ai-state/tmp/report.md`).
     b. Execute the `STATE_UPDATE_CMD` using the `--file` parameter to point to that temporary file.
     c. Verify the update by checking the targeted markdown file in `TICKET_STATE_DIR`.
  3. **Manual Review:** The user reviews the changes and the ticket state.
  4. **Explicit Approval & Auto-Commit:** When the User provides approval to proceed to the *next* phase (e.g., "Invoke discovery-agent"), the Orchestrator MUST automatically commit any pending changes from the current phase before starting the next one. The commit message MUST follow the `COMMIT_MSG_PATTERN` (e.g., `feat(ticket-400): complete product phase - defined UX layout`), derived from the `MAIN_STATE_FILE` status or the summary of the completed phase. This commit is implicitly approved by the user's directive to proceed.
- **Traceable Status:** EVERY agent MUST update their section with a clear **Verdict** before handoff.

## Tiered Testing Strategy
To maintain speed and context efficiency, the project uses a tiered testing model based on tags (`@smoke`, `@regression`):

- **Smoke Suite (`@smoke`):** Critical paths only (Login, Main Dashboard load, Core Upload start). Must take < 60 seconds.
- **Regression Suite (`@regression`):** Broad feature coverage (Settings, AI generation, Gallery, Filtering).
- **Full Suite:** The complete test directory, including long-running E2E and edge-case unit tests.

### Agent Test Mandates
- **dev-agent:** MUST use the `ARCHITECT_SKILL` for all changes. MUST run `SMOKE_TEST_CMD` and `LINT_CMD`.
  - **Fast-Track Verification:** If the user explicitly requests to save time or if in a fast-iteration loop, the agent MAY skip `BUILD_CMD` IF they have already run it once for the current set of changes and no relevant files have changed.
- **audit-agent:** READ-ONLY. Focus on Security, Privacy (PII), and Performance (Web Vitals) audits.
- **qa-agent:** MUST run `REGRESSION_TEST_CMD`. For features with specific impact, they may also run relevant individual tests.
- **Human-in-the-Loop:** The **User** SHOULD run the full suite (`pnpm test`) before the final merge.

### package.json Scripts (Implementation)
- `test:smoke`: `SMOKE_TEST_CMD`
- `test:regression`: `REGRESSION_TEST_CMD`

## State Management & Artifacts
- **Native Artifacts:** Instead of manually executing `npm run state:update` and writing to `MAIN_STATE_FILE` and `.agents/tmp/` files, ALL ticket state and agent reports MUST be tracked using Agy's native Artifact system.
- **State Updates:** To complete a phase, an agent MUST use the `write_to_file` tool to create or update an artifact markdown file in the artifact directory (`<appDataDir>/brain/<conversation-id>/`). The file MUST be created with `ArtifactMetadata` containing `RequestFeedback: true`.
  - **Why?** Using `RequestFeedback: true` will natively pause the Orchestrator and present a UI to the user to "Proceed" or reject the phase transition, fulfilling the strict Human-in-the-Loop requirement without brittle shell scripts.
- **Transient Files:** ANY temporary scratch files MUST be written to the `<appDataDir>/brain/<conversation-id>/scratch/` directory.

## Artifact Template Guidelines
Each phase must produce a comprehensive Artifact (e.g. `product_spec.md`, `discovery_blueprint.md`, `development_report.md`).
The Artifact MUST contain:
1. **Verdict**: [APPROVED / NEEDS-INFO / REJECTED / PASS / FAIL / BLOCKED / SUCCESS]
2. **Current Round**: The current iteration number.
3. **Phase-Specific Data**: (e.g. Socratic Log, Root Cause Analysis, Gap Analysis).

### Development Artifact Requirements
- **Verdict**: [SUCCESS / BLOCKED]
- **Root Cause Analysis (Round 2+ only)**: Explicitly identify WHY the previous round was rejected.
- **Remediation Strategy (Round 2+ only)**: Detail the specific changes made to address the failure and prevent regression.
- **Summary**: ...

### Audit/QA Artifact Requirements
- **Verdict**: [PASS / FAIL]
- **Gap Analysis (Round 2+ only)**: Analyze why previous checks failed or were missed.
- **Failures**: [If FAIL, list specific file:line and reason]

## Phase Termination & Failure Protocol
1. **Native Pause:** An agent MUST NOT proceed to the next phase autonomously. It MUST write its final artifact using `RequestFeedback: true` and then return control.
2. **Failure Recovery:** If an `audit` or `qa` artifact results in a **FAIL**, the user will trigger a new round by explicitly invoking the `dev-agent` again.
3. **Traceable Fixes:** Dev agents in Round 2+ MUST read the previous round's `audit` or `qa` artifact from the conversation context to ensure all reported issues are addressed.


## Agent Specific Workflows

### Product (Design & Benchmarking)
- **Role:** Product Designer & UX Strategist.
- **Mandate:** MUST research industry standards and competitive benchmarks (using `google_web_search` or `web_fetch`). MUST define the optimal UX flow and UI placement BEFORE any technical planning occurs.
- **Verdict:** Approved -> Discovery | Needs-Info -> Round 2.

### Discovery (Architecture & Planning)
- **Role:** Read-only consultant and rigorous interrogator. Create blueprints.
- **Mandate:** MUST grill the user and ask deep and thorough questions to resolve all ambiguities before drafting blueprints. MUST provide an explicit **Socratic Log** (via `discovery-agent`) followed by a **Test Specification** block with high-level manual and automated test scenarios.
- **NotebookLM Synthesis:** For tickets involving complex integrations, legacy refactors, or deep architectural changes, the agent SHOULD recommend a NotebookLM synthesis step. Use `pnpm run notebook:package` to bundle context for high-fidelity research.
- **Verdict:** Approved -> QA | Needs-Info -> Round 2 | Rejected -> Close.

### QA (E2E Test Automation & Manual Scripts - Test-Driven Flip)
- **Role:** Automation Engineer. **READ-ONLY (except for test files)**.
- **Mandate:** 
  1. **Automation:** Write and execute Playwright/Maestro tests *based on the Discovery spec BEFORE development begins*. The tests will initially fail, giving Dev a strict finish line.
  2. **Manual:** Formalize the Discovery test spec into a detailed step-by-step manual test script in `MANUAL_TEST_FILE_PATTERN`.
  3. **No App Edits:** MUST NOT modify application source code (`src/`).
- **Verdict:** Spec Complete -> Dev | Fail -> Return to Discovery.

### Development (Implementation)
- **Role:** Staff Engineer. Clean, modular code.
- **Mandate:** MUST execute all implementation via the `ARCHITECT_SKILL`. This ensures that every change is validated through mandatory **Object-Oriented Design**, **Clean Architecture**, and **API Design** review loops. MUST aggressively offload file edits and boilerplate to `cavecrew-builder` or local `ollama_chat`.
- **Verdict:** Success -> Audit | Blocked -> Discovery/Manual.
- **Exhaustive Verification:** MUST run `BUILD_CMD`, `LINT_CMD`, and `TYPE_CHECK_CMD`. **MANDATORY:** When encountering bulk lint or build errors, the agent MUST use the `triage-lint` skill to fix them in manageable batches rather than overwhelming the context window.
- **Dependencies Management:** When adding new dependencies to `package.json`, the agent MUST use `pnpm install <package>` to ensure `pnpm-lock.yaml` is correctly updated. NEVER use `npm`.
- **Aesthetic Validation:** MUST verify MUI component prop compliance (e.g., using `sx` for styling) to prevent React attribute warnings.

### Audit (Security & Performance Audit)
- **Role:** Senior Auditor. **READ-ONLY**.
- **Mandate:** 
  1. **Security & Quality:** MUST NOT modify code. If issues exist, Verdict MUST be "FAIL". MUST perform all heavy code reviews, log analysis, and architectural gap checks using the `ollama_chat` tool or `cavecrew-reviewer` to avoid burning cloud context on large diffs.
  2. **Performance Audit:** MUST run a "Web Vitals / Performance Audit" using the `@GoogleChrome/modern-web-guidance` extension. Verify that no deprecated patterns are introduced and that Core Web Vitals (LCP, INP, CLS) are considered.
- **Verdict:** Pass -> Documentation | Fail -> Return to Dev.

### Documentation
- **Role**: Tech Writer & Orchestration Architect. Finalize feature docs and optimize instruction layer.
- **Orchestration Audit**: The agent MUST periodically run the `AUDITOR_SKILL` to identify contradictions or redundancies in `GEMINI.md` and `.agents/base/*.md`.
- **Incidental Check**: After finishing work, the agent MUST read `OBSERVATIONS_FILE`.
  - If **Observations exist**: Suggest invoking `project-agent` to resolve them.
  - If **No Observations exist**: Suggest the **User** for final PR creation.
- **Verdict**: [COMPLETE].

### Project Agent
- **Role**: Issue Architect. Specialized in resolving technical debt and requirement refinement.
- **Mandate**: 
  1. **Direct Requests**: Can be invoked by the **User** at any time to create, update, or refine GitHub issues, even outside the standard ticket sequence.
  2. **Incidental Resolution**: When invoked during the ticket lifecycle, it MUST read `OBSERVATIONS_FILE`. For each observation, verify the issue and create a new GitHub issue if appropriate. CLEAR the file (`[]`) after resolution.
  3. **Issue Enhancement**: When creating issues, the agent should include technical context, suggested implementation paths, and labels/priorities.
  4. **Next Step**: After processing requests or observations, suggest the **User** for the next logical step (e.g., final PR creation or returning to another task).
- **No App Edits**: STRICTLY forbidden from modifying application code (`src/`).
- **Verdict**: [ISSUES-MANAGED].

## Incidental Observations Protocol
- **Purpose**: To capture bugs, technical debt, or optimization opportunities discovered *outside* the scope of the current ticket without derailing the primary task.
- **Logging**: Any agent (Dev, Review, QA, etc.) that discovers an incidental issue MUST append it to `OBSERVATIONS_FILE`. 
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
  1. Final review of the `TICKET_STATE_DIR` directory.
  2. `git add TICKET_STATE_DIR && git commit -m "docs: finalize ticket <id> state"`.
  3. `git push origin <FEATURE_BRANCH_PATTERN>`.
  4. `gh pr create --title "..." --body "..."`.


## Routing & Pipelines

- **Manual Redirection:** Any **FAIL** or **NEEDS-INFO** verdict requires manual redirection back to Development or Discovery by the user.
- **Single Workflow Mandate:** ALL changes MUST follow this sequence. No 'Fast-Track' to main.
- **Protocol Failure:** Any deviation is a terminal violation and must be corrected immediately.
