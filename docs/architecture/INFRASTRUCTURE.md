# Deployment & Infrastructure

## 1. Hosting & Services

- **Vercel:** Hosts the Next.js application and API routes.
- **PostgreSQL:** Primary data store.
- **Cloudflared:** Local development tunneling for webhooks.
- **Worker Process:** Separate `tsx` process (`scripts/worker.ts`) for background logic.
- **Atomic Symlink Deploys:** Zero-downtime updates on VPS by swapping symlinks.

## 2. API Architecture

Social Studio utilizes a hybrid API architecture consisting of Next.js Route Handlers and Server Actions.

### Route Handlers vs. Server Actions

- **Route Handlers:** Reserved for binary data/streaming (uploads, media), external webhooks (TikTok proxy), third-party tool access, and long-running tasks.
- **Server Actions:** Preferred for UI-triggered mutations, simple database updates, and lightweight queries.

### Documentation (Swagger/OpenAPI)

The application maintains interactive documentation at `/api/docs`. Every new Route Handler must be accompanied by an OpenAPI registration entry.

### Centralized Schemas

All data validation and type inference are managed through centralized Zod schemas in `src/lib/schemas/`.

## 3. Production Readiness

To ensure stability and security in production:

- **Observability:** Sentry integration on client and server.
- **Rate Limiting:** Upstash Redis for critical endpoints.
- **Runtime Validation:** Zod schemas for request payloads.
- **Infrastructure Safety:** Strict directory isolation and automated cleanup.
