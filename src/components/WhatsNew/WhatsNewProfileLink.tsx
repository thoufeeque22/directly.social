'use client';

import React, { useState } from 'react';
import { Button } from '@mui/material';
import { WhatsNewPopover } from './WhatsNewPopover';

export function WhatsNewProfileLink() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        variant="text"
        size="small"
        data-testid="whats-new-profile-link"
        sx={{
          color: 'text.secondary',
          textTransform: 'none',
          fontSize: '0.85rem',
          fontWeight: 500,
          '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
          mx: 1,
          px: 1,
        }}
      >
        What&apos;s New
      </Button>
      <WhatsNewPopover anchorEl={anchorEl} onClose={handleClose} />
    </>
  );
}
