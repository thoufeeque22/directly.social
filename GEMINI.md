# <BRAND.name> App: Agent Instructions & Standards

This document serves as the root entry point for all AI agents. It defines the global management policies and links to domain-specific standards.

## Global Management Policies

- **Phase Throttling (Human-in-the-Loop):** The Orchestrator MUST terminate its turn after calling exactly one sub-agent. NEVER chain sub-agents autonomously. ALL transitions between phases (`Discovery` -> `Dev` -> `Review` -> `QA` -> `Doc` -> `Project`) MUST be approved by the user.
- **State-First Protocol:** Before invoking any sub-agent or performing any action, the Orchestrator MUST create or update the Markdown state file in `.gemini/state/ticket-<id>/MAIN.md`.
- **Initialization Precedence:** Every new ticket MUST follow the **Strict Initialization** workflow defined in [ORCHESTRATION.md](.gemini/base/ORCHESTRATION.md). This includes conditional branch synchronization and state directory creation.
- **Explicit Commit Permission & Auto-Handoff:** AI agents MUST NOT commit changes without user permission, EXCEPT during phase handoffs. As defined in [ORCHESTRATION.md](.gemini/base/ORCHESTRATION.md), the Orchestrator automatically checkpoints changes upon handoff approval using dynamic messaging.
- **Verification Integrity:** Local verification MUST be exhaustive (e.g., `npm run build`, `npm run lint`). NEVER use 'surgical' or 'token-optimized' checks unless explicitly instructed by the user.
- **Technical Excellence:** ALL code MUST adhere to the standards in [CORE.md](.gemini/base/CORE.md) (TypeScript Zero-Any, 100-Line Modularity, Centralized Schemas, Swagger Docs). **MANDATORY:** Invoke the `arxitect:architect` skill for ALL new feature implementations and refactors, regardless of size, to ensure design integrity via multi-persona review loops.
- **Aesthetic Integrity:** ALL UI MUST adhere to the standards in [UI_UX.md](.gemini/base/UI_UX.md) (MUI, Theme Awareness, No Emojis).
- **Manual Environment Management:** The User manages the dev server, the E2E test server (http://localhost:3000), and tunnels manually. Agents MUST NOT interfere, as defined in [ORCHESTRATION.md](.gemini/base/ORCHESTRATION.md).
- **Context Preservation:** Agents must never destructively overwrite state files.

## Table of Contents

1.  **[Core Technical Standards](.gemini/base/CORE.md)**
    *   TypeScript Zero-Any & Next.js 15 conventions.
    *   Modularity (100-Line Rule) & Legacy Debt Remediation.
    *   Centralized Schemas & API Documentation.
2.  **[UI & Aesthetic Standards](.gemini/base/UI_UX.md)**
    *   Material UI (MUI) usage & Theme Awareness.
    *   Accessibility (A11y) & Strict "No Emojis" policy.
    *   Modular Form Standards.
3.  **[Production & Infrastructure](.gemini/base/PRODUCTION.md)**
    *   Performance, Security, and Observability.
    *   Neon Database branch management.
4.  **[Agent Orchestration & Workflow](.gemini/base/ORCHESTRATION.md)**
    *   Initialization logic & Git Branching.
    *   Phase Sequence, Failure Protocols, & Auto-Commit.
    *   Agent-specific mandates & Isolation.
5.  **[Global Variables & Constants](.gemini/base/VARIABLES.md)**
    *   Centralized strings for branching, state, and commands.
    *   Mandatory source of truth for workflow patterns.

---

*Agents MUST read the relevant base files before starting any task.*
