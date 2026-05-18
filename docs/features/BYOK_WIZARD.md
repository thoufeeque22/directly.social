# Platform BYOK Integration Wizard

The BYOK (Bring Your Own Key) Integration Wizard empowers power users and developers to use their own platform-specific API credentials (e.g., YouTube Client ID, TikTok Client Secret) within Social Studio.

## Overview

By default, Social Studio uses its own managed API keys to facilitate uploads. However, these shared keys are subject to global rate limits. The BYOK feature allows users to "Bring Their Own Key" to:
- **Bypass Global Rate Limits:** Use your own project's quota.
- **Enhanced Privacy:** Maintain full control over your API credentials.
- **Developer Flexibility:** Test integrations with personal developer accounts.

The system dynamically supports credentials for:
- **YouTube** (via Google Cloud Console)
- **TikTok** (via TikTok for Developers)
- **Facebook** (via Meta for Developers)
- **Instagram** (via Meta for Developers)

## User Interface (UX Redesign)

The wizard features a premium **GlassCard** interface with a structured 2-step flow to guide users through the complex setup process.

### Step 1: Get Your Keys
Users are provided with direct links to the relevant developer portals.
- **Direct Portal Access:** Quick-action buttons to open the correct developer console (e.g., Google Cloud, TikTok Console).
- **Platform-Specific Instructions:** Concise guidance on what to do in each portal.

### Step 2: Configure Credentials
A clean, focused input area for providing the generated secrets.
- **Input Masking:** Client secrets are masked (password type) for security.
- **Contextual Help:** Helper text for fields like Redirect URI to reduce configuration errors.

## Roadmap & Phases

- **Phase 1 (Current):** Focuses on credential capture and validation. The wizard allows users to enter, validate (connectivity check), and persist their keys in secure client-side storage.
- **Phase 2 (Future):** Integration with the core distribution pipeline. The server-side distributor and OAuth flows will be updated to prioritize user-provided BYOK keys over the global managed keys if enabled.

## Technical Implementation

The wizard is located at `/settings/byok` and uses a responsive grid layout.

### 1. Credential Input
Users provide the following credentials:
- **Client ID:** The unique identifier for your developer application.
- **Client Secret:** The secret key used to authenticate your application.
- **Redirect URI:** The authorized callback URL for OAuth flows.

### 2. Real-time Validation
Before saving, the system performs a real-time validation check using the `validateCredentials` utility. 
- **Rich Feedback:** Uses Material UI `Alert` components with `AlertTitle` for clear Success/Error states.
- **Loading States:** Integrated `CircularProgress` indicates background validation.

### 3. Client-Side Storage
To maximize security and privacy, BYOK credentials are **never stored on the Social Studio servers**.
- Keys are persisted in the browser's `localStorage` (e.g., `byok_YouTube`).
- The server only ever interacts with these keys if the user's browser transmits them during a session.

## Security Model

- **No Server Persistence:** Your secrets never touch our database.
- **Zod Validation:** Strict runtime validation prevents malformed data from being saved.
- **Local Isolation:** Credentials are local to the browser/device where they were entered.

## Benefits for Power Users

- **High Throughput:** Ideal for users uploading dozens of videos daily who need their own dedicated quota.
- **Custom Branding:** OAuth consent screens will show the user's own application name instead of Social Studio.
- **Zero-Cost Scaling:** Leverage personal or business API tiers without application-level restrictions.
