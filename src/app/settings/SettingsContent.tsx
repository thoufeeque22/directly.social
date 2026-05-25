"use client";

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { TemplateManager } from '@/components/settings/TemplateManager';
import { GlassCard } from '@/components/ui/GlassCard';
import AIBYOKWizard from '@/components/AIBYOKWizard';
import { ByosWizard } from '@/components/settings/ByosWizard';
import { DestinationsTab } from '@/components/settings/DestinationsTab';
import { SettingsTabs } from '@/components/settings/SettingsTabs';
import styles from './Settings.module.css';

const SettingsContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get('tab') || 'destinations';

  const handleTabChange = (_: React.SyntheticEvent, newTab: string) => {
    router.push(`/settings?tab=${newTab}`, { scroll: false });
  };

  return (
    <div className={styles.container}>
      <SettingsHeader 
        title="Settings" 
        subtitle="Configure your video distribution and automation preferences." 
      />
      <Box sx={{ width: '100%', mt: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <SettingsTabs activeTab={activeTab} onChange={handleTabChange} />
        </Box>
        {activeTab === 'destinations' && <DestinationsTab />}
        {activeTab === 'snippets' && (
          <GlassCard style={{ padding: '2rem' }}>
            <TemplateManager />
          </GlassCard>
        )}
        {activeTab === 'ai' && (
          <GlassCard style={{ padding: '2rem' }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>AI Providers</Typography>
              <AIBYOKWizard />
            </Box>
          </GlassCard>
        )}
        {activeTab === 'storage' && <ByosWizard />}
      </Box>
    </div>
  );
};

export default SettingsContent;
