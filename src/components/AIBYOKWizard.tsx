'use client';

import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useAiByok } from '@/hooks/useAiByok';
import { AIProvider } from '@/lib/core/ai';
import { AddKeyForm } from './byok/AddKeyForm';
import { SavedKeysList } from './byok/SavedKeysList';

import { SettingsWizardCard } from './settings/SettingsWizardCard';

export default function AiByokWizard() {
  const { configs, isLoaded, saveConfig, removeConfig } = useAiByok();

  if (!isLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleSave = async (provider: AIProvider, apiKey: string, modelId: string) => {
    saveConfig(provider, { apiKey, modelId });
    return true;
  };

  return (
    <SettingsWizardCard
      title="AI Provider Keys (BYOK)"
      subtitle="Bring your own API keys to bypass platform rate limits and access higher-tier models. Keys are securely stored only in your local browser storage."
      data-testid="ai-byok-wizard"
    >
      <AddKeyForm onSave={handleSave} />
      <SavedKeysList configs={configs} onRemove={removeConfig} />
    </SettingsWizardCard>
  );
}
