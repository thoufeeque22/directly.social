'use client';

import React, { Suspense } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Box, Typography, List, ListItem, ListItemButton, ListItemText, ListSubheader } from '@mui/material';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { TemplateManager } from '@/components/settings/TemplateManager';
import { GlassCard } from '@/components/ui/GlassCard';
import AiByokWizard from '@/components/AiByokWizard';
import { ByosWizard } from '@/components/settings/ByosWizard';
import { DestinationsTab } from '@/components/settings/DestinationsTab';
import { SupportTab } from '@/components/settings/SupportTab';
import { AccountTab } from '@/components/settings/AccountTab';
import { ProfileTab } from '@/components/settings/ProfileTab';
import { PreferencesTab } from '@/components/settings/PreferencesTab';
import { SecurityTab } from '@/components/settings/SecurityTab';
import { PrivacyTab } from '@/components/settings/PrivacyTab';

const SettingsContentInner = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentTab = searchParams?.get('tab') || 'profile';

  const renderContent = () => {
    switch (currentTab) {
      case 'profile': return <ProfileTab />;
      case 'preferences': return <PreferencesTab />;
      case 'security': return <SecurityTab />;
      case 'privacy': return <PrivacyTab />;
      case 'account': return <AccountTab />;
      case 'destinations': return <DestinationsTab />;
      case 'snippets': return <GlassCard style={{ padding: '2rem' }}><TemplateManager /></GlassCard>;
      case 'ai': return (
        <GlassCard style={{ padding: '2rem' }}>
          <Box><Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>AI Providers</Typography><AiByokWizard /></Box>
        </GlassCard>
      );
      case 'storage': return <ByosWizard />;
      case 'support': return <SupportTab />;
      default: return <ProfileTab />;
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto' }}>
      <SettingsHeader 
        title="Settings" 
        subtitle="Manage your profile, preferences, and account." 
      />
      <Box sx={{ mt: 2, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        <Box sx={{ width: { xs: '100%', md: '25%' }, flexShrink: 0 }}>
          <GlassCard style={{ padding: '1rem 0' }}>
            <List
              subheader={<ListSubheader sx={{ bgcolor: 'transparent', fontWeight: 600 }}>General</ListSubheader>}
            >
              {['profile', 'preferences', 'security', 'privacy', 'account'].map((tab) => (
                <ListItem key={tab} disablePadding>
                  <Link href={`${pathname}?tab=${tab}`} style={{ textDecoration: 'none', width: '100%', color: 'inherit' }}>
                    <ListItemButton selected={currentTab === tab} data-testid={`nav-${tab}`}>
                      <ListItemText primary={tab.charAt(0).toUpperCase() + tab.slice(1)} />
                    </ListItemButton>
                  </Link>
                </ListItem>
              ))}
            </List>
            <List
              subheader={<ListSubheader sx={{ bgcolor: 'transparent', fontWeight: 600 }}>App Settings</ListSubheader>}
            >
              {[
                { id: 'destinations', label: 'Destinations' },
                { id: 'snippets', label: 'Snippets' },
                { id: 'ai', label: 'AI Providers' },
                { id: 'storage', label: 'Storage' },
                { id: 'support', label: 'Support' }
              ].map((tab) => (
                <ListItem key={tab.id} disablePadding>
                  <Link href={`${pathname}?tab=${tab.id}`} style={{ textDecoration: 'none', width: '100%', color: 'inherit' }}>
                    <ListItemButton selected={currentTab === tab.id} data-testid={`nav-${tab.id}`}>
                      <ListItemText primary={tab.label} />
                    </ListItemButton>
                  </Link>
                </ListItem>
              ))}
            </List>
          </GlassCard>
        </Box>
        <Box sx={{ flexGrow: 1 }} data-testid="settings-content-pane">
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
};

const SettingsContent = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}><SettingsContentInner /></Suspense>
  );
};
export default SettingsContent;
