import { useState } from 'react';
import { AIWriteResult } from '@/lib/utils/ai-writer';

export const useAIPreviewCache = () => {
  const [aiPreviews, setAiPreviewsInternal] = useState<Record<string, AIWriteResult>>(() => {
    if (typeof window === 'undefined') return {};
    const saved = localStorage.getItem('SS_AI_PREVIEWS_CACHE');
    if (saved) {
      try { return JSON.parse(saved); } catch { return {}; }
    }
    return {};
  });
  
  const setAiPreviews = (previews: Record<string, AIWriteResult>) => {
    setAiPreviewsInternal(previews);
    if (Object.keys(previews).length > 0) {
      localStorage.setItem('SS_AI_PREVIEWS_CACHE', JSON.stringify(previews));
    } else {
      localStorage.removeItem('SS_AI_PREVIEWS_CACHE');
      localStorage.removeItem('SS_AI_PREVIEWS_CONTEXT');
    }
  };

  const clearCache = () => {
    setAiPreviews({});
  };

  return { aiPreviews, setAiPreviews, clearCache };
};
