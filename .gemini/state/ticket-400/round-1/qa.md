# QA Report: Ticket #400 Notification Utility

## VERDICT: FAIL 🔴

## Summary
The implementation fails functional verification due to isolated state management in the `useNotifications` hook. While the components individually follow the 50-line rule and MUI standards, they do not share state, leading to an inconsistent UI and significant performance issues (over-fetching).

## Test Scenarios Covered
1. **Visibility:** Verified `NotificationBell` and unread badge are visible. [PASS]
2. **Interaction:** Verified `NotificationPopover` opens on click and displays items. [PASS]
3. **Mark as Read:** Clicking a notification item should update the bell badge. [FAIL]
4. **Mark all as Read:** Clicking the bulk action should clear the bell badge. [FAIL]
5. **Empty State:** Verified "No notifications yet." message. [PASS]
6. **Performance:** Verified network requests on mount. [FAIL - Excessive fetching]

## Detailed Findings

### 1. Isolated State (Functional Bug)
The `useNotifications` hook uses local `useState`. Each component that calls the hook (`NotificationBell`, `NotificationPopover`, `NotificationList`, `NotificationItem`) creates its own independent state. 
- **Impact:** Marking a notification as read in the Popover does not update the badge count in the Bell icon until a page refresh or the next 60s poll.
- **Root Cause:** Lack of a centralized state (e.g., React Context or a state management library) for notifications.

### 2. Excessive API Requests (Performance Bug)
The `NotificationItem` component calls `useNotifications()` internally. 
- **Impact:** When the notification list is rendered (e.g., 20 items), each individual `NotificationItem` triggers its own `getNotifications` fetch on mount via the hook's `useEffect`. This results in `N+3` requests (Items + List + Popover + Bell) simultaneously.
- **Root Cause:** Hooks with side-effects (fetching) should not be used inside repeating list items if they are meant to share the same data.

### 3. Suboptimal Navigation
The `NotificationItem` uses `window.location.href` for external links but also for internal links in some cases (if logic fails), causing full page reloads.

## Automated Tests
- **File:** `src/__tests__/e2e/notifications.spec.ts`
- **Results:**
  - `Visibility of NotificationBell and Badge`: PASS
  - `Opening the NotificationPopover and verifying items`: PASS
  - `Mark as Read functionality`: FAIL (Badge count didn't update)
  - `Mark all as Read functionality`: FAIL (Badge count didn't update)
  - `Empty state visibility`: PASS

## Remediation Required
1. **Implement `NotificationProvider`:** Wrap the application (or the header area) in a Context Provider to share a single notification state across all components.
2. **Refactor `useNotifications`:** Update the hook to consume the Context instead of maintaining local state.
3. **Clean up `NotificationItem`:** Remove the `useNotifications` call from inside the item; pass the `markAsRead` function as a prop from the parent `NotificationList`.

## [2026-05-31 17:06:47] Verdict: FAIL
Isolated state management in useNotifications leads to inconsistent UI and over-fetching.

## [2026-05-31 17:25:59] Verdict: PASS
All E2E tests passed. State sync verified via NotificationProvider. Performance issue resolved by removing hook from list items.
