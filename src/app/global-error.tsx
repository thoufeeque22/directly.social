"use client";

import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <ErrorBoundary error={error} reset={reset} />
        </div>
      </body>
    </html>
  );
}
