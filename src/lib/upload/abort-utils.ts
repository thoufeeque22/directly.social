export function checkGlobalAbort(activityId?: string): boolean {
  if (typeof window === 'undefined' || !window.localStorage || !activityId) return false;
  const raw = typeof window.localStorage.getItem === 'function' ? window.localStorage.getItem('SS_STAGING_STATUS') : null;
  if (!raw) return false;
  try {
    const parsed = JSON.parse(raw);
    return parsed.activityId === activityId && parsed.active === false;
  } catch {
    return false;
  }
}

export function broadcastStatus(onStatusUpdate: (s: string) => void, activityId: string, status: string, percent?: number) {
  onStatusUpdate(status);
  if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.setItem === 'function') {
    window.localStorage.setItem('SS_STAGING_STATUS', JSON.stringify({ status, percent, active: true, timestamp: Date.now(), activityId }));
  }
}

export function clearStagingStatus(activityId: string) {
  if (typeof window !== 'undefined' && window.localStorage) {
    if (typeof window.localStorage.getItem !== 'function' || typeof window.localStorage.removeItem !== 'function') return;
    const current = window.localStorage.getItem('SS_STAGING_STATUS');
    if (current) {
      try {
        const parsed = JSON.parse(current);
        if (parsed.activityId === activityId) window.localStorage.removeItem('SS_STAGING_STATUS');
      } catch { window.localStorage.removeItem('SS_STAGING_STATUS'); }
    }
  }
}
