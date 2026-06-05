import { useState, useEffect, useMemo } from 'react';
import { StyleMode, AITier } from '@/lib/core/constants';
import { AIProvider } from '@/lib/core/ai';
import { Account } from '@/lib/core/types';
import { useUploadStatus } from '@/hooks/useUploadStatus';
import { useDistributionEngine } from '@/hooks/dashboard/useDistributionEngine';
export { useAIPreviewCache as useDashboardAIPreviews } from '@/hooks/useAIPreviewCache';

export const useDashboardDevAccounts = (accounts: Account[], userId?: string) => {
  return useMemo(() => {
    if (
      (process.env.NODE_ENV !== 'development' && process.env.NEXT_PUBLIC_E2E !== 'true') || 
      accounts.some(a => a.id.startsWith('local-dev-'))
    ) return accounts;
    return [
      ...accounts, 
      { id: 'local-dev-1', userId: userId || 'dev-user', provider: 'youtube', providerAccountId: 'local-1', name: 'Tester Alpha', accountName: 'Tester Alpha', email: 'alpha@local.host', image: null, access_token: null, refresh_token: null, expires_at: null, token_type: null, scope: null, id_token: null, session_state: null, isDistributionEnabled: true },
      { id: 'local-dev-2', userId: userId || 'dev-user', provider: 'tiktok', providerAccountId: 'local-2', name: 'Tester Beta', accountName: 'Tester Beta', email: 'beta@local.host', image: null, access_token: null, refresh_token: null, expires_at: null, token_type: null, scope: null, id_token: null, session_state: null, isDistributionEnabled: true },
      { id: 'local-dev-3', userId: userId || 'dev-user', provider: 'facebook', providerAccountId: 'local-3', name: 'Local Gamma', accountName: 'Local Gamma', email: 'gamma@local.host', image: null, access_token: null, refresh_token: null, expires_at: null, token_type: null, scope: null, id_token: null, session_state: null, isDistributionEnabled: true }
    ];
  }, [accounts, userId]);
};

export const useDashboardAIState = (initialAITier: AITier, initialAIStyle: StyleMode, initialAIProvider: AIProvider) => {
  const [aiTier, setAiTierInternal] = useState<AITier>(initialAITier || 'Manual');
  const [aiProvider, setAiProviderInternal] = useState<AIProvider>(initialAIProvider || 'gemini');
  const [contentMode, setContentModeInternal] = useState<StyleMode>((initialAIStyle && (initialAIStyle as string) !== 'Manual') ? initialAIStyle : 'Smart');

  useEffect(() => {
    const savedTier = localStorage.getItem('SS_AI_TIER') as AITier;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedTier && ['Manual', 'Enrich', 'Generate'].includes(savedTier)) setAiTierInternal(savedTier);
    const savedProvider = localStorage.getItem('SS_AI_PROVIDER') as AIProvider;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedProvider && ['gemini', 'groq', 'ollama', 'openai', 'anthropic'].includes(savedProvider)) setAiProviderInternal(savedProvider);
    const savedMode = localStorage.getItem('SS_AI_MODE') as StyleMode;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedMode && ['Smart', 'Creative', 'Balanced'].includes(savedMode)) setContentModeInternal(savedMode);
  }, []);

  const setAiTier = async (newTier: AITier) => {
    setAiTierInternal(newTier);
    if (globalThis.localStorage) localStorage.setItem('SS_AI_TIER', newTier);
    try { const { updateAIStylePreference } = await import('@/app/actions/user'); await updateAIStylePreference(newTier); } catch (err) { console.error(err); }
  };

  const setAiProvider = async (newProvider: AIProvider) => {
    setAiProviderInternal(newProvider);
    if (globalThis.localStorage) localStorage.setItem('SS_AI_PROVIDER', newProvider);
    try { const { updateAIProviderPreference } = await import('@/app/actions/user'); await updateAIProviderPreference(newProvider); } catch (err) { console.error(err); }
  };

  const setContentMode = async (newMode: StyleMode) => {
    setContentModeInternal(newMode);
    if (globalThis.localStorage) localStorage.setItem('SS_AI_MODE', newMode);
    try { const { updateAIStyleModePreference } = await import('@/app/actions/user'); await updateAIStyleModePreference(newMode); } catch (err) { console.error(err); }
  };

  return { aiTier, setAiTier, aiProvider, setAiProvider, contentMode, setContentMode };
};

export const useDashboardUploadEngine = (devAccounts: Account[]) => {
  const { isUploading, setIsUploading, setUploadStatus, handleAbortAll } = useDistributionEngine(devAccounts);
  const { activityId: activeGlobalId, active: isGlobalActive } = useUploadStatus();
  useEffect(() => { if (isUploading && isGlobalActive === false && activeGlobalId) handleAbortAll(); }, [isUploading, isGlobalActive, activeGlobalId, handleAbortAll]);
  return { isUploading, setIsUploading, setUploadStatus, handleAbortAll };
};
