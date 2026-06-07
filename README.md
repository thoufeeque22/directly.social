# Directly Social App

**Directly Social** is a multi-platform social media management application that allows users to schedule and distribute video content (Shorts/Reels/TikToks) across various platforms simultaneously.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Authentication:** Auth.js (NextAuth)
- **Database:** PostgreSQL with Prisma ORM
- **UI:** Material UI (MUI), Framer Motion
- **Testing:** Playwright (E2E), Vitest (Unit/Integration)
- **Monitoring:** Sentry

## Getting Started

### 1. Prerequisites
- Node.js 20+
- pnpm

### 2. Installation
```bash
pnpm install
```

### 3. Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

- `src/app/`: Next.js App Router (Pages, API Routes, Server Actions)
- `src/components/`: Reusable UI components
- `src/lib/`: Core logic, schemas, and utilities
- `src/__tests__/`: Comprehensive test suite (E2E, Unit, Integration) and test scripts
- `.gemini/`: AI Agent orchestration and standards

## Core Scripts

- `npm run build`: Production build
- `npm run lint`: ESLint check (enforces 100-line modularity rule)
- `npm run test`: Run unit and integration tests
- `npm run test:smoke`: Run critical path E2E tests
- `npm run test:regression`: Run full regression E2E tests
- `npm run cleanup:neon`: Purge old Neon database branches

## API Documentation

**Directly Social** features a centralized API documentation system powered by Swagger/OpenAPI.
Access the interactive Swagger UI at `/api/docs` in your local development environment.

## AI Agent Orchestration

This project uses an agentic workflow defined in `.gemini/GEMINI.md` and `.gemini/base/ORCHESTRATION.md`. The workflow ensures high-quality code delivery through distinct phases: Discovery, Development, Review, QA, and Documentation.
For more details, see [docs/ORCHESTRATION.md](docs/ORCHESTRATION.md).

## Documentation Index

Comprehensive documentation is available in the `docs/` directory:
- [Architecture Overview](docs/architecture/OVERVIEW.md)
- [Testing & QA](docs/architecture/TESTING_QA.md)
- [Deployment Guide](docs/LAUNCH_GUIDE.md)
- [Mobile Architecture](docs/architecture/MOBILE.md)
