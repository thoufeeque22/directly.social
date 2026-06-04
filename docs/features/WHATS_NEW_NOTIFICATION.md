# What's New Notification System

The "What's New" notification system keeps users informed about the latest features, improvements, and bug fixes in Directly. It uses a non-intrusive badge in the header and a modular profile actions dropdown menu to provide both highly visible alerts and persistent, on-demand access to the changelog.

## Overview

- **Update Tracking:** New updates are stored in the `UpdateLog` table.
- **Personalized Status:** The system tracks which updates each user has seen using the `UserSeenUpdate` table.
- **Visual Cues:** A red badge appears over a "New Releases" icon in the header when there are unseen updates.
- **Persistent Access:** Even when all updates are read (badge is hidden), users can always access the complete update activity via the **What's New** link inside the user profile actions dropdown menu.
- **Instant Dismissal and Activity:** Opening the popover triggers background mark-as-seen updates, instantly clearing the global badge count to 0 for a seamless UX, and fetches recent historical updates when no unread updates remain.

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

## Components & Architecture

The feature is built with highly decoupled, modular React components, with each file limited to under 100 lines to maintain clean separation of concerns and high maintainability.

### `WhatsNewContext`
A React Context provider that handles the global client-side state for unread updates, ensuring that badge clearance propagates instantly across all triggers in the header.

### `WhatsNewBadge`
Located in the global `Header`. It renders an interactive icon button with a Material UI Badge displaying the count of unread updates.
- **Visibility:** Only visible when unread count is > 0.
- **Test ID:** `whats-new-badge`

### `WhatsNewPopover`
A Material UI Popover anchored to either the `WhatsNewBadge` or the profile avatar button.
- **Test ID:** `whats-new-modal`
- **Dismiss Button Test ID:** `whats-new-item-dismiss`

### `UserActions`
Located in the `Header`. Contains the notifications bell, post creation button, and user avatar button. Clicking the user avatar button triggers a Material UI actions menu dropdown containing:
1. **What's New** (Test ID: `whats-new-profile-link`): Opens the popover anchored to the profile avatar button.
2. **Sign Out** (Test ID: `sign-out-button`): Triggers the session termination flow.

## Server Actions

- `getUnseenUpdates()` (`src/app/actions/whats-new.ts`): Fetches all `UpdateLog` entries that do not have a corresponding `UserSeenUpdate` for the current user.
- `markUpdateAsSeen(updateId: string)` (`src/app/actions/whats-new.ts`): Creates a `UserSeenUpdate` record for the user and the specified update.
- `getHistoricalUpdates(limit: number)` (`src/app/actions/whats-new-activity.ts`): Fetches the last N read updates for the user to display as historical records.

## Administration

Currently, updates are added to the `UpdateLog` table via database migrations or direct database access (e.g., Prisma Studio). Future iterations may include an admin UI for posting updates.

### Example Seed Script
To add a new update via a script:
```typescript
await prisma.updateLog.create({
  data: {
    version: "1.1.0",
    title: "New Feature: Global Search",
    description: "You can now search through your post activity and media assets from anywhere."
  }
});
```
