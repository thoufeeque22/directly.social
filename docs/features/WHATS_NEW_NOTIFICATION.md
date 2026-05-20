# "What's New" Notification System

The "What's New" notification system provides a mechanism to inform users about new features, improvements, and bug fixes directly within the application. It uses a non-intrusive badge in the header and a detailed modal for presenting update logs.

## Overview

- **UpdateLog Model:** Stores the version, title, and description of each update.
- **UserSeenUpdate Model:** Tracks which updates a user has already viewed to prevent repetitive notifications.
- **WhatsNewBadge:** A UI component in the header that displays a notification dot when new updates are available.
- **WhatsNewModal:** A modal that displays the list of updates and marks them as "seen" once opened.

## Data Model

### UpdateLog
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String | Unique identifier (CUID). |
| `version` | String | Semantic version or release name. |
| `title` | String | Summary of the update. |
| `description` | String | Detailed markdown-supported description of changes. |
| `createdAt` | DateTime | When the update was logged. |

### UserSeenUpdate
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String | Unique identifier (CUID). |
| `userId` | String | Foreign key to the User model. |
| `updateId` | String | Foreign key to the UpdateLog model. |
| `seenAt` | DateTime | Timestamp of when the user viewed the update. |

## Server Actions (`src/app/actions/whats-new.ts`)

- `getUpdates()`: Fetches all available update logs from the database, sorted by `createdAt`.
- `getUnseenCount()`: Returns the number of updates the current user has not yet seen.
- `markUpdatesAsSeen()`: Records the current user as having seen all currently available updates.

## UI Components

### `WhatsNewBadge.tsx`
Located in the header. It calls `getUnseenCount()` on mount and displays a "New" badge (MUI Chip) if the count is greater than zero. Clicking the badge opens the `WhatsNewModal`.

### `WhatsNewModal.tsx`
Displays the full history of updates fetched via `getUpdates()`. When opened, it triggers `markUpdatesAsSeen()` to clear the notification badge.

## Integration

The system is integrated into the `Header` component, making it accessible from any page within the application.

## Admin Usage

Currently, updates must be seeded or manually added to the `UpdateLog` table in the database. A dedicated admin UI for managing updates is planned for a future phase.
