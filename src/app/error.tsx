'use client';

import ErrorBoundary from '@/components/ui/ErrorBoundary';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <ErrorBoundary error={error} reset={reset} />
    </div>
  );
}
