import { useState } from 'react';
import { signOut } from 'next-auth/react';

interface UseDeleteAccountReturn {
  deleteAccount: () => Promise<boolean>;
  isDeleting: boolean;
}

export function useDeleteAccount(): UseDeleteAccountReturn {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch('/api/settings/account', {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete account');
      }

      await signOut({ callbackUrl: '/login' });
      return true;
    } catch (error: unknown) {
      console.error('Account deletion error:', error instanceof Error ? error.message : String(error));
      setIsDeleting(false);
      return false;
    }
  };

  return { deleteAccount, isDeleting };
}
