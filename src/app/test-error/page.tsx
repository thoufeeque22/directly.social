'use client';

import { useEffect } from 'react';

export default function TestErrorPage() {
  useEffect(() => {
    throw new Error('Intentional Render Error for E2E Testing');
  }, []);

  return <div>This should not render</div>;
}
