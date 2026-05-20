# Social Studio Architecture

This document provides a high-level overview of the Social Studio application architecture, data models, and core workflows.

## System Overview

Social Studio is a multi-platform social media management application that allows users to schedule and distribute video content (Shorts/Reels/TikToks) across various platforms simultaneously.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Authentication:** [Auth.js (NextAuth)](https://authjs.dev/)
- **Database:** PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Validation:** [Zod](https://zod.dev/) (Runtime & API validation)
- **Rate Limiting:** [Upstash Redis](https://upstash.com/)
- **Video Processing:** [FFmpeg](https://ffmpeg.org/) (via `fluent-ffmpeg`)
- **Mobile Wrapper:** [Capacitor](https://capacitorjs.com/) (iOS & Android)
- **Monitoring:** [Sentry](https://sentry.io/)
- **Styling:** Vanilla CSS, Framer Motion, Lucide React

## Data Model

The application uses a relational database schema managed by Prisma.

```mermaid
erDiagram
    User ||--o{ Account : "has"
    User ||--o{ Session : "has"
    User ||--o{ PlatformPreference : "defines"
    User ||--o{ PostHistory : "creates"
    User ||--o{ GalleryAsset : "uploads"
    User ||--o{ TokenAuditLog : "logs"
    User ||--o{ MetadataTemplate : "saves"
    User ||--o{ UserSeenUpdate : "tracks"
    UpdateLog ||--o{ UserSeenUpdate : "logs"

    Account ||--o{ TokenAuditLog : "audited by"

    PostHistory ||--o{ PostPlatformResult : "distributes to"

    User {
        string id PK
        string name
        string email
        datetime emailVerified
        string image
        string preferredVideoFormat
        string preferredAIStyle
    }

    MetadataTemplate {
        string id PK
        string userId FK
        string name
        string content
        datetime createdAt
        datetime updatedAt
    }

    Account {
        string id PK
        string userId FK
        string type
        string provider
        string providerAccountId
        string refresh_token
        string access_token
        int expires_at
        string token_type
        string scope
        string id_token
        string session_state
        string accountName
        boolean isDistributionEnabled
    }

    PostHistory {
        string id PK
        string userId FK
        string title
        string description
        string videoFormat
        datetime scheduledAt
        boolean isPublished
        string stagedFileId
        datetime createdAt
    }

    PostPlatformResult {
        string id PK
        string postHistoryId FK
        string platform
        string accountName
        string accountId
        string platformPostId
        string permalink
        string status
        string errorMessage
        string resumableUrl
        string videoId
        string creationId
        string transcodeStatus
        string optimizedFileId
        json metadata
        int progress
        int retryCount
        datetime lastRetryAt
        datetime createdAt
    }

    GalleryAsset {
        string id PK
        string userId FK
        string fileId UK
        string fileName
        bigint fileSize
        string mimeType
        string processingStatus
        json metadata
        datetime expiresAt
        datetime createdAt
    }

    UpdateLog {
        string id PK
        string version
        string title
        string description
        datetime createdAt
    }

    UserSeenUpdate {
        string id PK
        string userId FK
        string updateId FK
        datetime seenAt
    }
```

## Core Workflows

### 1. Media Upload & Ingestion

Users upload media which is temporarily stored on the server for processing and distribution. The system uses a **decentralized observation pattern** where upload utilities broadcast progress to `localStorage`, allowing a persistent `UploadHUD` component to provide real-time feedback across the entire application without complex prop-drilling.

```mermaid
sequenceDiagram
    participant U as User (UI)
    participant HUD as UploadHUD (Component)
    participant LS as localStorage (SS_STAGING_STATUS)
    participant API as API (/api/upload)
    participant FS as File System (src/tmp)
    participant DB as Database (Prisma)

    U->>API: Upload Video Chunk
    API->>FS: Write Chunk
    API-->>U: Success
    U->>LS: Broadcast Progress (X%)
    LS-->>HUD: Sync Progress (500ms poll)
    HUD->>HUD: Render HUD Visibility

    U->>API: Finalize Upload
    API->>FS: Assemble Full File
    API->>DB: Create GalleryAsset Record
    DB-->>API: Asset Saved
    API-->>U: Return stagedFileId
    U->>LS: Clear Broadcast
    LS-->>HUD: Hide HUD
```

### 2. Post Distribution (Publishing)

A background worker polls for scheduled posts and distributes them to selected platforms.

```mermaid
sequenceDiagram
    participant W as Worker (Polling)
    participant DB as Database (Prisma)
    participant DIST as Server Distributor
    participant P as Platform APIs (YT, FB, IG, TT)

    loop Every 10 Seconds
        W->>DB: Query Overdue & Unpublished Posts
        DB-->>W: List of Posts
        
        rect rgb(240, 240, 240)
            note right of W: For each post (Parallel)
            W->>DB: Mark as Published (Immediate Lock)
            W->>DIST: distributeToPlatformsServer(post)
            
            loop For each Platform
                DIST->>P: Upload/Publish Video
                P-->>DIST: Return Platform IDs / URL
                DIST->>DB: Update PostPlatformResult (Success/Fail)
            end
            
            W->>DB: Update GalleryAsset Expiry (Shorten)
        end
    end
```

### 3. Asset Cleanup

To maintain storage efficiency, expired assets and orphaned files are purged regularly.

```mermaid
sequenceDiagram
    participant W as Worker (Cleanup)
    participant DB as Database (Prisma)
    participant FS as File System (src/tmp)

    loop Every 1 Hour
        W->>DB: Find Expired GalleryAssets
        DB-->>W: List of Asset IDs
        W->>FS: Delete Physical Files
        W->>DB: Delete GalleryAsset Records
        
        W->>FS: Scan src/tmp for Orphaned Files (>24h)
        W->>DB: Check if Files are Tracked
        DB-->>W: Tracking Status
        W->>FS: Delete Untracked Files
    end
```

### 4. AI Chatbot Assistant

The AI Chatbot provides a conversational interface for users to manage their content, schedule posts, and view staged media. It leverages the Vercel AI SDK to stream responses and execute server-side tools.

```mermaid
sequenceDiagram
    participant U as User (UI)
    participant API as Chat API (/api/chat)
    participant LLM as AI Provider (Gemini/Ollama)
    participant DB as Database (Prisma)

    U->>API: Send Message
    API->>LLM: Send Context & Tools
    LLM-->>API: Stream Response / Tool Call
    
    rect rgb(240, 240, 240)
        note right of API: If Tool Call (e.g., schedule_video)
        API->>DB: Execute Server Action
        DB-->>API: Return Result
        API->>LLM: Send Tool Result
        LLM-->>API: Stream Final Summary
    end
    
    API-->>U: Stream UI Updates
```

### 5. Global Search

A unified search mechanism provides server-side filtering for history and media assets.

```mermaid
sequenceDiagram
    participant U as User (UI)
    participant C as SearchField (Component)
    participant API as API (/api/history or /api/media)
    participant DB as Database (Prisma)

    U->>C: Type search term
    C->>C: Debounce (500ms)
    C->>API: GET /api/... ?search=term
    API->>DB: Query with 'contains' (insensitive)
    DB-->>API: Filtered Results
    API-->>U: Render Results
```

### 6. Platform BYOK (Bring Your Own Key)

The BYOK Integration Wizard allows power users to provide their own platform API credentials (Client ID, Secret, Redirect URI), bypassing global application-level rate limits.

- **Storage:** Credentials are persisted in the database using the `ByokCredential` model. The `clientSecret` is encrypted at rest using AES-256-GCM with a server-side `BYOK_ENCRYPTION_KEY`.
- **Credential Resolution:** A centralized `CredentialProvider` utility (`src/lib/core/credential-provider.ts`) manages the resolution of credentials, prioritizing user-provided BYOK keys and falling back to global environment variables.
- **UI Architecture:** Uses a premium **GlassCard** component with a 2-step guided flow (Get Keys -> Configure).
- **Integration:** The distribution pipeline (`src/lib/platforms/`) utilizes the `CredentialProvider` to fetch active credentials for each upload task, ensuring that power users leverage their own API quotas.

```mermaid
sequenceDiagram
    participant U as User (UI)
    participant W as ByokWizard (Component)
    participant A as Server Action (saveByok)
    participant E as Encryption (AES-256-GCM)
    participant DB as Database (Prisma)
    participant P as Platform APIs

    U->>W: Select Platform
    W->>U: Show Step 1: Links to Dev Portals
    U->>W: Step 2: Enter Credentials
    W->>A: saveByok(platform, creds)
    A->>P: Health Check / Auth Verification
    P-->>A: Validation Result
    
    alt Success
        A->>E: Encrypt Secret
        E-->>A: Encrypted Value
        A->>DB: Upsert ByokCredential
        DB-->>A: Saved
        A-->>W: Return Success
        W-->>U: Show Success Alert
    else Failure
        A-->>W: Return Error
        W-->>U: Show Error Alert
    end
```

### 7. Graceful Error Handling

The application implements a hierarchical error handling strategy to ensure graceful degradation and high observability.

- **Standardized API Errors:** Server-side errors are managed using a custom `AppError` class and a centralized `handleApiError` utility. This ensures consistent error responses (message + code) and automatic Sentry reporting for unexpected failures.
- **Hierarchical Boundaries:** 
  - **Global Boundary (`global-error.tsx`):** The final safety net for root-level failures.
  - **Route Boundary (`error.tsx`):** Isolates failures to specific segments, keeping the layout interactive.
  - **Glass Aesthetic:** All error states use a shared `ErrorBoundary` component that follows the project's premium glass aesthetic, featuring blur effects and high-contrast typography.
- **Recovery:** Error boundaries provide a "Try again" mechanism that triggers a segment re-render, allowing users to recover from transient issues without a full page refresh.

### 8. What's New Notifications

Users are notified of new application updates via a badge in the header.

```mermaid
sequenceDiagram
    participant U as User (UI)
    participant B as WhatsNewBadge (Component)
    participant M as WhatsNewModal (Component)
    participant A as Server Action (whats-new.ts)
    participant DB as Database (Prisma)

    B->>A: getUnseenUpdates()
    A->>DB: Query UpdateLog entries NOT in UserSeenUpdate
    DB-->>A: List of Updates
    A-->>B: Return Updates
    B->>B: Render "New" Badge (count = list.length)

    U->>B: Click Badge
    B->>M: Open Modal(updates)
    
    U->>M: Click "Got it" for an update
    M->>A: markUpdateAsSeen(updateId)
    A->>DB: Create UserSeenUpdate record
    DB-->>A: Success
    A-->>M: Success
    M->>M: Remove update from local state
    opt If no more updates
        M->>M: Close Modal
    end
    B->>B: Update Badge count
```

## Platform Integrations

Platform-specific logic is encapsulated in `src/lib/platforms/`.

- **YouTube:** Uses Google APIs Node.js client with resumable upload support.
- **Facebook/Instagram:** Uses Meta Graph API (Video/Reels endpoints).
- **TikTok:** Uses TikTok Content Posting API.
- **Local:** Simulates distribution for testing purposes.

## Mobile Architecture

The app is wrapped using **Capacitor**, allowing it to run as a native app on iOS and Android while sharing the same web codebase. Native features (camera, gallery, auth) are accessed via Capacitor plugins.

## Testing & Quality Assurance

The application maintains a high standard of quality through automated testing and strict TypeScript enforcement.

### 1. E2E Testing (Playwright)

End-to-End tests are located in `src/__tests__/e2e/` and cover critical user journeys such as authentication, metadata management, and post scheduling.

- **Automated Authentication:** The test suite uses a dedicated E2E user (`tester@socialstudio.ai`). A setup project (`auth.setup.ts`) performs a real login via the Credentials provider and saves the session state to `.auth/user.json`, allowing subsequent tests to skip the login step.
- **Environment Requirements:** E2E tests require `NEXT_PUBLIC_E2E=true` and `NODE_ENV=development` to enable the Credentials provider on the server.
- **Locators:** Tests prioritize accessible roles (`getByRole`) and `data-testid` attributes for robustness.

### 2. Unit & Integration Testing (Vitest)

Unit tests for utility functions and integration tests for server actions are located in `src/__tests__/unit/` and `src/__tests__/integration/`.

### 3. Agent Orchestration

The project uses specialized AI agents (Discovery, Dev, Review, QA) to manage the development lifecycle, ensuring that every change is planned, implemented, audited, and verified before merging.

## Production Readiness

To ensure stability, security, and traceability in a production environment, Social Studio implements:

- **Observability:** Sentry is integrated on both the client (`sentry.edge.config.ts`, `sentry.server.config.ts`) and server, capturing unhandled exceptions and performance metrics. Sentry error reporting is used across server actions and API routes.
- **Rate Limiting:** Upstash Redis is used for distributed rate limiting. Critical endpoints (like upload API routes and AI actions) are protected to prevent abuse and manage API costs.
- **Runtime Validation:** Zod schemas enforce strict validation of request payloads and function arguments across server actions (`action-utils.ts`) and API routes, acting as a guard against malformed data and ensuring type safety at the boundary layer.

## Deployment & Infrastructure

- **Vercel:** Hosts the Next.js application and API routes.
- **PostgreSQL:** Primary data store (likely Vercel Postgres or Supabase).
- **Cloudflared:** Used for local development tunneling to test webhooks and platform callbacks.
- **Worker Process:** A separate `tsx` process (`scripts/worker.ts`) runs the background polling and cleanup logic.
