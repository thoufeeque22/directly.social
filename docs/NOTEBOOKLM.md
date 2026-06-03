# NotebookLM Integration Guide

NotebookLM is our primary tool for source-grounded documentation synthesis and architectural discovery.

## 🚀 The Hybrid Strategy

We maintain two types of notebooks:

1.  **Master Notebook**: Contains the global source of truth (`docs/`, `GEMINI.md`, orchestration base). Used for onboarding and high-level architectural questions.
2.  **Ticket Notebook**: Temporary notebook created for complex features (e.g., "Billing", "Platform Integration"). Contains the Master context plus specific external docs (API PDFs, research papers).

## 📦 Bundling Context

To ensure NotebookLM has clean, prefix-aware, and secret-free context, use the bundling script:

```bash
npm run notebook:package
```

**Output**: Files are aggregated in `tmp/notebook-upload/` with flattened names (e.g., `docs__architecture__OVERVIEW.md`).

## 🛡️ Security Guardrails

The bundle script includes a **Secret & PII Scanner**. It will abort if it detects:
- API Keys (`sk-`, `ghp_`, etc.)
- Database URLs
- Passwords
- Plaintext Emails

**MANDATORY**: Never upload the raw `.env` file or anything from `lib/` (proprietary logic) to NotebookLM.

## 🔄 Workflow

1.  **Discovery Phase**: If the ticket is complex, run `npm run notebook:package`.
2.  **Upload**: Upload the contents of `tmp/notebook-upload/` to a new NotebookLM notebook.
3.  **Synthesis**: Use the notebook to identify contradictions in requirements or to synthesize fragmented API documentation.
4.  **Handoff**: Include key findings from NotebookLM in your `discovery.md` blueprint.
5.  **Cleanup**: Delete the temporary Ticket Notebook once the ticket is merged.

## 💡 Pro Tips

- **Check Contradictions**: Ask NotebookLM: "Identify any contradictions between `GEMINI.md` and the new technical blueprint."
- **Summarize Changes**: "Based on the recent updates in `docs/`, summarize the evolution of our media processing workflow."
