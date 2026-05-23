"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useAccounts } from '@/hooks/useAccounts';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { PlatformCard } from '@/components/settings/PlatformCard';
import { TemplateManager } from '@/components/settings/TemplateManager';
import { PLATFORMS, Platform } from '@/lib/core/constants';
import { GlassCard } from '@/components/ui/GlassCard';
import AIBYOKWizard from '@/components/AIBYOKWizard';
import { ByosWizard } from '@/components/settings/ByosWizard';
import styles from './Settings.module.css';

import LinkIcon from '@mui/icons-material/Link';
import KeyIcon from '@mui/icons-material/Key';
import TuneIcon from '@mui/icons-material/Tune';
import StorageIcon from '@mui/icons-material/Storage';
import AppsIcon from '@mui/icons-material/Apps';

import { Tabs, Tab, Box, Typography, Chip } from '@mui/material';

const TABS = [
  { id: 'destinations', label: 'Destinations', icon: <AppsIcon /> },
  { id: 'snippets', label: 'Snippets', icon: <TuneIcon /> },
  { id: 'ai', label: 'AI Providers', icon: <KeyIcon /> },
  { id: 'storage', label: 'Storage (BYOS)', icon: <StorageIcon /> },
];

const SettingsContent = () => {
  const { accounts, preferences, isLoading: isAccountsLoading, togglePlatform, disconnectAccount } = useAccounts();
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get('tab') || 'destinations';
  
  const [apiPlatforms, setApiPlatforms] = useState<Platform[]>([...PLATFORMS]);

  useEffect(() => {
    fetch('/api/platforms')
      .then(res => res.json())
      .then(data => setApiPlatforms(data))
      .catch(console.error);
  }, []);

  const activePlatforms = apiPlatforms.filter(p => p.status === 'active');
  const comingSoonPlatforms = apiPlatforms.filter(p => p.status === 'coming-soon');

  const handleTabChange = (event: React.SyntheticEvent, newTab: string) => {
    router.push(`/settings?tab=${newTab}`);
  };

  const handleDisconnect = async (accountId: string) => {
    if (!confirm('Are you sure you want to disconnect this account?')) return;
    
    try {
      await disconnectAccount(accountId);
    } catch {
      alert('Failed to disconnect account. Please try again.');
    }
  };

  const handlePlatformToggle = async (platformId: string, provider: string, currentStatus: boolean) => {
    try {
      if (platformId === 'tiktok' && currentStatus === false) {
        alert("TikTok distribution is functionally complete, but is temporarily disabled pending TikTok Developer App Audit.");
        return; 
      }
      await togglePlatform(platformId, currentStatus);
    } catch {
      alert('Failed to update settings. Please try again.');
    }
  };

  const isPlatformEnabled = (platformId: string) => {
    return preferences.some(p => p.platformId === platformId && p.isEnabled);
  };

  return (
    <div className={styles.container}>
      <SettingsHeader 
        title="Settings" 
        subtitle="Configure your video distribution and automation preferences." 
      />

      <Box sx={{ width: '100%', mt: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            aria-label="settings tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            {TABS.map((tab) => (
              <Tab 
                key={tab.id}
                value={tab.id}
                icon={tab.icon} 
                iconPosition="start" 
                label={tab.label} 
              />
            ))}
          </Tabs>
        </Box>
        
        {activeTab === 'destinations' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Connected Platforms</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                {activePlatforms.map((platform) => (
                  <PlatformCard
                    key={platform.id}
                    platform={platform}
                    isEnabled={isPlatformEnabled(platform.id)}
                    onToggle={handlePlatformToggle}
                    accounts={accounts}
                    onConnect={() => signIn(platform.provider)}
                    onDisconnect={handleDisconnect}
                  />
                ))}
              </Box>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Roadmap / Coming Soon</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                {comingSoonPlatforms.map((platform) => (
                  <GlassCard key={platform.id} style={{ opacity: 0.6, filter: 'grayscale(1)', cursor: 'not-allowed' }}>
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {platform.icon as React.ReactNode}
                        <Typography variant="h6">{platform.name}</Typography>
                      </Box>
                      <Chip label="Coming Soon" size="small" />
                    </Box>
                  </GlassCard>
                ))}
                
                <GlassCard style={{ border: '2px dashed var(--mui-palette-divider)' }}>
                  <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Something else?</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>Suggest a platform you'd like to see next.</Typography>
                    </Box>
                    <button 
                      onClick={() => alert("Thanks! We've logged your request for a new integration.")}
                      style={{ 
                        padding: '8px 16px', 
                        borderRadius: '8px', 
                        border: 'none', 
                        background: 'hsl(var(--primary))', 
                        color: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      Suggest Platform
                    </button>
                  </Box>
                </GlassCard>
              </Box>
            </Box>
          </Box>
        )}

        {activeTab === 'snippets' && (
          <GlassCard style={{ padding: '2rem' }}>
            <TemplateManager />
          </GlassCard>
        )}

        {activeTab === 'ai' && (
          <GlassCard style={{ padding: '2rem' }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                AI Providers
              </Typography>
              <AIBYOKWizard />
            </Box>
          </GlassCard>
        )}

        {activeTab === 'storage' && (
          <ByosWizard />
        )}
      </Box>
    </div>
  );
};

export default SettingsContent;
