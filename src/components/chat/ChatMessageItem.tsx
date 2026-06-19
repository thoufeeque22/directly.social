import React from 'react';
import { Box, Avatar, Paper, Typography } from '@mui/material';
import { SmartToy as BotIcon } from '@mui/icons-material';
import { UIMessage as Message } from '@ai-sdk/react';
import { motion } from 'framer-motion';
import { ChatToolInvocation } from './ChatToolInvocation';

interface ChatMessageItemProps {
  message: Message;
  status: string;
}

export const ChatMessageItem = ({ message: m, status }: ChatMessageItemProps) => {
  const msgRecord = m as unknown as Record<string, unknown>;
  const msgContent = typeof msgRecord.content === 'string' ? msgRecord.content : '';
  const parts = Array.isArray(m.parts) ? m.parts : [];
  
  return (
    <Box 
      data-testid={m.role === 'user' ? 'chat-message-user' : 'chat-message-assistant'}
      sx={{
        display: 'flex',
        justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
        gap: 1.5,
      }}
    >
      {m.role !== 'user' && (
        <Avatar sx={{ width: 28, height: 28, bgcolor: 'secondary.main', fontSize: '0.8rem' }}>
          <BotIcon sx={{ fontSize: 16 }} />
        </Avatar>
      )}
      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          maxWidth: '85%',
          borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          bgcolor: m.role === 'user' ? 'primary.main' : 'hsla(var(--accent) / 0.5)',
          color: m.role === 'user' ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))',
          border: m.role === 'user' ? 'none' : '1px solid hsla(var(--border) / 0.3)',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {msgContent && (
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
              {msgContent}
            </Typography>
          )}

          {parts.length > 0 && parts.map((part: unknown, i: number) => {
            const partRecord = part as unknown as Record<string, unknown>;
            const isText = partRecord.type === 'text';
            const textVal = typeof partRecord.text === 'string' ? partRecord.text : '';
            const isLegacyTool = partRecord.type === 'tool-invocation';
            const isModernTool = typeof partRecord.type === 'string' && (partRecord.type.startsWith('tool-') || partRecord.type === 'dynamic-tool');
            const isTool = isLegacyTool || isModernTool;
            
            let toolState = '', toolName = '', toolResult: unknown = null;
            if (isLegacyTool && partRecord.toolInvocation && typeof partRecord.toolInvocation === 'object') {
              const invocation = partRecord.toolInvocation as Record<string, unknown>;
              toolState = typeof invocation.state === 'string' ? invocation.state : '';
              toolName = typeof invocation.toolName === 'string' ? invocation.toolName : '';
              toolResult = invocation.result;
            } else if (isModernTool) {
              toolState = typeof partRecord.state === 'string' ? partRecord.state : '';
              toolName = typeof partRecord.toolName === 'string' ? partRecord.toolName : (typeof partRecord.type === 'string' ? partRecord.type.replace('tool-', '') : '');
              toolResult = partRecord.output || partRecord.result;
            }

            return (
            <React.Fragment key={i}>
              {isText && textVal && textVal !== msgContent && (
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                  {textVal}
                </Typography>
              )}
              {isTool && (
                <ChatToolInvocation toolState={toolState} toolName={toolName} toolResult={toolResult} />
              )}
            </React.Fragment>
          )})}
          
          {m.role === 'assistant' && !msgContent && parts.every((p: unknown) => (p as Record<string, unknown>).type !== 'text' || !(p as Record<string, unknown>).text) && status !== 'streaming' && (
            <Typography variant="body2" sx={{ fontStyle: 'italic', opacity: 0.8 }}>
              {parts.some((p: unknown) => typeof (p as Record<string, unknown>).type === 'string' && ((p as Record<string, unknown>).type as string).includes('tool')) ? 'Processed your request.' : 'I couldn\'t find a way to help with that.'}
            </Typography>
          )}
          
          {m.role === 'assistant' && !msgContent && parts.every((p: unknown) => (p as Record<string, unknown>).type !== 'text' || !(p as Record<string, unknown>).text) && status === 'streaming' && (
            <Box sx={{ display: 'flex', gap: 0.5, py: 0.5 }}>
              {[0, 1, 2].map((i) => (
                <motion.div key={i} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }} style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'currentColor' }} />
              ))}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
