import { useCallback } from 'react';
import { Account } from '@/lib/core/types';
import { toggleAccountDistribution, disconnectAccount as disconnectAccountAction } from '@/app/actions/user/accounts';

export function useAccountOperations(
  accounts: Account[],
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>
) {
  const toggleDistribution = useCallback(async (provider: string, currentStatus: boolean): Promise<void> => {
    const newStatus = !currentStatus;

    // 1. Optimistic Update
    setAccounts(prevAccounts => 
      prevAccounts.map(a => 
        a.provider === provider ? { ...a, isDistributionEnabled: newStatus } : a
      )
    );

    // Identify the accounts that need updating
    const targetAccounts = accounts.filter(a => a.provider === provider);

    try {
      // 2. Execute server actions concurrently
      await Promise.all(
        targetAccounts.map(a => toggleAccountDistribution(a.id, newStatus))
      );
    } catch (error) {
      // 3. Rollback on error
      console.error("Error updating account distribution. Rolling back state.", error);
      setAccounts(prevAccounts => 
        prevAccounts.map(a => 
          a.provider === provider ? { ...a, isDistributionEnabled: currentStatus } : a
        )
      );
      throw error;
    }
  }, [accounts, setAccounts]);

  const disconnectAccount = useCallback(async (accountId: string): Promise<void> => {
    const originalAccounts = [...accounts];

    // 1. Optimistic Update
    setAccounts(prev => prev.filter(a => a.id !== accountId));

    try {
      // 2. Execute server action
      await disconnectAccountAction(accountId);
    } catch (error) {
      // 3. Rollback on error
      console.error("Error disconnecting account. Rolling back state.", error);
      setAccounts(originalAccounts);
      throw error;
    }
  }, [accounts, setAccounts]);

  return { toggleDistribution, disconnectAccount };
}
