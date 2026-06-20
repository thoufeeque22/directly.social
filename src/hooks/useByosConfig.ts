'use client';

import { useState, useEffect } from 'react';

export function useByosConfig() {
  const [hasByos, setHasByos] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    fetch('/api/settings/byos')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: unknown) => {
        const d = data as { config?: unknown } | null;
        setHasByos(!!d?.config);
      })
      .catch(() => setHasByos(false))
      .finally(() => setIsChecking(false));
  }, []);

  return { hasByos, isChecking };
}
