'use client';

import React, { useState } from 'react';
import { Badge, IconButton } from '@mui/material';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import { useWhatsNew } from '@/hooks/useWhatsNew';
import { WhatsNewPopover } from './WhatsNewPopover';

interface WhatsNewBadgeProps {
  forceShow?: boolean;
}

export function WhatsNewBadge({ forceShow = false }: WhatsNewBadgeProps) {
  const { updates } = useWhatsNew();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const count = updates.length;

  if (!forceShow && count === 0) return null;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Badge badgeContent={count} color="error" data-testid="whats-new-badge-container">
        <IconButton 
          data-testid="whats-new-badge" 
          onClick={handleClick}
          sx={{ color: count > 0 ? 'primary.main' : 'inherit' }}
        >
          <NewReleasesIcon />
        </IconButton>
      </Badge>
      <WhatsNewPopover anchorEl={anchorEl} onClose={handleClose} />
    </>
  );
}
