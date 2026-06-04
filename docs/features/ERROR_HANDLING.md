# Graceful Error Handling

Directly uses a multi-layered error handling strategy to provide a resilient user experience and detailed observability.

## Standardized Error Reporting

### `AppError` Class

The `AppError` class (`src/lib/errors.ts`) is the standard way to throw known application errors. It includes a message, a numeric status code, and a string-based error code for client-side handling.

```typescript
import { AppError } from '@/lib/errors';

// Example: Throwing a 404
throw new AppError('Resource not found', 404, 'NOT_FOUND');
```

### `handleApiError` Utility

All API routes should use the `handleApiError` utility to ensure consistent JSON responses and automatic Sentry logging for unhandled exceptions.

```typescript
import { handleApiError } from '@/lib/errors';

export async function GET() {
  try {
    // ... logic
  } catch (error) {
    return handleApiError(error);
  }
}
```

## Error Boundaries

The application uses hierarchical error boundaries to prevent a single component or route failure from crashing the entire app.

### Shared `ErrorBoundary` Component

The `ErrorBoundary` component (`src/components/ui/ErrorBoundary.tsx`) is the visual standard for all error states. It features:
- **Glass Aesthetic:** Styled with backdrop blur and semi-transparent backgrounds to match the Dashboard.
- **Sentry Integration:** Automatically logs errors to Sentry when they occur.
- **Retry Mechanism:** Provides a "Try again" button that attempts to re-render the affected segment.

### Global Safety Net

`src/app/global-error.tsx` acts as the final fallback for errors that occur in the root layout. It provides a full-page error state.

### Route-Level Isolation

`src/app/error.tsx` handles errors within specific route segments. This allows users to continue using the sidebar or navigation even if the main content area fails.

## Hydration Resilience

To prevent React hydration mismatches (where server-rendered HTML differs from the initial client render), the application uses a strict mounting guard pattern.

### The Mounting Guard Pattern

For components that rely on browser-only state (like theme detection or localStorage), state updates MUST be deferred until after the component has mounted on the client.

```tsx
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);

if (!isMounted) return null; // Or a skeleton/placeholder
```

This pattern is consistently applied in providers like `ThemeContextProvider` and hooks like `useUploadForm` to ensure "Zero Console Error" compliance.

## Best Practices

1. **Be Granular:** Use `ErrorBoundary` to wrap high-risk components (like third-party integrations) to isolate failures.
2. **Be Informative:** Provide clear, non-technical error messages to users via `AppError`.
3. **Never Swallow Errors:** Ensure all `catch` blocks either re-throw or use `handleApiError`/`Sentry.captureException`.
4. **Data Test IDs:** Always include `data-testid="error-boundary-ui"` and `data-testid="error-reset-button"` for automated E2E verification.
