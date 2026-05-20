'use client';

import { Badge, IconButton } from '@mui/material';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import { useState, useEffect } from 'react';
import { getUnseenUpdates } from '@/app/actions/whats-new';

interface WhatsNewBadgeProps {
  forceShow?: boolean;
}

export function WhatsNewBadge({ forceShow = false }: WhatsNewBadgeProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    getUnseenUpdates().then((updates) => setCount(updates.length));
  }, []);

  if (!forceShow && count === 0) return null;

  return (
    <Badge badgeContent={count} color="error" data-testid="whats-new-badge-container">
      <IconButton data-testid="whats-new-badge">
        <NewReleasesIcon />
      </IconButton>
    </Badge>
  );
}
