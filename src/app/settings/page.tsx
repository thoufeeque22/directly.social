"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useAccounts } from '@/hooks/useAccounts';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { DistributionGrid } from '@/components/settings/DistributionGrid';
import { ConnectionSection } from '@/components/settings/ConnectionSection';
import { TemplateManager } from '@/components/settings/TemplateManager';
import { PLATFORMS } from '@/lib/core/constants';
import { GlassCard } from '@/components/ui/GlassCard';
import { ByokWizard } from '@/components/byok/ByokWizard';
import AIBYOKWizard from '@/components/AIBYOKWizard';
import { ByosWizard } from '@/components/settings/ByosWizard';
import styles from './Settings.module.css';

import BookmarkIcon from '@mui/icons-material/Bookmark';
import LinkIcon from '@mui/icons-material/Link';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import XIcon from '@mui/icons-material/X';
import KeyIcon from '@mui/icons-material/Key';
import TuneIcon from '@mui/icons-material/Tune';
import StorageIcon from '@mui/icons-material/Storage';

import { Tabs, Tab, Box, Typography, Divider } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
}

const SettingsPage = () => {
  const { accounts, preferences, isLoading, togglePlatform, disconnectAccount } = useAccounts();
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
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
        alert("TikTok distribution is functionally complete, but is temporarily disabled pending TikTok Developer App Audit. \n\nIn Sandbox mode, TikTok strictly requires test accounts to physically be set to 'Private Account' in the mobile app before allowing API uploads. \n\nPlease submit the app for audit to unlock public posting!");
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

  const supportedByokPlatforms = PLATFORMS.filter(p => 
    ['youtube', 'tiktok', 'facebook', 'instagram'].includes(p.id)
  );

  return (
    <div className={styles.container}>
      <SettingsHeader 
        title="Settings" 
        subtitle="Configure your video distribution and automation preferences." 
      />

      <Box sx={{ width: '100%', mt: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabIndex} onChange={handleTabChange} aria-label="settings tabs">
            <Tab icon={<TuneIcon />} iconPosition="start" label="General" {...a11yProps(0)} />
            <Tab icon={<LinkIcon />} iconPosition="start" label="Connections" {...a11yProps(1)} />
            <Tab icon={<KeyIcon />} iconPosition="start" label="BYOK / AI" {...a11yProps(2)} />
            <Tab icon={<StorageIcon />} iconPosition="start" label="Storage (BYOS)" {...a11yProps(3)} />
          </Tabs>
        </Box>
        
        {/* General Tab */}
        <CustomTabPanel value={tabIndex} index={0}>
          <DistributionGrid 
            accounts={accounts} 
            preferences={preferences}
            isLoading={isLoading} 
            onToggle={handlePlatformToggle} 
          />

          <GlassCard className={styles.section} style={{ marginTop: '3rem' }}>
            <h2 className={styles.sectionTitle}>
              <BookmarkIcon sx={{ fontSize: 24, marginRight: '8px', verticalAlign: 'middle' }} /> Reusable Snippets
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', marginBottom: '1.5rem', marginTop: '-0.5rem' }}>
              Manage your saved descriptions, credits, and links for quick insertion.
            </p>
            <TemplateManager />
          </GlassCard>
        </CustomTabPanel>

        {/* Connections Tab */}
        <CustomTabPanel value={tabIndex} index={1}>
          <GlassCard className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <LinkIcon sx={{ fontSize: 24, marginRight: '8px', verticalAlign: 'middle' }} /> Platform Connections
            </h2>
            <div className={styles.connectionsGrid}>
              {isPlatformEnabled('youtube') && (
                <ConnectionSection
                  title="YouTube"
                  subtitle="Connect your Google account."
                  icon={<YouTubeIcon sx={{ color: '#FF0000' }} />}
                  provider="google"
                  color="hsl(var(--primary))"
                  onConnect={() => signIn('google')}
                  onDisconnect={handleDisconnect}
                  accounts={accounts}
                  platformLabel="YouTube Channel"
                />
              )}

              {isPlatformEnabled('instagram') && (
                <ConnectionSection
                  title="Instagram"
                  subtitle="Connect your Facebook account."
                  icon={<InstagramIcon sx={{ color: '#E4405F' }} />}
                  provider="facebook"
                  color="#E1306C"
                  onConnect={() => signIn('facebook')}
                  onDisconnect={handleDisconnect}
                  accounts={accounts}
                  platformLabel="Instagram Account"
                />
              )}

              {isPlatformEnabled('facebook') && (
                <ConnectionSection
                  title="Facebook"
                  subtitle="Post directly to your Pages."
                  icon={<FacebookIcon sx={{ color: '#1877F2' }} />}
                  provider="facebook"
                  color="#1877F2"
                  onConnect={() => signIn('facebook')}
                  onDisconnect={handleDisconnect}
                  accounts={accounts}
                  platformLabel="Facebook Account"
                />
              )}

              {isPlatformEnabled('tiktok') && (
                <ConnectionSection
                  title="TikTok"
                  subtitle="Publish videos automatically."
                  icon={<MusicNoteIcon sx={{ color: '#000000' }} />}
                  provider="tiktok"
                  color="black"
                  onConnect={() => signIn('tiktok')}
                  onDisconnect={handleDisconnect}
                  accounts={accounts}
                  platformLabel="TikTok Profile"
                />
              )}

              {isPlatformEnabled('linkedin') && (
                <ConnectionSection
                  title="LinkedIn"
                  subtitle="Share to your network."
                  icon={<BusinessCenterIcon sx={{ color: '#0A66C2' }} />}
                  provider="linkedin"
                  color="#0A66C2"
                  onConnect={() => signIn('linkedin')}
                  onDisconnect={handleDisconnect}
                  accounts={accounts}
                  platformLabel="LinkedIn Profile"
                />
              )}

              {isPlatformEnabled('twitter') && (
                <ConnectionSection
                  title="Twitter/X"
                  subtitle="Share with your followers."
                  icon={<XIcon sx={{ color: '#000000' }} />}
                  provider="twitter"
                  color="black"
                  onConnect={() => signIn('twitter')}
                  onDisconnect={handleDisconnect}
                  accounts={accounts}
                  platformLabel="Twitter Account"
                />
              )}
            </div>
          </GlassCard>
        </CustomTabPanel>

        {/* BYOK / AI Tab */}
        <CustomTabPanel value={tabIndex} index={2}>
          <GlassCard style={{ padding: '2rem' }}>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                AI Providers
              </Typography>
              <AIBYOKWizard />
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                Social Platform Integrations
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: '600px', mb: 4 }}>
                Bring Your Own Key (BYOK) allows you to use your own dedicated API quotas, 
                ensuring maximum reliability and bypassing global rate limits.
              </Typography>
              <Box 
                sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  gap: 4 
                }}
              >
                {supportedByokPlatforms.map((platform) => (
                  <ByokWizard key={platform.id} platform={platform.id} />
                ))}
              </Box>
            </Box>
          </GlassCard>
        </CustomTabPanel>

        {/* Storage (BYOS) Tab */}
        <CustomTabPanel value={tabIndex} index={3}>
          <ByosWizard />
        </CustomTabPanel>
      </Box>
    </div>
  );
};

export default SettingsPage;
