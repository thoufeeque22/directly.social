# Platform BYOK Integration Wizard

The BYOK (Bring Your Own Key) Integration Wizard empowers power users and developers to use their own platform-specific API credentials (e.g., YouTube Client ID, TikTok Client Secret) within Directly.

## Overview

By default, Directly uses its own managed API keys to facilitate uploads. However, these shared keys are subject to global rate limits. The BYOK feature allows users to "Bring Their Own Key" to:
- **Bypass Global Rate Limits:** Use your own project's quota.
- **Enhanced Privacy:** Maintain full control over your API credentials.
- **Developer Flexibility:** Test integrations with personal developer accounts.

The system dynamically supports credentials for:
- **YouTube** (via Google Cloud Console)
- **TikTok** (via TikTok for Developers)
- **Facebook** (via Meta for Developers)
- **Instagram** (via Meta for Developers)

## User Interface (Progressive Disclosure)

The BYOK wizard is now seamlessly integrated into the **PlatformCard** component within the "Destinations" tab of the Settings page.

- **Clean Initial State:** BYOK settings are hidden by default to maintain a clean visual hierarchy.
- **Progressive Disclosure:** When a platform is toggled to "Enabled", a "Configuration" accordion appears. Expanding this accordion reveals both the **Account Connection** section and the **Advanced Settings (BYOK)** section.
- **Contextual Wizard:** Each platform card contains its own dedicated instance of the `ByokWizard`, pre-configured for that specific platform.
- **AI BYOK:** A global AI Provider BYOK wizard remains available under the dedicated "AI Providers" tab in Settings.

## Roadmap & Phases

- **Phase 1 (Completed):** Focused on credential capture and validation UI. 
- **Phase 2 (Completed):** Functional integration with the core distribution pipeline. Credentials are now stored securely on the server, and the `CredentialProvider` ensures that platform uploaders (YouTube, TikTok, Meta) prioritize user-provided BYOK keys over global managed keys.

## Technical Implementation

The wizard is located at `/settings/byok` and uses a responsive grid layout.

### 1. Credential Input
Users provide the following credentials:
- **Client ID:** The unique identifier for your developer application.
- **Client Secret:** The secret key used to authenticate your application.
- **Redirect URI:** The authorized callback URL for OAuth flows.

### 2. Real-time Validation
Before saving, the system performs a real-time validation check using server actions.
- **Rich Feedback:** Uses Material UI `Alert` components with `AlertTitle` for clear Success/Error states.
- **Loading States:** Integrated `CircularProgress` indicates background validation.

### 3. Server-Side Encrypted Storage
To ensure both security and cross-device availability, BYOK credentials are stored in the database.
- **Encryption at Rest:** Client secrets are encrypted using AES-256-GCM before being persisted.
- **UserId Isolation:** Credentials are strictly linked to the authenticated user.
- **Resolution Logic:** The `CredentialProvider` utility dynamically selects the correct credentials during the distribution process, falling back to global environment variables if BYOK is not configured for a specific platform.

## Security Model

- **Encrypted Persistence:** Secrets are never stored in plain text.
- **Server-Side Validation:** Validation logic runs on the server to prevent exposure of validation routines.
- **Zod Validation:** Strict runtime validation prevents malformed data from being saved.
- **Input Masking:** Secrets are masked in the UI to prevent shoulder surfing.

## Benefits for Power Users

- **High Throughput:** Ideal for users uploading dozens of videos daily who need their own dedicated quota.
- **Custom Branding:** OAuth consent screens will show the user's own application name instead of Directly.
- **Zero-Cost Scaling:** Leverage personal or business API tiers without application-level restrictions.
