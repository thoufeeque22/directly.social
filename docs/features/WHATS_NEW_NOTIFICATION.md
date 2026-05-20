# What's New Notification System

The "What's New" notification system keeps users informed about the latest features, improvements, and bug fixes in Social Studio. It uses a non-intrusive badge in the header and a modal to display update details.

## Overview

- **Update Tracking:** New updates are stored in the `UpdateLog` table.
- **Personalized Status:** The system tracks which updates each user has seen using the `UserSeenUpdate` table.
- **Visual Cues:** A red badge appears over a "New Releases" icon in the header when there are unseen updates.
- **Dismissal:** Users can dismiss updates individually by clicking "Got it" in the modal.

## Data Models

### `UpdateLog`
Stores the content of the updates.
- `version`: The version string (e.g., "1.2.0").
- `title`: Short summary of the update.
- `description`: Detailed explanation.
- `createdAt`: When the update was announced.

### `UserSeenUpdate`
Tracks the relationship between users and updates they have acknowledged.
- `userId`: Reference to the user.
- `updateId`: Reference to the update.
- `seenAt`: Timestamp of acknowledgement.

## Components

### `WhatsNewBadge`
Located in the global `Header`. It polls (on mount) for unseen updates for the current user.
- **Test ID:** `whats-new-badge`

### `WhatsNewModal`
Triggered by clicking the badge. Displays a list of unseen updates.
- **Test ID:** `whats-new-modal`
- **Dismiss Button Test ID:** `whats-new-modal-close`

## Server Actions (`src/app/actions/whats-new.ts`)

- `getUnseenUpdates()`: Fetches all `UpdateLog` entries that do not have a corresponding `UserSeenUpdate` for the current user.
- `markUpdateAsSeen(updateId: string)`: Creates a `UserSeenUpdate` record for the user and the specified update.

## Administration

Currently, updates are added to the `UpdateLog` table via database migrations or direct database access (e.g., Prisma Studio). Future iterations may include an admin UI for posting updates.

### Example Seed Script
To add a new update via a script:
```typescript
await prisma.updateLog.create({
  data: {
    version: "1.1.0",
    title: "New Feature: Global Search",
    description: "You can now search through your post history and media assets from anywhere."
  }
});
```
