# Production Readiness & Infrastructure

## Production Readiness Standards (Anti-"Vibe Coding")
- **Reliability & Graceful Degradation:** Implement robust error handling with Sentry logging. Never swallow errors. Wrap top-level Prisma/DB calls in critical path rendering functions (like `auth()`) in `try/catch` blocks and return graceful fallbacks (e.g., minimal session) to prevent SSR from crashing the entire page during database schema drift or deployment windows.
- **Performance:** Consider caching strategies (Next.js Data Cache, Redis) and database index optimization.
- **Security:** Implement rate limiting on all public API routes and actions. Ensure strict input validation (Zod), explicitly enforcing `.max()` constraints on string and array inputs (e.g., text prompts, visual frames) to prevent Resource Exhaustion (DoS) attacks.
- **Scalability:** Design for high throughput (queues for long-running tasks, efficient sharding/partitioning for large datasets).
- **Observability & Maintenance:** 
  - **API Documentation:** Maintain up-to-date Swagger/OpenAPI docs at `/api/docs`. This is critical for mobile (Capacitor) integration and future public API consumers.
  - **Logging:** Log critical business events and system health metrics.


