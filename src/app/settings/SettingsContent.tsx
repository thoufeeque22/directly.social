'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { TemplateManager } from '@/components/settings/TemplateManager';
import { GlassCard } from '@/components/ui/GlassCard';
import AiByokWizard from '@/components/AiByokWizard';
import { ByosWizard } from '@/components/settings/ByosWizard';
import { DestinationsTab } from '@/components/settings/DestinationsTab';
import { SupportTab } from '@/components/settings/SupportTab';
import styles from './Settings.module.css';

const SettingsContent = () => {
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get('tab') || 'destinations';

  const renderContent = () => {
    switch (currentTab) {
      case 'destinations': return <DestinationsTab />;
      case 'snippets': return (
        <GlassCard style={{ padding: '2rem' }}>
          <TemplateManager />
        </GlassCard>
      );
      case 'ai': return (
        <GlassCard style={{ padding: '2rem' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>AI Providers</Typography>
            <AiByokWizard />
          </Box>
        </GlassCard>
      );
      case 'storage': return <ByosWizard />;
      case 'support': return <SupportTab />;
      default: return null;
    }
  };

  return (
    <div className={styles.container}>
      <SettingsHeader 
        title="Settings" 
        subtitle="Configure your video distribution and automation preferences." 
      />
      <Box sx={{ mt: 4 }} data-testid="settings-content-pane">
        {renderContent()}
      </Box>
    </div>
  );
};

export default SettingsContent;
