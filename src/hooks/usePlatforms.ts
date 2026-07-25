import { useState, useEffect } from 'react';
import { PLATFORMS, Platform } from '@/lib/core/constants';
import { useSession } from 'next-auth/react';

export type PlatformView = Platform & { canToggle: boolean; isLocked: boolean };

export function usePlatforms() {
  const [platforms, setPlatforms] = useState<Platform[]>([...PLATFORMS]);

  useEffect(() => {
    fetch('/api/platforms')
      .then(res => res.json())
      .then(setPlatforms)
      .catch(console.error);
  }, []);

  const { data: session } = useSession();
  const isFree = !session?.user?.role || session.user.role === 'USER';

  const viewPlatforms: PlatformView[] = platforms.map(p => ({
    ...p,
    canToggle: p.id !== 'tiktok',
    isLocked: p.id === 'linkedin' && isFree,
  }));

  return { platforms: viewPlatforms };
}
