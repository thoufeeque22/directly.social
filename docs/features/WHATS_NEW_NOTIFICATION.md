# What's New Notification System

The "What's New" notification system keeps users informed about the latest features, improvements, and bug fixes in Social Studio. It uses a non-intrusive badge in the header and a modular profile actions dropdown menu to provide both highly visible alerts and persistent, on-demand access to the changelog.

## Overview

- **Update Tracking:** New updates are stored in the `UpdateLog` table.
- **Personalized Status:** The system tracks which updates each user has seen using the `UserSeenUpdate` table.
- **Visual Cues:** A red badge appears over a "New Releases" icon in the header when there are unseen updates.
- **Persistent Access:** Even when all updates are read (badge is hidden), users can always access the complete update history via the **What's New** link inside the user profile actions dropdown menu.
- **Instant Dismissal and History:** Opening the popover triggers background mark-as-seen updates, instantly clearing the global badge count to 0 for a seamless UX, and fetches recent historical updates when no unread updates remain.

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

The feature is built with highly decoupled, modular React components, with each file limited to under 50 lines to maintain clean separation of concerns and high maintainability.

### `WhatsNewContext`
A React Context provider that handles the global client-side state for unread updates, ensuring that badge clearance propagates instantly across all triggers in the header.

### `WhatsNewBadge`
Located in the global `Header`. It renders a notification badge with the current unread count over an icon button. Clicking the badge displays the `WhatsNewPopover`.
- **Test ID:** `whats-new-badge`

### `UserActions`
A modular profile dropdown menu component replacing flat header links. It renders the user's avatar as a trigger. When clicked, it opens a Material UI dropdown menu showing options including:
- **What's New:** Opens the `WhatsNewPopover` persistently.
  - **Test ID:** `whats-new-profile-link`
- **Sign Out:** Triggers the Auth.js signOut flow.
  - **Test ID:** `sign-out-button`

### `WhatsNewPopover`
A highly polished, responsive popover component anchored to either the badge or the profile dropdown menu trigger. It displays the unread updates or historical updates.
- **Test ID:** `whats-new-modal`
- If unread updates are present:
  - Renders `WhatsNewList` consisting of `WhatsNewItem` components.
  - Instantly begins marking updates as seen in the background.
  - Features a "Dismiss All" button when multiple updates are unread.
- If no unread updates are present:
  - Displays a loading indicator and fetches historical updates using `WhatsNewHistoryList`.

### `useWhatsNewPopover`
A custom hook that encapsulates popover logic, including local state buffering, background synchronization, and historical data fetching, resolving potential ESLint cascading render warnings.

## Server Actions (`src/app/actions/whats-new.ts` & `src/app/actions/whats-new-history.ts`)

- `getUnseenUpdates()`: Fetches all `UpdateLog` entries that do not have a corresponding `UserSeenUpdate` for the current user.
- `markUpdateAsSeen(updateId: string)`: Creates a `UserSeenUpdate` record for the user and the specified update. Includes robust user existence validation and session-to-token ID consistency checks.
- `getHistoricalUpdates()`: Fetches the most recent read updates for the user to populate the persistent changelog view.

## Administration

Updates are seeded or created via database migrations or direct database access (e.g., Prisma Studio).

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
