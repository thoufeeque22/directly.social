# Security & RBAC

## 1. Role-Based Access Control (RBAC)

Social Studio implements a strict Role-Based Access Control (RBAC) system to ensure data integrity and restrict access to sensitive administrative features.

### User Roles

- **USER:** Standard role for all registered users. Allows access to core features (scheduling, media gallery, AI assistant, settings).
- **ADMIN:** Elevated role for platform administrators. Grants access to the Developer Analytics dashboard and other restricted system settings.

### Enforcement Mechanism

RBAC is enforced at multiple layers:

1.  **API Layer:** Protected API routes (e.g., `/api/admin/*`) use the `auth()` helper to verify the session and explicitly check for the `ADMIN` role. Unauthorized requests return a `401 Unauthorized` response.
2.  **UI Layer:** Administrative UI segments (like the Analytics dashboard) perform client-side role verification based on API responses and session data.
3.  **Navigation:** The application sidebar dynamically filters links based on the user's role.

## 2. File System Security

To prevent unauthorized file access and data leakage, the application implements several file system security measures:

- **Path Traversal Protection:** All file-related API routes (e.g., `/api/media/[fileId]`, `/api/upload`) perform strict validation of input paths. File identifiers are sanitized and checked against expected patterns.
- **Ownership Verification:** File access is tied to the `userId` of the uploader. Every request to retrieve or modify a media asset involves a database check.
- **Atomic Cleanup:** The background worker ensures that temporary files and chunk directories are cleaned up even if processes are interrupted.

## 3. Testing Identity

For automated and manual verification, dedicated identities are used:
- **Tester (`tester@socialstudio.ai`):** A standard `USER` account used for E2E testing of common user flows.
- **Admin (`admin@socialstudio.ai`):** A dedicated `ADMIN` account used for verifying administrative access and system health monitoring.

## 4. Rate Limiting & Abuse Prevention

The application protects its public and authenticated endpoints from brute-force and exhaustion attacks using an Upstash-backed rate-limiting system.

- **Modular Configuration:** Rate-limiting instances are centrally managed in `src/lib/core/ratelimit-config.ts`, allowing for granular control over different API tiers (e.g., standard, heavy-AI, or media uploads).
- **Environment Awareness:** The system is aware of the `E2E_RATE_LIMIT_BYPASS` secret, which allows Playwright tests to execute exhaustive verification without being blocked by throttling, while maintaining full security in production.
- **Graceful Throttling:** When a limit is hit, the API returns a standard `429 Too Many Requests` status, which is handled gracefully by the UI and monitored via Sentry.
