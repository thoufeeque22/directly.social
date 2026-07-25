# Manual Test Script: Ticket #758 (Subdomain Routing)

## 1. Vercel Branch Deployment Preview Routing
**Objective**: Ensure that Vercel preview URLs route correctly depending on the host header or preview branch URL structure.
**Steps**:
1. Obtain the Vercel preview URL (e.g., `https://my-branch-preview.vercel.app`).
2. Open the URL in an incognito window.
3. Verify that the homepage (`/`) renders the **Marketing Landing Page** content.
4. Using an extension like ModHeader, set the `Host` header to `app.directly.social` (or if Vercel supports preview subdomains, use `app.my-branch-preview.vercel.app`).
5. Refresh the page and verify that the homepage (`/`) now renders the **Dashboard** content.

## 2. Cross-Subdomain Cookie Persistence
**Objective**: Ensure authentication cookies are set for the root domain (`.directly.social`) and shared across subdomains.
**Steps**:
1. Navigate to the marketing site (`directly.social`).
2. Log in using a test account.
3. Open DevTools > Application > Cookies.
4. Verify the auth cookie has `Domain: .directly.social`.
5. Navigate to `app.directly.social`.
6. Verify that the session is recognized and you are automatically logged into the Dashboard without needing to re-authenticate.

## 3. Production Domain Routing
**Objective**: Verify production routing for both subdomains.
**Steps**:
1. Deploy to the production environment.
2. Navigate to `https://directly.social`.
3. Verify the **Marketing Landing Page** is displayed.
4. Navigate to `https://app.directly.social`.
5. Verify the **Dashboard** is displayed.
