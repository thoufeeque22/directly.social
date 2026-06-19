import React from 'react';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import { Close as CloseIcon, SmartToy as BotIcon } from '@mui/icons-material';
import { BRAND } from '@/lib/core/brand';

interface ChatHeaderProps {
  toggleChat: () => void;
}

export const ChatHeader = ({ toggleChat }: ChatHeaderProps) => (
  <Box sx={{ 
    p: 2, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    borderBottom: '1px solid hsla(var(--border) / 0.5)',
    background: 'hsla(var(--primary) / 0.1)',
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
        <BotIcon fontSize="small" />
      </Avatar>
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'hsl(var(--foreground))' }}>
          {BRAND.name} AI
        </Typography>
        <Typography variant="caption" sx={{ color: 'hsl(var(--muted-foreground))' }}>
          Always active
        </Typography>
      </Box>
    </Box>
    <IconButton 
      data-testid="chat-close-button"
      size="small" 
      onClick={toggleChat} 
      sx={{ color: 'hsl(var(--muted-foreground))' }}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  </Box>
);
