import { UIMessage as Message } from '@ai-sdk/react';
import React from 'react';

export interface ChatWindowContentProps {
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
