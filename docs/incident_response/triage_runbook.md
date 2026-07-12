# Triage Runbook (What to Check First)

When an outage is reported (P1 or P2), follow this step-by-step diagnostic checklist to identify the root cause quickly.

## Phase 1: Verify & Scope the Outage (Minutes 0-5)

1.  **Reproduce the Issue:** Try to access the site yourself. Use an Incognito window or a cellular connection to rule out local caching or ISP issues.
2.  **Determine the Scope:**
    *   Is the entire site returning a 500/502 error?
    *   Is the site loading, but a specific feature (like login or checkout) is failing?
    *   Is it slow, or completely down?

## Phase 2: The "Usual Suspects" Checklist (Minutes 5-15)

Check these systems in order of likelihood for causing a major outage.

### 1. Recent Deployments (Vercel)
*The most common cause of a new outage is a recent code change.*
*   **Action:** Open the [Vercel Project Dashboard](https://vercel.com/dashboard).
*   **Check:** Did a deployment go out in the last 60 minutes?
*   **Immediate Mitigation:** If yes, and the timing aligns with the outage, **rollback immediately** to the last known good deployment. Do this before spending time debugging.

### 2. Application Logs (Vercel)
*   **Action:** Go to the [Vercel Runtime Logs](https://vercel.com/dashboard) (select your project -> Logs tab).
*   **Check for:**
    *   `500 Internal Server Error` bursts.
    *   `Timeout` errors (often indicate a database lock or heavy query).
    *   `Out of Memory (OOM)` errors.
    *   Unhandled Promise Rejections or specific stack traces.

### 3. Database (Supabase Postgres)
*   **Action:** Open the [Supabase Dashboard](https://supabase.com/dashboard).
*   **Check for:**
    *   **Active Connections:** Are you hitting the connection limit? (This is a common issue with serverless functions).
    *   **Compute/CPU Usage:** Is the database CPU pegged at 100%?
    *   **Recent Migrations:** Did a Prisma migration run recently that might have locked a critical table?
*   **Mitigation:** If connections are exhausted, you may need to restart the application or scale up the database compute temporarily.

### 4. Third-Party Services
*   **Action:** Check the status pages of critical dependencies.
*   **Check:**
    *   **Hosting:** [Vercel Status Page](https://www.vercel-status.com/)
    *   **Database:** [Supabase Status Page](https://status.supabase.com/)
    *   **Payments:** [Stripe Status Page](https://status.stripe.com/)
    *   **Authentication:** (e.g., [Clerk Status](https://status.clerk.com/) or [Auth0 Status](https://status.auth0.com/))
    *   **Email:** (e.g., [Resend Status](https://status.resend.com/) or [SendGrid Status](https://status.sendgrid.com/))
    *   **GitHub:** [GitHub Status Page](https://www.githubstatus.com/) (if deployments are failing)

## Phase 3: Deep Dive Investigation (Minutes 15+)

If the issue wasn't found in the usual suspects:

1.  **Isolate the Failing Code:** Use the Vercel logs to pinpoint the exact file or API route causing the issue.
2.  **Check Configuration:** Did an environment variable (`.env`) get accidentally deleted or changed in the Vercel settings? Are API keys expired?
3.  **Local Reproduction:** 
    *   Pull the latest `main` branch.
    *   Connect to the *staging* database (or a safe replica of production) to see if you can reproduce the error locally.
    *   *(Caution: Avoid connecting your local environment directly to the production database if the issue involves data corruption or heavy load).*

## Phase 4: Escalation / Getting Help

If you are stuck after 30 minutes:
*   Post the specific error trace to relevant support channels (e.g., Vercel Support, Supabase Support, or developer communities).
*   Update your public Status Page to "Investigating" to buy yourself time (see `communication_templates.md`).
