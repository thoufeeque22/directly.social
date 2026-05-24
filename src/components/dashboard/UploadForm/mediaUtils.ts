export const formatSize = (bytes: number | null) => {
  if (!bytes) return 'Unknown size';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
};

export const getRemainingTimeInfo = (expiresAt: string, currentTime: number) => {
  if (currentTime === 0) return { text: 'Calculating...', isExpiringSoon: false };
  const remaining = new Date(expiresAt).getTime() - currentTime;
  const hours = Math.max(0, Math.floor(remaining / (1000 * 60 * 60)));
  const mins = Math.max(0, Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60)));
  const isExpiringSoon = hours < 24;
  
  let text = `${hours}h ${mins}m left`;
  if (hours > 24) {
    text = `${Math.floor(hours / 24)}d ${hours % 24}h left`;
  }
  
  return { text, isExpiringSoon };
};
