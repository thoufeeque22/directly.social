# Security & RBAC

## 1. Role-Based Access Control (RBAC)

Directly implements a strict Role-Based Access Control (RBAC) system to ensure data integrity and restrict access to sensitive administrative features.

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
- **Tester (`tester@directly.social`):** A standard `USER` account used for E2E testing of common user flows.
- **Admin (`admin@directly.social`):** A dedicated `ADMIN` account used for verifying administrative access and system health monitoring.

## 4. Rate Limiting & Abuse Prevention

The application protects its public and authenticated endpoints from brute-force and exhaustion attacks using a centralized, Upstash-backed rate-limiting system.

### Enforcement Mechanism

Rate limiting is enforced at the **Middleware layer** (`src/proxy.ts`), ensuring 100% coverage across all `/api/*` routes before they reach the handler logic.

- **Modular Configuration:** Rate-limiting instances (e.g., Global, AI, Upload, Auth, Sensitive) are centrally managed in `src/lib/core/ratelimit-config.ts`.
- **Dynamic Routing:** A registry (`src/lib/core/rate-limit-registry.ts`) maps path patterns (regex) to specific limiters, allowing for granular control over high-cost or sensitive endpoints.
- **Identity Awareness:**
    - **Authenticated Users:** Limited by `userId`, ensuring fair usage across the platform.
    - **Unauthenticated/Auth Routes:** Limited by `IP address` to prevent brute-force attacks on login/registration endpoints.
- **Fail-Open Resilience:** The system includes fail-open logic to ensure application availability if the rate-limiting infrastructure (Redis) is unreachable or misconfigured.
- **Test Optimization:** Rate limiting is automatically bypassed in E2E, CI, and test environments via `shouldBypassRateLimit()` to ensure fast and reliable testing.
- **Standardized Feedback:** When a limit is hit, the API returns a standard `429 Too Many Requests` status with a `Retry-After` header.

## 5. Privacy & GDPR Compliance

Directly follows a "Privacy Maximalist" philosophy, ensuring users have full control over their data without invasive tracking.

### Data Portability (Right to Access)

Users can immediately export all their personal data stored on the platform.
- **Scope:** The export includes Profile data, connected Social Accounts, Media Gallery metadata, Activity logs, and custom Templates.
- **Format:** Data is provided in a standardized JSON format for easy portability.
- **Access:** Available via `Settings > Privacy > Export My Data`.

### Right to Erasure (Account Deletion)

The application provides a self-service account deletion mechanism with immediate effect.
- **Enforcement:** Account deletion triggers an automated cascading purge in the database (via Prisma `onDelete: Cascade`), ensuring no orphaned personal data remains.
- **Safety:** The "Danger Zone" includes double-confirmation to prevent accidental deletion.

### Cookie-less Implementation

To respect user privacy and eliminate intrusive banners, the application is designed to be "Cookie-less" for all non-essential features.
- **Essential Cookies:** Only strictly necessary cookies (Authentication and CSRF protection) are used.
- **Banner-Free:** No cookie consent banner is required as no tracking or marketing cookies are utilized.
- **Anonymous Telemetry:** All feature usage analytics (e.g., total posts published) are tracked using anonymous, server-side counters that are not linked to individual user identities.
