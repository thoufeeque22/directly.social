'use client';

/**
 * TestErrorPage
 * This page intentionally throws an error to verify the ErrorBoundary fallback UI.
 * Used by playwright e2e tests.
 */
export default function TestErrorPage() {
  // Throw during render but only on client to pass build and trigger boundary
  if (typeof window !== 'undefined') {
    throw new Error('Intentional Render Error');
  }

  return <div>Triggering error...</div>;
}
