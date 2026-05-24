# Social Studio App: Agent Instructions & Standards

This document serves as the root entry point for all AI agents. It defines the global mandates and links to domain-specific standards.

## Global Mandates

- **Zero-Any Policy:** Strict TypeScript enforcement across the entire codebase.
- **Modularity (50-Line Rule):** New files must be ≤ 50 lines. Logic from legacy files must be extracted.
- **Human-Centric UI:** Prioritize accessibility, professional aesthetics (MUI), and no emojis.
- **Production Readiness:** Every feature must include robust error handling, security, and observability.
- **Context Preservation:** Agents must never destructively overwrite state files.

## Table of Contents

1.  **[Core Technical Standards](.gemini/base/CORE.md)**
    *   Next.js 15 & React 19 conventions.
    *   TypeScript strictness and TSX standards.
    *   Modularity and Legacy Debt Remediation.
2.  **[UI & Aesthetic Standards](.gemini/base/UI_UX.md)**
    *   Material UI (MUI) usage and Iconography.
    *   Accessibility (A11y) and Visual Integrity.
    *   Strict "No Emojis" policy.
3.  **[Production & Infrastructure](.gemini/base/PRODUCTION.md)**
    *   Performance, Security, and Observability.
    *   Neon Database branch management and cleanup.
4.  **[Agent Orchestration & Workflow](.gemini/base/ORCHESTRATION.md)**
    *   Agent roles and specific workflows.
    *   Discovery Definition of Ready (DoR).
    *   Handoff protocols, State Pruning, and Pipeline routing.

---

*Agents MUST read the relevant base files before starting any task.*
