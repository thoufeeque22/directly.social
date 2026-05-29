import React from 'react';
import { Box, Typography, Divider, Stack } from '@mui/material';
import { GlassCard } from '@/components/ui/GlassCard';

interface SettingsWizardCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  'data-testid'?: string;
}

export const SettingsWizardCard: React.FC<SettingsWizardCardProps> = ({
  title,
  subtitle,
  icon,
  children,
  'data-testid': testId,
}) => {
  return (
    <GlassCard style={{ overflow: 'hidden' }}>
      <Box 
        sx={{ p: 3 }} 
        data-testid={testId}
      >
        <Stack direction="row" spacing={1.5} sx={{ mb: 3, alignItems: 'center' }}>
          {icon}
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Stack>

        {subtitle && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              {subtitle}
            </Typography>
          </Box>
        )}

        <Divider sx={{ mb: 4, opacity: 0.1 }} />

        {children}
      </Box>
    </GlassCard>
  );
};
