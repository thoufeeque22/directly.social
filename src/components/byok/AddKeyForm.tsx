'use client';

import React from 'react';
import {
  TextField, Button, Select, MenuItem,
  FormControl, InputLabel, Alert, CircularProgress,
  Paper, IconButton, InputAdornment,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AIProvider } from '@/lib/core/ai';
import { PROVIDERS } from './Providers';
import { useAddKeyForm } from './useAddKeyForm';

interface Props {
  onSave: (provider: AIProvider, apiKey: string, modelId: string) => Promise<boolean>;
}

export function AddKeyForm({ onSave }: Props) {
  const {
    selectedProvider, apiKey, setApiKey, selectedModel, setSelectedModel,
    showPassword, isValidating, error, success,
    handleClickShowPassword, handleProviderChange, handleSave,
  } = useAddKeyForm(onSave);

  const currentProviderModels = PROVIDERS.find(p => p.value === selectedProvider)?.models || [];

  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <FormControl fullWidth>
        <InputLabel id="provider-select-label">Provider</InputLabel>
        <Select labelId="provider-select-label" value={selectedProvider} label="Provider" onChange={handleProviderChange}>
          {PROVIDERS.map((p) => (
            <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="model-select-label">Preferred Model</InputLabel>
        <Select labelId="model-select-label" value={selectedModel} label="Preferred Model" onChange={(e) => setSelectedModel(e.target.value as string)}>
          {currentProviderModels.map((m) => (
            <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        data-testid="ai-byok-key-input"
        fullWidth variant="outlined" label="API Key" type={showPassword ? 'text' : 'password'}
        value={apiKey} onChange={(e) => setApiKey(e.target.value)}
        placeholder={`Enter your API key`}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }
        }}
      />

      <Button data-testid="ai-byok-save-button" variant="contained" onClick={handleSave} disabled={isValidating || !apiKey.trim()} sx={{ mt: 1 }}>
        {isValidating ? <CircularProgress size={24} /> : 'Validate & Save Key'}
      </Button>
    </Paper>
  );
}
