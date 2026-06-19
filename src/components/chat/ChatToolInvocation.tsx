import React from 'react';
import { Box, Typography } from '@mui/material';
import { AutoAwesome as AutoAwesomeIcon } from '@mui/icons-material';

interface ChatToolInvocationProps {
  toolState: string;
  toolName: string;
  toolResult: unknown;
}

export const ChatToolInvocation = ({ toolState, toolName, toolResult }: ChatToolInvocationProps) => (
  <Box 
    data-testid="chat-tool-invocation"
    sx={{ p: 1, borderRadius: 1, bgcolor: 'hsla(var(--primary) / 0.1)', border: '1px dashed hsla(var(--primary) / 0.3)', fontSize: '0.75rem' }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
      <AutoAwesomeIcon sx={{ fontSize: 14, color: 'primary.main' }} />
      <Typography variant="caption" sx={{ fontWeight: 600 }}>
        {toolState === 'call' || toolState === 'input-streaming' || toolState === 'input-available' ? 'Using' : 'Used'} {toolName.replace(/_/g, ' ')}
      </Typography>
    </Box>
    {(toolState === 'result' || toolResult !== undefined) && (
      <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', fontStyle: 'italic' }}>
        {typeof toolResult === 'string' ? toolResult : Array.isArray(toolResult) ? `Found ${toolResult.length} items.` : 'Action completed.'}
      </Typography>
    )}
  </Box>
);
