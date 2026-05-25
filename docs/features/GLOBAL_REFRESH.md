# Global Refresh Mechanism

## Overview

The Global Refresh mechanism provides a unified way for users to synchronize and update data across the entire application. It ensures that both server-side data (via Next.js `router.refresh()`) and client-side states (via custom events) stay consistent and up-to-date.

## User Interface

### 1. Header Refresh Button
A dedicated **Refresh Button** is located in the global application header. 
- **Feedback:** Provides visual feedback during the refresh process using a spinning animation and a "Refreshing..." tooltip state.
- **Throttling:** Prevents multiple rapid clicks to avoid redundant network requests.

### 2. Pull-to-Refresh (Mobile)
For users on mobile devices (iOS/Android), the application supports the standard **Pull-to-Refresh** gesture.
- **Implementation:** Integrated into the `LayoutWrapper` to ensure it is available across all primary dashboard views.
- **Aesthetic:** Follows the project's premium design with customized colors and smooth haptic-like transitions.

## Developer Guide: Synchronizing Data

When a refresh is triggered, the application dispatches a global `app:refresh` event. Developers should listen to this event to re-fetch custom client-side data or reset local states.

### Listening to the Refresh Event

Use the following pattern in your React components or custom hooks:

```typescript
useEffect(() => {
  const handleRefresh = () => {
    // Re-fetch data or reset state
    fetchData();
  };

  globalThis.addEventListener('app:refresh', handleRefresh);
  return () => globalThis.removeEventListener('app:refresh', handleRefresh);
}, [fetchData]);
```

### Implementation Details

- **Hook:** The logic is centralized in the `useAppRefresh` hook (`src/hooks/useAppRefresh.ts`).
- **Events Dispatched:**
  - `router.refresh()`: Re-validates server component data.
  - `app:refresh`: General event for all client-side listeners.
  - `refresh-upcoming`: Specific event for the Upcoming Posts / History listeners.
- **UX Throttling:** The refresh process includes a minimum 800ms delay to ensure that UI animations (like the spinner) are visible and satisfying to the user, even if the network request is near-instant.
