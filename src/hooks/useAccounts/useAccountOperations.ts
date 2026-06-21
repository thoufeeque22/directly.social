import { useCallback } from 'react';
import { Account } from '@/lib/core/types';
import { toggleAccountDistribution, disconnectAccount as disconnectAccountAction } from '@/app/actions/user/accounts';

export function useAccountOperations(
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>
) {
  const toggleDistribution = useCallback(async (provider: string, currentStatus: boolean): Promise<void> => {
    const newStatus = !currentStatus;
    let targetAccountIds: string[] = [];

    // 1. Optimistic Update
    setAccounts(prevAccounts => {
      targetAccountIds = prevAccounts.filter(a => a.provider === provider).map(a => a.id);
      return prevAccounts.map(a => 
        a.provider === provider ? { ...a, isDistributionEnabled: newStatus } : a
      );
    });

    try {
      // 2. Execute server actions concurrently
      await Promise.all(
        targetAccountIds.map(id => toggleAccountDistribution(id, newStatus))
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
  }, [setAccounts]);

  const disconnectAccount = useCallback(async (accountId: string): Promise<void> => {
    let removedAccount: Account | undefined;
    let originalIndex = -1;

    // 1. Optimistic Update
    setAccounts(prev => {
      originalIndex = prev.findIndex(a => a.id === accountId);
      if (originalIndex !== -1) {
        removedAccount = prev[originalIndex];
      }
      return prev.filter(a => a.id !== accountId);
    });

    try {
      // 2. Execute server action
      await disconnectAccountAction(accountId);
    } catch (error) {
      // 3. Rollback on error
      console.error("Error disconnecting account. Rolling back state.", error);
      if (removedAccount && originalIndex !== -1) {
        setAccounts(prev => {
          const updated = [...prev];
          updated.splice(originalIndex, 0, removedAccount!);
          return updated;
        });
      }
      throw error;
    }
  }, [setAccounts]);

  return { toggleDistribution, disconnectAccount };
}
