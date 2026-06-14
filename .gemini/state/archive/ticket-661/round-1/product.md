
## [2026-06-14 15:30:54] Verdict: APPROVED
### UX Strategy: Redirect to Landing Page on Sign-Out

Objective: Enhance marketing re-engagement by redirecting users to the marketing landing page instead of a functional login page after sign-out.

UX Flow:
1. Trigger: User initiates sign-out from the Profile Menu.
2. Action: The system invalidates the session and redirects the user to the root URL with a query parameter: /?loggedOut=true.
3. Feedback: Upon landing on the marketing page, a non-intrusive Snackbar notification confirms the successful sign-out.
4. Re-entry: The Landing Page Header provides a prominent 'Sign In' button for users who wish to log back in immediately.

### Industry Standards
- Marketing Opportunity: Modern SaaS platforms (e.g., Canva, Buffer) redirect to landing pages to remind users of the product's value proposition immediately after they leave the active application.
- Closure Confirmation: Providing explicit feedback (Snackbar/Toast) is critical to assure the user that their data is secure and the session has ended, especially when redirecting to a content-heavy page like a landing page.

### UI Layout
- Component: MUI Snackbar using a success Alert.
- Placement: Bottom-center to ensure visibility without obstructing navigation or the Hero section.
- Message: Successfully signed out.
- No Emojis: Adhering to project standards, the message will be text-only.
- Timing: 5000ms auto-hide duration.

### Implementation Requirements
- Update signOut callback in UserActions.tsx to use callbackUrl: '/?loggedOut=true'.
- Update LandingPage.tsx to utilize useSearchParams and render the Snackbar when the parameter is present.
