
## [2026-06-03 18:36:28] Verdict: NEEDS-INFO
VERDICT: NEEDS-INFO

SOCRATIC_LOG:
1. Feasibility: NotebookLM is an external SaaS. Direct automation is not possible.
2. Strategic Alignment: Context grounding is vital but risk of Context Drift exists.
3. Security/Privacy: Uploading repo content to cloud LLMs requires strict guardrails.

INTERROGATION:
1. Persistence: Single Master Notebook or per-ticket?
2. Setup: Provide NOTEBOOK_SETUP.md with a manifest?
3. Automation: Script to bundle docs for upload?
4. Source Scope: Include schema.prisma and package.json?
5. Guardrails: Pre-upload secret scanner?

TECHNICAL SPECS:
- [PENDING]

TEST SPECIFICATION:
- [PENDING]

## [2026-06-03 18:38:22] Verdict: SUCCESS
**VERDICT:** SUCCESS

**SOCRATIC_LOG:**
- **Feasibility:** Implementing `scripts/notebook-bundle.ts` in TypeScript is straightforward using `fs` and `glob`. Security scanning via regex is a low-overhead, high-signal first line of defense.
- **Strategic Alignment:** This solves the "Context Drift" and "Onboarding Friction" problems for both AI agents and human contributors by providing a grounded, source-of-truth knowledge base.
- **Architectural Integrity:** The hybrid approach (Master + Ticket) balances global consistency with ticket-level depth, preventing NotebookLM from becoming a "context swamp" of irrelevant or stale data.
- **Necessity/Priority:** High. This formalization is required to scale the orchestration layer and ensure agents have the necessary "Common Sense" about the project's architecture.
- **External Dependencies:** Relying on Google NotebookLM is acceptable as the bundling format is portable (Source files/Markdown), allowing for an easy switch to other RAG systems if needed.

**TECHNICAL SPECS:**
1. **Script: `scripts/notebook-bundle.ts`**
   - **Trigger:** `npm run notebook:package` (add to `package.json`).
   - **Manifest-Driven:** Define a constant `BUNDLE_MANIFEST` containing: `docs/`, `GEMINI.md`, `.agents/base/*.md`, `prisma/schema.prisma`, and `package.json`.
   - **Output:** Clean and populate `tmp/notebook-upload/`.
   - **Secret Scanner:**
     - Scan every file before copying.
     - Detect: `API_KEY`, `_SECRET`, `DATABASE_URL`, `PASSWORD`, `sk-`, `ghp_`.
     - Behavior: Abort with `ERROR: Potential secret detected in [file]! Bundling halted for safety.`
   - **Naming Strategy:** To avoid collisions in the flat `tmp/` directory, prefix files with their directory origin (e.g., `docs__ARCHITECTURE.md`).

2. **Core Documentation: `docs/NOTEBOOKLM.md`**
   - **Workflow Guide:** Define the lifecycle of a "Ticket Notebook" (Create -> Research -> Delete).
   - **Master Notebook:** Instructions for initial setup and manual source refresh.
   - **Integration:** How to use NotebookLM output to cross-reference with `ORCHESTRATION.md` for contradiction detection.

3. **Orchestration Integration: `.agents/base/ORCHESTRATION.md`**
   - **Update Section:** `Discovery (Architecture & Planning)`.
   - **Addition:** "For tickets involving complex integrations or architectural changes, the Discovery agent SHOULD recommend a NotebookLM synthesis step using `npm run notebook:package`."

**TEST SPECIFICATION:**
- **Happy Path (Automation):**
  - Run `npm run notebook:package`. Verify all files in `BUNDLE_MANIFEST` are present in `tmp/notebook-upload/` with correct prefixes.
  - Verify `tmp/` is cleared before new runs.
- **Security Path (Negative):**
  - Add a dummy secret `DUMMY_SECRET=sk-12345` to a doc. Run the script. Verify it aborts and nothing is copied.
- **Edge Path:**
  - Missing manifest files: Script should warn but continue if non-critical, or fail if a core file (like `GEMINI.md`) is missing.
  - Large directory: Ensure `docs/` recursion handles nested folders correctly.
