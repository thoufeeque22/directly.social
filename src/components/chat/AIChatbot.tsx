/* eslint-disable max-lines */
'use client';

import React from 'react';
import { useChat } from '@ai-sdk/react';
import { 
  Box, 
  IconButton, 
  Tooltip,
  Drawer
} from '@mui/material';
import { 
  AutoAwesome as AutoAwesomeIcon, 
  Close as CloseIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';

import { useChatbotUI } from '@/hooks/useChatbotUI';
import { ChatHeader } from './ChatHeader';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';

export const AIChatbot = () => {
  const { messages, sendMessage, status, error } = useChat({});
  
  const {
    isOpen,
    isMobile,
    manualInput,
    setManualInput,
    scrollRef,
    toggleChat,
    handleInputChange
  } = useChatbotUI(status, messages);

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim() || isLoading) return;
    const content = manualInput;
    setManualInput('');
    await sendMessage({ text: content });
  };

  const chatWindowContent = (
    <div data-testid="chat-window" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ChatHeader toggleChat={toggleChat} />
      <ChatMessageList messages={messages} status={status} error={error} scrollRef={scrollRef} />
      <ChatInput manualInput={manualInput} handleInputChange={handleInputChange} handleSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );

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
                color: 'hsl(var(--primary-foreground))',
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
          {chatWindowContent}
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
                {chatWindowContent}
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
};
