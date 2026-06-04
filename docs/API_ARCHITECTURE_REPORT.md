# Architectural Evaluation: Route Handlers vs. Server Actions

## Overview
This report evaluates the current usage of Next.js Route Handlers (API Routes) in the Directly App and provides a strategy for which endpoints should be migrated to Server Actions and which should remain as Route Handlers.

## Current State
- **Route Handlers:** 27 endpoints (documented in Swagger).
- **Server Actions:** Primarily used for lightweight UI interactions and some legacy form submissions.

## Evaluation Criteria

### Stay as Route Handlers
1.  **Binary Data / Streaming:** Endpoints handling file uploads (`/upload/chunk`, `/upload/stage`) or streaming media (`/media/[fileId]`) must remain as Route Handlers due to better control over headers (e.g., Range requests) and memory efficiency.
2.  **External Webhooks / Proxies:** Routes like `/tiktok-proxy` or any future webhook receivers must be Route Handlers to accommodate external HTTP specifications.
3.  **Third-Party Tool Access:** Any endpoint intended for use by mobile apps (Capacitor) or external scripts without a browser session context.
4.  **Long-Running Tasks:** Routes requiring `maxDuration` extensions beyond standard Server Action limits.

### Migrate to Server Actions
1.  **UI-Triggered Mutations:** Simple database updates like `settings/byos`, `settings/disconnect`, or `activity` cleanup. These benefit from tight TypeScript integration and reduced boilerplate.
2.  **Form Submissions:** Any operation currently using a POST route handler that is exclusively triggered by a React component.
3.  **Lightweight Queries:** GET operations that populate specific UI components and don't require caching at the network level.

## Recommendations

### High Priority Migration (Spike)
- **`settings/byos` & `settings/disconnect`:** These are simple CRUD operations that can be easily moved to Server Actions, reducing the public API surface.
- **`ai/validate-key`:** This is a stateless validation check that fits perfectly as a Server Action.

### Remain as Route Handlers (Protected)
- **The entire `/upload/*` pipeline:** Due to complex header requirements and binary processing.
- **`/media/[fileId]`:** Due to the requirement for HTTP 206 (Range) support for platform ingestors.
- **`/chat`:** Due to the streaming nature of AI responses.

## Future Proofing
The implementation of **OpenAPI/Swagger** provides a "Living Source of Truth" for the Route Handlers. Even as we migrate internal logic to Server Actions, maintaining Route Handlers for the core "Publishing Pipeline" ensures that Directly can eventually expose a Public Developer API with minimal friction.
