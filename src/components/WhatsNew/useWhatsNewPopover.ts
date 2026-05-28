import { useState, useEffect } from 'react';
import { Update } from '@/components/WhatsNew/WhatsNewContext';
import { markUpdateAsSeen } from '@/app/actions/whats-new';
import { getRecentUpdates } from '@/app/actions/whats-new-activity';

export function useWhatsNewPopover(
  open: boolean,
  updates: Update[],
  setUpdates: (u: Update[]) => void
) {
  const [localUpdates, setLocalUpdates] = useState<Update[]>([]);
  const [historicalUpdates, setHistoricalUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (updates.length > 0) {
      const unread = [...updates];
      const timer = setTimeout(() => {
        setLocalUpdates(unread);
        setUpdates([]);
      }, 0);
      Promise.allSettled(unread.map((u) => markUpdateAsSeen(u.id)));
      return () => clearTimeout(timer);
    }
    setTimeout(() => {
      setLoading(true);
      getRecentUpdates(5)
        .then(setHistoricalUpdates)
        .catch((e) => console.error('[WhatsNewPopover] Error:', e))
        .finally(() => setLoading(false));
    }, 0);
  }, [open, updates, setUpdates]);

  return { localUpdates, setLocalUpdates, historicalUpdates, loading };
}
