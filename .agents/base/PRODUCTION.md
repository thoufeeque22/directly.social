# Production Readiness & Infrastructure

## Production Readiness Standards (Anti-"Vibe Coding")
- **Reliability:** Implement robust error handling with Sentry logging. Never swallow errors.
- **Performance:** Consider caching strategies (Next.js Data Cache, Redis) and database index optimization.
- **Security:** Implement rate limiting on all public API routes and actions. Ensure strict input validation (Zod).
- **Scalability:** Design for high throughput (queues for long-running tasks, efficient sharding/partitioning for large datasets).
- **Observability & Maintenance:** 
  - **API Documentation:** Maintain up-to-date Swagger/OpenAPI docs at `/api/docs`. This is critical for mobile (Capacitor) integration and future public API consumers.
  - **Logging:** Log critical business events and system health metrics.


