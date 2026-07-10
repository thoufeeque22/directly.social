# Media Workflows

## 1. Media Upload & Ingestion

Users upload media which is directly streamed to cloud storage (Vercel Blob) for processing and distribution, completely bypassing local serverless payload limits. The system uses a **decentralized observation pattern** where upload utilities broadcast progress to `localStorage`, allowing a persistent `UploadHUD` component to provide real-time feedback across the entire application without complex prop-drilling.

The finalization process is orchestrated by specialized modular services to ensure data integrity, SSRF validation, gallery consistency, and publishing readiness. Before distribution to platforms, the cloud blob is dynamically downloaded to the worker's temp directory via a secure Just-In-Time bridge.

```mermaid
sequenceDiagram
    participant U as User (UI)
    participant LS as localStorage (SS_STAGING_STATUS)
    participant VB as Vercel Blob
    participant API as API (/api/upload)
    participant GR as GalleryRegistration
    participant AR as ActivityRegistration
    participant VP as VideoProcessor
    participant DB as Database (Prisma)

    U->>VB: Stream Video Upload (@vercel/blob/client)
    VB-->>U: Return Blob URL
    U->>LS: Broadcast Progress (X%)

    U->>API: Finalize Upload (/assemble)
    API->>API: SSRF Validation on Blob URL
    API->>VP: getVideoMetadata() (If applicable)
    API->>GR: registerGalleryAsset(blobUrl)
    GR->>DB: Upsert GalleryAsset (Deduplication)
    API->>VP: checkTranscodeRequirement()
    API->>AR: upsertUploadActivity()
    AR->>DB: Upsert PostActivity & Platforms
    API-->>U: Return success { fileId, activityId }
    U->>LS: Clear Broadcast
```

## 2. Asset Cleanup

To maintain storage efficiency, expired assets and orphaned files are purged regularly.

```mermaid
sequenceDiagram
    participant W as Worker (Cleanup)
    participant DB as Database (Prisma)
    participant FS as File System (root tmp/)

    loop Every 1 Hour
        W->>DB: Find Expired GalleryAssets
        DB-->>W: List of Asset IDs
        W->>FS: Delete Physical Files
        W->>DB: Delete GalleryAsset Records
        
        W->>FS: Scan tmp/ for Orphaned Files (>24h)
        W->>DB: Check if Files are Tracked
        DB-->>W: Tracking Status
        W->>FS: Delete Untracked Files
    end
```

## 3. Modular Upload Infrastructure

The upload pipeline utilizes a suite of specialized services to manage the complex transition from raw binary data to a scheduled post activity.

### Core Services (`src/lib/upload/`)

- **`ChunkAssembler` (`chunk-assembler.ts`)**: Handles the physical concatenation of multi-part uploads. It ensures file integrity via size verification and manages the cleanup of temporary chunk directories.
- **`GalleryRegistration` (`gallery-registration.ts`)**: Manages the persistence of assembled files into the `GalleryAsset` table. It implements deduplication logic to prevent redundant storage of identical assets from the same user.
- **`ActivityRegistration` (`activity-registration.ts`)**: Orchestrates the initialization or update of `PostActivity` records. It handles platform-specific metadata pre-flighting and links the uploaded media to its target distribution channels.
- **`VideoProcessor` (`src/lib/video/processor.ts`)**: Provides metadata extraction (duration, resolution) and determines if the media requires transcoding for specific platform requirements (e.g., aspect ratio checks).

### Integration Logic

These services are composed within the `/api/upload/assemble` route handler, which acts as a transactional orchestrator. This modularity ensures that the upload logic is decoupled from the HTTP transport layer and can be reused in other contexts, such as background processing or administrative tools.
