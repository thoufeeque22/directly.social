import { useState, useEffect } from 'react';

export const useTimeInfo = () => {
  const [now, setNow] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now()); // Initial update
    const timer = setInterval(() => setNow(Date.now()), 60 * 1000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const getRemainingTimeInfo = (expiresAt: string) => {
    if (!now) return { text: '...', isExpiringSoon: false };
    const remaining = new Date(expiresAt).getTime() - now;
    const hours = Math.max(0, Math.floor(remaining / (1000 * 60 * 60)));
    const mins = Math.max(0, Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60)));
    const isExpiringSoon = hours < 24;

    let text = `${hours}h ${mins}m remaining`;
    if (hours > 24) {
      text = `${Math.floor(hours / 24)}d ${hours % 24}h remaining`;
    }

    return { text, isExpiringSoon };
  };

  return { getRemainingTimeInfo };
}
