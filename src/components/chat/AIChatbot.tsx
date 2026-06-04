/* eslint-disable max-lines */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat, UIMessage as Message } from '@ai-sdk/react';
import { useSession } from 'next-auth/react';
import { 
  Box, 
  IconButton, 
  Typography, 
  TextField, 
  Avatar, 
  Tooltip,
  InputAdornment,
  Paper,
  Drawer,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  AutoAwesome as AutoAwesomeIcon, 
  Close as CloseIcon, 
  Send as SendIcon,
  SmartToy as BotIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';

interface ChatWindowContentProps {
  messages: Message[];
  status: string;
  error: Error | undefined;
  manualInput: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  toggleChat: () => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  isLoading: boolean;
}

/**
 * ChatWindowContent Component
 * Renders the inner content of the chat window.
 */
const ChatWindowContent = ({ 
  messages, status, error, manualInput, handleInputChange, handleSubmit, toggleChat, scrollRef, isLoading 
}: ChatWindowContentProps) => (
  <div data-testid="chat-window" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    {/* Header */}
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
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'white' }}>
            Directly AI
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

    {/* Messages Display Area */}
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
            Hello! I&apos;m your Directly assistant.
          </Typography>

          <Typography variant="caption" sx={{ mt: 1 }}>
            Ask me to list upcoming posts, check your media gallery, or schedule a video.
          </Typography>
        </Box>
      )}

      {messages.map((m: Message) => {
        const msgRecord = m as unknown as Record<string, unknown>;
        const msgContent = typeof msgRecord.content === 'string' ? msgRecord.content : '';
        const parts = Array.isArray(m.parts) ? m.parts : [];
        
        return (
        <Box 
          key={m.id}
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
              color: 'white',
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
      )})}

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

    {/* Input Control Area */}
    <Box 
      component="form"
      onSubmit={handleSubmit}
      sx={{ 
        p: 2, 
        pb: 'calc(16px + var(--safe-area-bottom))',
        borderTop: '1px solid hsla(var(--border) / 0.5)', 
        background: 'hsla(var(--background) / 0.8)' 
      }}
    >
      <TextField
        fullWidth
        data-testid="chat-input"
        placeholder="Type a message..."
        value={manualInput}
        onChange={handleInputChange}
        disabled={isLoading}
        size="small"
        autoComplete="off"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            bgcolor: 'hsla(var(--input) / 0.2)',
            transition: 'background-color 0.2s',
            '&:hover': { bgcolor: 'hsla(var(--input) / 0.3)' },
            '&.Mui-focused': { bgcolor: 'hsla(var(--input) / 0.4)' },
          }
        }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton 
                  data-testid="chat-send-button"
                  type="submit" 
                  disabled={!manualInput.trim() || isLoading}
                  sx={{ color: 'primary.main' }}
                >
                  <SendIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }
        }}
      />
    </Box>
  </div>
);

/**
 * AIChatbot Component
 * A floating conversational assistant interface using Vercel AI SDK.
 */
export const AIChatbot = () => {
  const { update } = useSession();
  const prevStatus = useRef<string>('ready');
  const [isOpen, setIsOpen] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { messages, sendMessage, status, error } = useChat({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const isLoading = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    if (prevStatus.current === 'streaming' && (status === 'ready' || status === 'error' || status === undefined)) {
      import('@/app/actions/credits').then(({ getAiBalance }) => {
        getAiBalance().then(b => update({ aiCredits: b }));
      });
    }
    prevStatus.current = status || 'ready';
  }, [status, update]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  const toggleChat = () => setIsOpen(!isOpen);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setManualInput(e.target.value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim() || isLoading) return;
    const content = manualInput;
    setManualInput('');
    await sendMessage({ text: content });
  };

  const commonProps = { messages, status, error, manualInput, handleInputChange, handleSubmit, toggleChat, scrollRef, isLoading };

  return (
    <>
      {(!isMobile || !isOpen) && (
        <Box sx={{ 
          position: 'fixed', 
          bottom: 'calc(24px + var(--safe-area-bottom))', 
          right: 'calc(24px + var(--safe-area-right))', 
          zIndex: 1300 
        }}>
          <Tooltip title="AI Assistant" placement="left">
            <IconButton
              data-testid="chat-fab"
              onClick={toggleChat}
              sx={{
                width: 56, height: 56,
                background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, #a855f7 100%)',
                color: 'white',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                '&:hover': { transform: 'scale(1.05)', background: 'linear-gradient(135deg, hsl(var(--primary)) 20%, #a855f7 100%)' },
                transition: 'all 0.2s ease',
              }}
            >
              {isOpen ? <CloseIcon /> : <AutoAwesomeIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {isMobile ? (
        <Drawer
          anchor="bottom"
          open={isOpen}
          onClose={toggleChat}
          slotProps={{
            paper: {
              sx: {
                height: '80vh',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                background: 'hsl(var(--background))',
                backgroundImage: 'radial-gradient(at 0% 0%, hsla(var(--primary)/0.1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(var(--secondary)/0.1) 0, transparent 50%)',
              }
            }
          }}
        >
          <ChatWindowContent {...commonProps} />
        </Drawer>
      ) : (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{ position: 'fixed', bottom: 90, right: 24, width: 'min(400px, 90vw)', height: 'min(600px, 75vh)', zIndex: 1400, display: 'flex', flexDirection: 'column' }}
            >
              <GlassCard className="flex flex-col h-full !p-0 overflow-hidden shadow-2xl border-primary/20" style={{ display: 'flex', flexDirection: 'column' }}>
                <ChatWindowContent {...commonProps} />
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
};
