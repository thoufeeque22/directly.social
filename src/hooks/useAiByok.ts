import { useState, useEffect } from 'react';
import { AIProvider } from '@/lib/core/ai';

export interface AIByokConfig {
  apiKey: string;
  modelId: string;
}

export type AIByokState = Record<string, AIByokConfig>;

const STORAGE_KEY = 'social-studio-ai-byok';

export function useAiByok() {
  const [configs, setConfigs] = useState<AIByokState>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setConfigs(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse AI BYOK configs from localStorage', e);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveConfig = (provider: AIProvider, config: AIByokConfig) => {
    const newConfigs = { ...configs, [provider]: config };
    setConfigs(newConfigs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfigs));
  };

  const removeConfig = (provider: AIProvider) => {
    const newConfigs = { ...configs };
    delete newConfigs[provider];
    setConfigs(newConfigs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfigs));
  };

  const getConfig = (provider: AIProvider): AIByokConfig | undefined => {
    return configs[provider];
  };

  return {
    configs,
    isLoaded,
    saveConfig,
    removeConfig,
    getConfig,
  };
}
