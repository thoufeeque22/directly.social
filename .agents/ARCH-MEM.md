# Elite Architecture Memory

- **Rules:** Centralized in `.agents/AGENTS.md`. All agents MUST follow. `GEMINI.md` at the repo root is deprecated.
- **Sub-agents:** Located in `.agents/agents/`
  - `discovery-agent`: Technical Blueprints.
  - `dev-agent`: Implementation.
  - `review-agent`: Audit & Verification.
  - `qa-agent`: Test Writing & Execution.
  - `doc-agent`: PRs & living docs.
- **Hooks:** `.agents/hooks/post-task.sh` (auto-lint/test).
- **State:** Agy native Artifacts in `<appDataDir>/brain/<conversation-id>/`. `.agents/state/ticket-*/` is **obsolete** — do NOT create new directories there.
- **Local Model Routing:** The Orchestrator MUST offload heavy tasks to local models via `ollama_chat` (`qwen-coder-64k`, `gemma4:26b`, `deepseek-coder-v2`, `llama3.1:8b`, etc.) to prevent cloud token exhaustion.
