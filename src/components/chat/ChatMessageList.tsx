import React from 'react';
import { Box, Typography } from '@mui/material';
import { AutoAwesome as AutoAwesomeIcon } from '@mui/icons-material';
import { UIMessage as Message } from '@ai-sdk/react';
import { ChatMessageItem } from './ChatMessageItem';
import { BRAND } from '@/lib/core/brand';

interface ChatMessageListProps {
  messages: Message[];
  status: string;
  error: Error | undefined;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatMessageList = ({ messages, status, error, scrollRef }: ChatMessageListProps) => (
  <Box 
    ref={scrollRef}
    sx={{ 
      flex: 1, 
      overflowY: 'auto', 
      p: 2, 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2,
      scrollbarWidth: 'thin',
      '&::-webkit-scrollbar': { width: 4 },
      '&::-webkit-scrollbar-thumb': { bgcolor: 'hsla(var(--muted) / 0.5)', borderRadius: 2 }
    }}
  >
    {messages.length === 0 && (
      <Box sx={{ 
        mt: 4, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        textAlign: 'center',
        color: 'hsl(var(--muted-foreground))',
        px: 3
      }}>
        <AutoAwesomeIcon sx={{ fontSize: 40, mb: 2, opacity: 0.5, color: 'primary.main' }} />
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          Hello! I&apos;m your {BRAND.name} assistant.
        </Typography>

        <Typography variant="caption" sx={{ mt: 1 }}>
          Ask me to list upcoming posts, check your media gallery, or schedule a video.
        </Typography>
      </Box>
    )}

    {messages.map((m: Message) => (
      <ChatMessageItem key={m.id} message={m} status={status} />
    ))}

    {error && (
      <Box sx={{ p: 1.5, textAlign: 'center' }}>
        <Typography data-testid="chat-error-message" variant="caption" color="error">
          {(() => {
            try {
              const parsed = JSON.parse(error.message);
              return parsed.error || error.message;
            } catch {
              return error.message || 'Failed to connect. Please check your connection and try again.';
            }
          })()}
        </Typography>
      </Box>
    )}
  </Box>
);
