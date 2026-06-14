# Feature: Sign-out Redirect & Landing Page Notification

## Overview
To improve the user experience and branding consistency, the sign-out flow has been updated to redirect users to the application's landing page (`/`) instead of the login page (`/login`). Additionally, a visual confirmation of successful sign-out is now provided.

## User Flow
1.  **Trigger**: User clicks "Sign Out" from the profile dropdown menu in the header.
2.  **Action**: The system invokes the `signOut` action with a callback URL pointing to `/?loggedOut=true`.
3.  **Redirect**: The user is redirected to the root landing page.
4.  **Notification**: A MUI Snackbar notification appears at the bottom center of the screen with the message: **"Successfully signed out."**
5.  **Cleanup**: The `loggedOut=true` query parameter is automatically removed from the browser URL using `window.history.replaceState` to keep the URL clean and prevent re-triggering the notification on navigation.

## Technical Implementation

### Sign-Out Logic
Located in `src/components/layout/UserActions.tsx`:
```tsx
<MenuItem onClick={() => signOut({ callbackUrl: '/?loggedOut=true' })}>
  Sign Out
</MenuItem>
```

### Landing Page Notification
Implemented in `src/components/landing/LandingPage.tsx`:
- **State Initialization**: Uses `useSearchParams` to check for the `loggedOut` flag.
- **URL Cleanup**: A `useEffect` hook cleans the URL parameters immediately after detection.
- **Component**: Utilizes `@mui/material/Snackbar` and `@mui/material/Alert` for a consistent UI/UX.

### Landing Fallback
A new `LandingFallback` skeleton was introduced in `src/components/landing/LandingFallback.tsx` to provide a smooth loading experience (Suspense) while the landing page components are being initialized.

## Impact
- **Branding**: Users are returned to the marketing/hero landing page, reinforcing the product value proposition even upon exit.
- **Usability**: Clear feedback confirms the destructive action (signing out) was successful.
- **Testing**: Smoke tests have been updated to verify this critical exit path.

## Verification
- **Automated**: `test:smoke` suite verifies the redirect and the landing page integrity.
- **Manual**: Script located at `docs/manual_tests/ticket-661.md`.
