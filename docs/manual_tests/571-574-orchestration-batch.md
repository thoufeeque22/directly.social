# Manual Test Case: Orchestration Batch (571-574)

## Overview
This test plan verifies the implementation of Modular GEMINI.md, Discovery DoR, Visual Regression infrastructure, and State Pruning mechanisms.

## Prerequisites
- Access to the codebase.
- Node.js and npm installed.
- Playwright installed and configured.

## Test Cases

### 1. Modular GEMINI.md Structure
- **Steps:**
  1. Open the project root.
  2. Verify `GEMINI.md` exists and acts as a Table of Contents.
  3. Verify `.gemini/base/` directory contains `CORE.md`, `UI_UX.md`, `PRODUCTION.md`, and `ORCHESTRATION.md`.
  4. Verify each modular file contains its respective domain rules.
- **Expected Result:** Modular structure is present and correctly categorized.

### 2. State Pruning Mechanism
- **Steps:**
  1. Inspect `scripts/prune-state.ts`.
  2. Run the script with a dummy state file exceeding 50KB or 3 rounds: `npx tsx scripts/prune-state.ts --file .gemini/state/test-ticket.json`.
  3. Verify the file is archived in `.gemini/state/archive/`.
  4. Verify the active file is reset with a `summary` block.
- **Expected Result:** State file is pruned and archived according to defined thresholds.

### 3. Visual Regression Infrastructure
- **Steps:**
  1. Run the visual regression script: `npm run test:visual`.
  2. Verify that snapshots are generated in `docs/visual/goldens/`.
  3. Check the `verification/` folder for current session screenshots.
- **Expected Result:** Playwright captures and compares snapshots correctly.

### 4. Discovery DoR Compliance
- **Steps:**
  1. Open `.gemini/base/ORCHESTRATION.md`.
  2. Locate the "Discovery DoR" section.
  3. Verify it includes all 6 mandatory checklist items.
- **Expected Result:** DoR protocol is explicitly documented for the discovery-agent.

### 5. Architectural Documentation
- **Steps:**
  1. Open `docs/ARCHITECTURE.md`.
  2. Verify the "Modular Orchestration Rules" section exists under "3. Agent Orchestration".
  3. Open `docs/ORCHESTRATION.md`.
  4. Verify the new sections for Pruning, DoR, and Visual Regression are present.
- **Expected Result:** External documentation is in sync with internal orchestration rules.
