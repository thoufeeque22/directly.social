import { useState, useEffect } from 'react';
import { getUnseenUpdates } from '@/app/actions/whats-new';

export interface Update {
  id: string;
  title: string;
  description: string;
  date: string;
}

export function useWhatsNew() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getUnseenUpdates().then(u => {
      setUpdates(u);
      if (u.length > 0) setIsModalOpen(true);
    });
  }, []);

  return { updates, setUpdates, isModalOpen, setIsModalOpen };
}
