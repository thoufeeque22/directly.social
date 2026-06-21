import { useCallback } from 'react';
import { PlatformPreference } from '@/lib/core/types';
import { togglePlatformPreference as togglePlatformPreferenceAction } from '@/app/actions/user/platform';

export function usePlatformOperations(
  setPreferences: React.Dispatch<React.SetStateAction<PlatformPreference[]>>
) {
  const togglePlatform = useCallback(async (platformId: string, currentStatus: boolean): Promise<void> => {
    const newStatus = !currentStatus;

    // 1. Optimistic Update
    setPreferences(prev => {
      const existing = prev.find(p => p.platformId === platformId);
      if (existing) {
        return prev.map(p => p.platformId === platformId ? { ...p, isEnabled: newStatus } : p);
      } else {
        return [...prev, { id: 'temp', userId: 'temp', platformId, isEnabled: newStatus }];
      }
    });

    try {
      // 2. Execute server action
      await togglePlatformPreferenceAction(platformId, newStatus);
    } catch (error) {
      // 3. Rollback
      console.error("Error toggling platform preference. Rolling back state.", error);
      setPreferences(prev =>
        prev.map(p => p.platformId === platformId ? { ...p, isEnabled: currentStatus } : p)
      );
      throw error;
    }
  }, [setPreferences]);

  return { togglePlatform };
}
