---
name: orchestration-auditor
description: Audit and optimize the project's AI orchestration and instruction files. Use this skill to identify contradictions, redundancies, and friction points in GEMINI.md, .gemini/base/*.md, and agent definitions.
---

# Orchestration Auditor

This skill provides a systematic workflow for auditing and optimizing the AI instruction layer of the project.

## Core Objectives

1.  **Detect Contradictions**: Identify rules in different files that conflict with each other.
2.  **Remove Redundancy**: Prune duplicate instructions to minimize context usage.
3.  **Identify Friction**: Analyze `incidental_observations.json` to find recurring issues in the workflow.
4.  **Align Agents**: Ensure agent-specific workflows in `.gemini/agents/` are consistent with global mandates in `GEMINI.md`.
5.  **High Threshold for Change**: Do NOT propose updates for superficial formatting, minor phrasing, or theoretical micro-optimizations. However, DO use your intelligence to propose major architectural or operational shifts if you identify a significant systemic inefficiency, a critical risk, or a substantial opportunity for improvement, even if not yet logged in `incidental_observations.json`. Only initiate a refactor for changes that provide high structural value.

## Workflow

### 1. Survey the Instruction Layer
Read the current state of all primary instruction files:
- `./GEMINI.md` (Root mandates)
- `.gemini/base/CORE.md` (Technical standards)
- `.gemini/base/ORCHESTRATION.md` (Workflow mandates)
- `.gemini/base/UI_UX.md` (Aesthetic standards)
- `.gemini/base/PRODUCTION.md` (Infrastructure standards)
- `.gemini/agents/base/*.md` (Agent-specific instructions)

### 2. Analyze Friction Points
Read `.gemini/incidental_observations.json`. Look for:
- "Agent was confused by rule X"
- "Rule Y is outdated"
- "Workflow step Z is redundant"

### 3. Identify Contradictions & Redundancies
Compare files to find:
- Rules that exist in multiple files (Redundancy).
- Rules that provide different instructions for the same task (Contradiction).
- Rules that are no longer applicable to the current tech stack.

### 4. Propose Improvements
Create a "System Refactor" plan. This plan should:
- List the specific rules to be deleted, moved, or merged.
- Explain the rationale for each change (e.g., "Merging duplicate TS rules into CORE.md").
- **Constraint**: Never delete a security-related rule without explicit user confirmation.
- **Constraint**: Respect the High Threshold for Change. Discard superficial tweaks.

### 5. Execute & Verify
Apply the changes using `replace` or `write_file`.
Verify that the remaining instructions are cohesive and lean.

## Best Practices
- **Single Source of Truth**: Facts should live in exactly one file (Project GEMINI.md, Subdirectory GEMINI.md, Private Memory, or Global Memory).
- **High Signal, Low Noise**: Prefer concise imperatives over verbose explanations.
- **Human in the Loop**: Always present significant orchestration changes to the user for approval before finalizing.
