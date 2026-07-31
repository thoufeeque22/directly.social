# Security Scanning — OWASP ZAP DAST

directly.social uses **OWASP ZAP (Zed Attack Proxy)** for Dynamic Application Security Testing (DAST).
ZAP actively probes the staging environment for common web vulnerabilities on every deployment and weekly.

---

## Architecture Overview

```
Pull Request → zap-baseline-scan.yml  (passive scan, advisory)
                      │
                      └── Uploads HTML report as artifact
                          Posts summary comment on PR

Push to main  → deploy-staging.yml   (deploys to staging)
                      │
                      └── zap-full-scan.yml    (active DAST — BLOCKS on High severity)
                              │
                              ├── Uploads HTML + SARIF reports as artifacts
                              └── Creates GitHub Issues for findings

Weekly Cron (Mon 2am UTC) → zap-full-scan.yml
Manual trigger             → zap-full-scan.yml
```

---

## Authentication Layers

Staging has two authentication layers that ZAP must pass through:

| Layer | What it is | How ZAP handles it |
|---|---|---|
| **Layer 1 — nginx** | HTTP Basic Auth protecting the staging subdomain | ZAP's Replacer add-on injects `Authorization: Basic <b64>` into every request (credentials stored as GitHub secrets) |
| **Layer 2 — NextAuth** | Application session (in-app dashboard, settings, etc.) | ZAP calls `/api/zap/auth` to get a `authjs.session-token` cookie before scanning |

### The ZAP Test User

A dedicated low-privilege account `zap@directly.social` is used for authenticated scanning.
It has no linked social accounts, no payment methods, and a `USER` role.

**To seed this user on a new staging environment:**

```bash
# On the staging VPS, in the app directory:
DATABASE_URL=<staging_db_url> npx tsx scripts/seed-zap-user.ts
```

---

## Required GitHub Actions Secrets

Add these in **Settings → Secrets and variables → Actions**:

| Secret name | Description |
|---|---|
| `STAGING_HTTP_USER` | Username for nginx Basic Auth on staging |
| `STAGING_HTTP_PASS` | Password for nginx Basic Auth on staging |
| `ZAP_AUTH_SECRET` | Shared secret for the `/api/zap/auth` endpoint (min 32 chars) |

**Generate a strong `ZAP_AUTH_SECRET`:**
```bash
openssl rand -base64 48
```

---

## Required Staging Environment Variables

Add these to the staging `.env` file on the VPS:

```bash
# Enable the ZAP security scanner credentials provider and auth endpoint.
# DO NOT set this in production.
ZAP_ENABLED=true

# Must match the ZAP_AUTH_SECRET GitHub Actions secret exactly.
ZAP_AUTH_SECRET=<your_generated_secret>
```

---

## Reports

ZAP produces two report formats after every full scan:

| Format | Location | Retention |
|---|---|---|
| **HTML** | Workflow Artifacts → `zap-full-report-<run_number>` | 90 days |
| **SARIF** | Workflow Artifacts → `zap-full-report-<run_number>` | 90 days |
| **PR Markdown** | Workflow Artifacts + PR comment | 30 days |

Download reports from the **Actions** tab → select the workflow run → **Artifacts**.

---

## Suppressing False Positives

ZAP sometimes reports issues that are intentional framework behaviour.
Edit [`.zap/rules.tsv`](../.zap/rules.tsv) to suppress known false positives:

```tsv
# Format: <rule-id>\tIGNORE\t<parameter>\t<evidence>\t<url>
10096   IGNORE  .*  .*
```

Find rule IDs in the HTML report — they appear next to each alert name.

Common Next.js false positives already suppressed:
- `10015` — Cache-Control (static asset CDN headers)
- `10096` — Timestamp Disclosure (Next.js build IDs)
- `10027` — Suspicious Comments (build artifact metadata)

---

## Triggering a Manual Scan

1. Go to **Actions** → **ZAP Full DAST Scan (Staging)**
2. Click **Run workflow** → select `main` branch → **Run workflow**

To scan a different URL (e.g., a specific worktree deployment):
- Use the `target_override` input field in the manual dispatch form

---

## Responding to Findings

When the full scan fails (High severity detected):

1. Download the HTML report artifact from the failed workflow run
2. Review each **High** alert — check if it's a genuine issue or a false positive
3. **If genuine**: create a fix branch, patch the vulnerability, and re-run the scan
4. **If false positive**: add a suppression rule to `.zap/rules.tsv` with a comment explaining why
5. GitHub Issues are automatically created by ZAP for each finding — close them when resolved

---

## Scope Exclusions

The following paths are excluded from scanning (configured in `.zap/af-plan.yaml`):

| Path pattern | Reason |
|---|---|
| `/api/auth/callback/*` | External OAuth provider redirects — ZAP can't follow |
| `/api/inngest/*` | Inngest event delivery — scanning would fire real background jobs |
| `/api/webhooks/stripe/*` | Stripe webhooks — scanning would corrupt billing events |
| `/api/upload/*` | File uploads — active scan payloads could corrupt staging storage |
| `/api/zap/*` | The scanner's own auth endpoint — excluded to avoid scan loops |

---

## Future Improvements

- [ ] **SARIF upload to GitHub Security tab** — use `github/codeql-action/upload-sarif` to surface findings in the Security → Code Scanning view
- [ ] **Authenticated scan coverage report** — count URLs scanned in authenticated vs unauthenticated context
- [ ] **Custom active scan policy** — tune which attack types run (disable intrusive ones, enable relevant OWASP Top 10 checks)
