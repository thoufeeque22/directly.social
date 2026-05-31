# Social Studio Architecture

This document provides a high-level index of the Social Studio application architecture, data models, and core workflows.

## Table of Contents

1.  **[Overview & Tech Stack](architecture/OVERVIEW.md)**
    *   System Overview
    *   Core Technologies
2.  **[Data Model](architecture/DATA_MODEL.md)**
    *   Entity Relationship Diagram (Prisma)
3.  **[Media Workflows](architecture/MEDIA_WORKFLOWS.md)**
    *   Media Upload & Ingestion
    *   Asset Cleanup
    *   Modular Upload Infrastructure
4.  **[Publishing Workflows](architecture/PUBLISHING_WORKFLOWS.md)**
    *   Post Distribution (Publishing)
    *   Modular Distribution Layer
    *   Automated Token Refresh
5.  **[UI & Feature Components](architecture/UI_COMPONENTS.md)**
    *   AI Chatbot Assistant
    *   Global Search & Refresh
    *   BYOK/BYOS Wizards
    *   Standard View Pattern (Server Shell / Client Content)
6.  **[Security & RBAC](architecture/SECURITY.md)**
    *   Role-Based Access Control
    *   File System Security
7.  **[Mobile Architecture](architecture/MOBILE.md)**
    *   Capacitor Wrapper
    *   Mobile UI/UX Standards (Safe Areas)
8.  **[Testing & Quality Assurance](architecture/TESTING_QA.md)**
    *   E2E (Playwright) & Unit (Vitest)
    *   Agent Orchestration
    *   Modularity Enforcement (50-Line Rule)
9.  **[Deployment & Infrastructure](architecture/INFRASTRUCTURE.md)**
    *   Hosting (Vercel/VPS)
    *   API Architecture (Route Handlers vs. Server Actions)
    *   Production Readiness (Sentry/Redis)

---

## Architecture Principles

- **State-First Protocol:** Every task begins with a defined state in `.gemini/state/`.
- **Modularity Mandate:** All source files must be ≤ 50 lines.
- **Strict Typing:** Zero-Any policy for TypeScript.
- **Centralized Validation:** Shared schemas in `src/lib/schemas/`.
