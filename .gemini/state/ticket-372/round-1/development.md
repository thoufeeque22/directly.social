# Development: API Rate Limiting (#372)

## Implementation Summary
Implemented centralized rate limiting via Next.js middleware and refactored API routes for better modularity and architectural integrity.

## Changes
### Infrastructure & Utilities
- **`src/lib/core/ratelimit-config.ts`**: Added `authRateLimit` and `sensitiveRateLimit` instances.
- **`src/lib/core/rate-limit-registry.ts`**: Created a registry to map API path patterns to limiters, decoupling middleware from specific routes.
- **`src/lib/core/bypass-utils.ts`**: Centralized logic for bypassing rate limits in test/dev environments.
- **`src/lib/core/ratelimit.ts`**: Updated to use the new bypass utility.

### Middleware
- **`src/middleware.ts`**: Implemented global and path-specific rate limiting for all `/api/*` routes. Features IP-based fallback for unauthenticated users and fail-open logic for high availability.

### Services & Modularity
- **`src/lib/services/activity-service.ts`**: Extracted persistence logic from route handlers to satisfy CA-001.
- **`src/lib/testing/mock-ai-service.ts`**: Extracted E2E mock logic from the chat route to satisfy OO-001.
- **`src/lib/actions/ai-chat-tools.ts`**: Extracted tool definitions from the chat route to satisfy CA-002 and the 100-line modularity rule.

### Refactoring
- **`src/app/api/chat/route.ts`**: Removed manual rate limiting and extracted tools/mocks. Now well under the 100-line limit.
- **`src/app/api/upload/init/route.ts`**: Removed manual rate limiting and Prisma dependency.
- **`src/app/api/upload/byos/presign/route.ts`**: Removed manual rate limiting.
- **`src/app/actions/ai.ts`**: Refactored `getMultiPlatformAIPreviews` to use a parameter object (API-002) and retained manual rate limiting (middleware bypass protection).
- **Frontend Consumers**: Updated `ScheduleContent.tsx`, `DashboardClient.handlers.ts`, and `useCockpitAutoStart.ts` to support the refactored Server Action.

## Design Decisions
- **Middleware-First**: Centralizing enforcement ensures 100% coverage and prevents "forgotten" limits on new routes.
- **Registry Pattern**: Using regex matching in a registry makes the middleware extensible without code changes to the main logic.
- **Service Layer**: Introducing services decouples the transport layer (Next.js routes) from the infrastructure layer (Prisma).
