# Transactional Notification System

The Notification Utility provides a centralized, in-app alert system for transactional events, distinct from the global "What's New" release log. It uses a bell icon in the header to display real-time updates regarding background tasks, such as post publishing status or AI processing completions.

## Overview

- **Update Tracking:** Notifications are stored in the `Notification` table, linked directly to the user.
- **Visual Cues:** A badge appears over the bell icon in the header, displaying the exact count of unread notifications.
- **Centralized State:** A React Context (`NotificationProvider`) manages the polling and state synchronization across the UI, preventing redundant API calls and ensuring immediate badge updates when items are read.
- **Type-Specific UX:** Notifications feature specific icons and styling based on their type (e.g., Success, Warning, Error, Info).

## Data Models

### `Notification`
Stores individual alerts.
- `id`: Unique identifier (CUID).
- `userId`: Reference to the recipient user.
- `type`: Enum (`INFO`, `SUCCESS`, `WARNING`, `ERROR`).
- `message`: The alert content.
- `isRead`: Boolean status flag.
- `link`: Optional URL for navigation.
- `createdAt`: Timestamp.

## Components & Architecture

The feature follows the strict 50-line modularity rule, utilizing Material UI (MUI) components exclusively.

### `NotificationProvider` & `NotificationContext`
A React Context provider located in `src/components/Notifications/NotificationContext.tsx`. It acts as the single source of truth, polling the server every 60 seconds and distributing the state (`notifications`, `unreadCount`) and actions (`markAsRead`, `markAllAsRead`) to consumers.

### `NotificationBell`
Located in the global `Header` via `UserActions`. It renders an interactive icon button with a Material UI Badge displaying the `unreadCount`. Clicking it toggles the `NotificationPopover`.

### `NotificationPopover`
A Material UI Popover anchored to the `NotificationBell`. It contains the header (with a bulk "Mark all as read" action) and hosts the `NotificationList`.

### `NotificationList` & `NotificationItem`
- **List:** Manages the iteration of items and empty state rendering.
- **Item:** A pure presentational component displaying the message, relative timestamp, and a type-specific icon (sourced from `NotificationIcons.tsx`). Clicking an item marks it as read and navigates to the associated `link` if present.

## Server Actions

Located in `src/app/actions/notifications.ts`, secured by `protectedAction`:
- `getNotifications()`: Fetches the 20 most recent notifications for the authenticated user.
- `markNotificationAsRead(id: string)`: Updates a single notification's read status.
- `markAllNotificationsAsRead()`: Bulk updates all unread notifications for the user to read.
