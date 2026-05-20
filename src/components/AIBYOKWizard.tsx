'use client';

import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useAiByok } from '@/hooks/useAiByok';
import { AIProvider } from '@/lib/core/ai';
import { AddKeyForm } from './byok/AddKeyForm';
import { SavedKeysList } from './byok/SavedKeysList';

export default function AIBYOKWizard() {
  const { configs, isLoaded, saveConfig, removeConfig } = useAiByok();

  if (!isLoaded) {
    return <CircularProgress />;
  }

  const handleSave = async (provider: AIProvider, apiKey: string, modelId: string) => {
    saveConfig(provider, { apiKey, modelId });
    return true;
  };

  return (
    <Box sx={{ maxWidth: 600, width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        AI Provider Keys (BYOK)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Bring your own API keys to bypass platform rate limits and access higher-tier models. Keys are securely stored only in your local browser storage.
      </Typography>

      <AddKeyForm onSave={handleSave} />
      <SavedKeysList configs={configs} onRemove={removeConfig} />
    </Box>
  );
}
