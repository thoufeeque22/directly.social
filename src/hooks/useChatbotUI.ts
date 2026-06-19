import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useMediaQuery, useTheme } from '@mui/material';
import { UIMessage as Message } from '@ai-sdk/react';

export const useChatbotUI = (status?: string, messages?: Message[]) => {
  const { update } = useSession();
  const prevStatus = useRef<string>('ready');
  const [isOpen, setIsOpen] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const scrollRef = useRef<HTMLDivElement>(null);

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

  return {
    isOpen,
    isMobile,
    manualInput,
    setManualInput,
    scrollRef,
    toggleChat,
    handleInputChange
  };
};
