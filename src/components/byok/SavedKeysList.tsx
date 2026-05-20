'use client';

import React from 'react';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { AIProvider } from '@/lib/core/ai';
import { PROVIDERS } from './Providers';
import { AIByokState } from '@/hooks/useAiByok';

interface Props {
  configs: AIByokState;
  onRemove: (provider: AIProvider) => void;
}

export function SavedKeysList({ configs, onRemove }: Props) {
  if (Object.keys(configs).length === 0) return null;

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Saved Keys
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Object.entries(configs).map(([providerKey, config]) => {
          const providerDef = PROVIDERS.find((p) => p.value === providerKey);
          const modelDef = providerDef?.models.find((m) => m.value === config.modelId);

          return (
            <Paper key={providerKey} variant="outlined" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle2">{providerDef?.label || providerKey}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Model: {modelDef?.label || config.modelId} • Key ends in {config.apiKey.slice(-4)}
                </Typography>
              </Box>
              <IconButton color="error" onClick={() => onRemove(providerKey as AIProvider)} aria-label={`delete ${providerKey} key`}>
                <DeleteIcon />
              </IconButton>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}
