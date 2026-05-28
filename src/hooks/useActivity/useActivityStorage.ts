export function useActivityStorage() {
  const updateStagingStatus = (activityId: string) => {
    if (!globalThis.localStorage) return;
    const staging = localStorage.getItem('SS_STAGING_STATUS');
    if (!staging) return;
    try {
      const { activityId: stagedId } = JSON.parse(staging);
      if (stagedId === activityId || activityId === 'optimistic-pending') {
        localStorage.setItem('SS_STAGING_STATUS', JSON.stringify({
          activityId: stagedId,
          active: false,
          status: 'Stopped by user',
          timestamp: Date.now()
        }));
      }
    } catch {}
  };

  const clearPendingPost = () => {
    if (!globalThis.localStorage) return;
    localStorage.removeItem('SS_PENDING_POST');
  };

  return { updateStagingStatus, clearPendingPost };
}
