import { useState, useEffect } from 'react';
import { PLATFORMS, Platform } from '@/lib/core/constants';
export type PlatformView = Platform & { canToggle: boolean; isLocked: boolean };

export function usePlatforms() {
  const [platforms, setPlatforms] = useState<PlatformView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('/api/platforms')
      .then(res => res.json())
      .then(data => {
        setPlatforms(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err);
        setIsLoading(false);
      });
  }, []);

  return { platforms, isLoading, error };
}
