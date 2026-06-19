# Elite Architecture Memory

- **Rules:** Centralized in `GEMINI.md`. All agents MUST follow.
- **Sub-agents:** Located in `.agents/agents/`.
  - `discovery-agent`: Technical Blueprints.
  - `dev-agent`: Implementation.
  - `review-agent`: Audit & Verification.
  - `qa-agent`: Test Writing & Execution.
  - `doc-agent`: PRs & living docs.
- **Hooks:** `.agents/hooks/post-task.sh` (auto-lint/test).
- **State:** `.agents/state/ticket-<id>/MAIN.md` (transient workflow state). Markdown only; JSON is forbidden.
