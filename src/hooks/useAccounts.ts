import { useState, useEffect } from 'react';
import { getUserAccounts } from '@/app/actions/user/accounts';
import { getPlatformPreferences } from '@/app/actions/user/platform';
import { Account, PlatformPreference } from '@/lib/core/types';
import { useAccountOperations } from './useAccounts/useAccountOperations';
import { usePlatformOperations } from './useAccounts/usePlatformOperations';

/**
 * Custom hook to fetch a list of user accounts and manage the state
 * of their distribution status with optimistic updates.
 */
export const useAccounts = (initialAccounts?: Account[], initialPreferences?: PlatformPreference[]) => {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts || []);
  const [preferences, setPreferences] = useState<PlatformPreference[]>(initialPreferences || []);
  const [isLoading, setIsLoading] = useState<boolean>(!initialAccounts);

  // Fetch accounts on mount only if not provided
  useEffect(() => {
    if (initialAccounts && initialPreferences) return;
    
    async function loadData() {
      try {
        setIsLoading(true);
        const [accountsData, prefsData] = await Promise.all([
          getUserAccounts(),
          getPlatformPreferences()
        ]);
        setAccounts(accountsData);
        setPreferences(prefsData);
      } catch (error) {
        console.error("Failed to fetch user accounts or preferences:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [initialAccounts, initialPreferences]);

  // Listen for global refresh
  useEffect(() => {
    const handleRefresh = async () => {
      const [accountsData, prefsData] = await Promise.all([
        getUserAccounts(),
        getPlatformPreferences()
      ]);
      setAccounts(accountsData);
      setPreferences(prefsData);
    };
    globalThis.addEventListener('app:refresh', handleRefresh);
    return () => globalThis.removeEventListener('app:refresh', handleRefresh);
  }, []);

  const { toggleDistribution, disconnectAccount } = useAccountOperations(setAccounts);
  const { togglePlatform } = usePlatformOperations(setPreferences);

  return {
    accounts,
    setAccounts,
    isLoading,
    toggleDistribution,
    preferences,
    togglePlatform,
    disconnectAccount,
  };
};

