# Manual Test Script: Ticket 790 (Supabase Auth Migration)

## Objective
Verify the complete removal of NextAuth, the integration of Supabase Auth (`@supabase/ssr`), and the streamlined login UI (Google + Email OTP only).

## Pre-requisites
- Local development server running (`pnpm dev`).
- Access to an email inbox for testing Magic Links / OTPs.

## Test Cases

### 1. UI Verification (Login Page)
**Steps:**
1. Navigate to `http://localhost:3000/login`.
2. Inspect the login options presented.
**Expected Result:**
- A "Continue with Google" button is visible.
- An Email input field is visible with a "Continue with Email" (or similar) submit button.
- There are NO Facebook or TikTok buttons visible on the page.

### 2. Google OAuth Flow
**Steps:**
1. On the login page, click "Continue with Google".
2. Complete the Google authentication flow.
**Expected Result:**
- User is successfully redirected back to the application and logged in.
- A valid Supabase session cookie (`sb-*-auth-token`) exists in the browser.

### 3. Email OTP / Magic Link Flow
**Steps:**
1. On the login page, enter a valid email address and submit.
2. Check the inbox for that email address.
3. Click the Magic Link OR enter the 6-digit OTP provided in the email into the application.
**Expected Result:**
- User is successfully authenticated and logged into the application.
- A valid Supabase session cookie is created.

### 4. Middleware & Protected Routes
**Steps:**
1. While logged in, navigate to a protected route (e.g., `/settings`). It should load successfully.
2. Clear your browser cookies (specifically the Supabase auth token).
3. Refresh the page.
**Expected Result:**
- The application automatically redirects the user back to `/login`.

### 5. Legacy NextAuth Verification
**Steps:**
1. Using the browser console or a tool like cURL, attempt to hit the old NextAuth endpoint: `GET /api/auth/session`.
**Expected Result:**
- The request returns a `404 Not Found`, confirming NextAuth has been completely removed from the application routes.
