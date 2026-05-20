'use client';

import { Badge, IconButton } from '@mui/material';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import { useState, useEffect } from 'react';
import { getUnseenUpdates } from '@/app/actions/whats-new';
import { WhatsNewModal } from './WhatsNewModal';

export function WhatsNewBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    getUnseenUpdates().then((updates) => setCount(updates.length));
  }, []);

  if (count === 0) return null;

  return (
    <Badge badgeContent={count} color="error">
      <IconButton>
        <NewReleasesIcon />
      </IconButton>
    </Badge>
  );
}
