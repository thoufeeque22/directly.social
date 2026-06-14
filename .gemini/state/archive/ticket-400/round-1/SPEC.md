# Technical Specification: Ticket #400 Notification Utility

## Overview
Implement a centralized notification system with a bell icon in the header. This system will inform users of important events (e.g., post publishing success/failure, AI task completion) and is distinct from the global `WhatsNew` update log.

## 1. Data Model
Add the following to `prisma/schema.prisma`:

```prisma
model Notification {
  id        String   @id @default(cuid())
  userId    String
  type      NotificationType @default(INFO)
  message   String
  isRead    Boolean  @default(false)
  link      String?
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([createdAt])
}

enum NotificationType {
  INFO
  SUCCESS
  WARNING
  ERROR
}
```

Update the `User` model:
```prisma
model User {
  // ... existing fields
  notifications Notification[]
}
```

## 2. Validation Schema
Create `src/lib/schemas/notifications.ts`:
- Define Zod schemas for fetching and marking notifications.
- Ensure strict type safety.

## 3. Server Actions
Create `src/app/actions/notifications.ts`:
- `getNotifications()`: Fetch the latest 20 notifications for the authenticated user.
- `markNotificationAsRead(id: string)`: Update a single notification's `isRead` status.
- `markAllNotificationsAsRead()`: Bulk update all unread notifications for the user.
- Use `protectedAction` from `@/lib/core/action-utils` for security.

## 4. Components (MUI & 50-Line Rule)
Replace the placeholder in `UserActions.tsx` with:

- `NotificationBell`: 
  - `IconButton` with `Badge`.
  - Displays unread count.
  - Toggles the `NotificationPopover`.
- `NotificationPopover`:
  - `Popover` anchored to the bell.
  - Contains `NotificationList`.
- `NotificationList`:
  - `List` of notifications.
  - "Mark all as read" button at the top/bottom.
  - Empty state message.
- `NotificationItem`:
  - `ListItem` with an icon based on `NotificationType`.
  - Message text and relative timestamp (e.g., "5m ago").
  - Click-to-read functionality.

## 5. Hooks
Create `src/hooks/useNotifications.ts`:
- Fetch initial state using the server action.
- Provide `unreadCount` and `notifications` list.
- Expose `markAsRead` and `markAllAsRead` functions with optimistic UI updates.

## 6. Testing Strategy (Playwright)
- **Visibility:** Verify bell icon and badge are visible in the header.
- **Interaction:** Verify clicking bell opens popover.
- **Persistence:** Verify clicking a notification marks it as read in the DB and updates the UI.
- **Bulk Action:** Verify "Mark all as read" clears the badge.
- **Empty State:** Verify "No notifications" message when the list is empty.

## 7. Definition of Ready (DoR)
- [ ] Prisma schema updated and migrated.
- [ ] Server actions implemented with error handling.
- [ ] Components broken down to adhere to the 50-line rule.
- [ ] MUI used for all UI elements (no custom CSS unless necessary).
- [ ] Zero emojis in the UI (use MUI icons instead).
- [ ] TypeScript types exported and used throughout.
