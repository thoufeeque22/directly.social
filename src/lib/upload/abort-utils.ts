export function checkGlobalAbort(historyId?: string): boolean {
  if (typeof window === 'undefined' || !window.localStorage || !historyId) return false;
  const raw = localStorage.getItem('SS_STAGING_STATUS');
  if (!raw) return false;
  try {
    const parsed = JSON.parse(raw);
    return parsed.historyId === historyId && parsed.active === false;
  } catch {
    return false;
  }
}

export function broadcastStatus(onStatusUpdate: (s: string) => void, historyId: string, status: string, percent?: number) {
  onStatusUpdate(status);
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem('SS_STAGING_STATUS', JSON.stringify({ status, percent, active: true, timestamp: Date.now(), historyId }));
  }
}

export function clearStagingStatus(historyId: string) {
  if (typeof window !== 'undefined' && window.localStorage) {
    const current = localStorage.getItem('SS_STAGING_STATUS');
    if (current) {
      try {
        const parsed = JSON.parse(current);
        if (parsed.historyId === historyId) localStorage.removeItem('SS_STAGING_STATUS');
      } catch { localStorage.removeItem('SS_STAGING_STATUS'); }
    }
  }
}
