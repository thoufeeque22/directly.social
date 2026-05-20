'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Paper,
  IconButton,
  InputAdornment,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';
import { AIProvider } from '@/lib/core/ai';
import { useAiByok } from '@/hooks/useAiByok';

const PROVIDERS: { value: AIProvider; label: string; models: { value: string; label: string }[] }[] = [
  {
    value: 'openai',
    label: 'OpenAI',
    models: [
      { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
      { value: 'gpt-4o', label: 'GPT-4o' },
      { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    ],
  },
  {
    value: 'anthropic',
    label: 'Anthropic',
    models: [
      { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' },
      { value: 'claude-3-5-sonnet-20240620', label: 'Claude 3.5 Sonnet' },
      { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
    ],
  },
  {
    value: 'gemini',
    label: 'Google Gemini',
    models: [
      { value: 'gemini-1.5-flash-latest', label: 'Gemini 1.5 Flash' },
      { value: 'gemini-1.5-pro-latest', label: 'Gemini 1.5 Pro' },
    ],
  },
  {
    value: 'groq',
    label: 'Groq',
    models: [
      { value: 'llama3-8b-8192', label: 'Llama 3 (8B)' },
      { value: 'llama3-70b-8192', label: 'Llama 3 (70B)' },
      { value: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' },
    ],
  },
];

export default function AIBYOKWizard() {
  const { configs, isLoaded, saveConfig, removeConfig } = useAiByok();
  
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('openai');
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleProviderChange = (e: { target: { value: unknown } }) => {
    const provider = e.target.value as AIProvider;
    setSelectedProvider(provider);
    const defaultModel = PROVIDERS.find((p) => p.value === provider)?.models[0].value;
    if (defaultModel) setSelectedModel(defaultModel);
    setApiKey('');
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    
    if (!apiKey.trim()) {
      setError('API Key is required.');
      return;
    }

    setIsValidating(true);
    
    try {
      const response = await fetch('/api/ai/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: selectedProvider, apiKey: apiKey.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        saveConfig(selectedProvider, { apiKey: apiKey.trim(), modelId: selectedModel });
        setSuccess(`Successfully saved and validated ${PROVIDERS.find(p => p.value === selectedProvider)?.label} API key.`);
        setApiKey(''); // Clear for security
      } else {
        setError(data.error || 'Validation failed.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsValidating(false);
    }
  };

  if (!isLoaded) {
    return <CircularProgress />;
  }

  const currentProviderModels = PROVIDERS.find(p => p.value === selectedProvider)?.models || [];

  return (
    <Box sx={{ maxWidth: 600, width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        AI Provider Keys (BYOK)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Bring your own API keys to bypass platform rate limits and access higher-tier models. Keys are securely stored only in your local browser storage.
      </Typography>

      <Paper variant="outlined" sx={{ p: 3, mb: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <FormControl fullWidth>
          <InputLabel id="provider-select-label">Provider</InputLabel>
          <Select
            labelId="provider-select-label"
            value={selectedProvider}
            label="Provider"
            onChange={handleProviderChange}
          >
            {PROVIDERS.map((p) => (
              <MenuItem key={p.value} value={p.value}>
                {p.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="model-select-label">Preferred Model</InputLabel>
          <Select
            labelId="model-select-label"
            value={selectedModel}
            label="Preferred Model"
            onChange={(e) => setSelectedModel(e.target.value as string)}
          >
            {currentProviderModels.map((m) => (
              <MenuItem key={m.value} value={m.value}>
                {m.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          variant="outlined"
          label="API Key"
          type={showPassword ? 'text' : 'password'}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={`Enter your ${PROVIDERS.find(p => p.value === selectedProvider)?.label} API key`}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }
          }}
        />

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isValidating || !apiKey.trim()}
          sx={{ mt: 1 }}
        >
          {isValidating ? <CircularProgress size={24} /> : 'Validate & Save Key'}
        </Button>
      </Paper>

      {Object.keys(configs).length > 0 && (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Saved Keys
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {Object.entries(configs).map(([providerKey, config]) => {
              const providerDef = PROVIDERS.find(p => p.value === providerKey);
              const modelDef = providerDef?.models.find(m => m.value === config.modelId);
              
              return (
                <Paper key={providerKey} variant="outlined" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle2">{providerDef?.label || providerKey}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Model: {modelDef?.label || config.modelId} • Key ends in {config.apiKey.slice(-4)}
                    </Typography>
                  </Box>
                  <IconButton color="error" onClick={() => removeConfig(providerKey as AIProvider)} aria-label={`delete ${providerKey} key`}>
                    <DeleteIcon />
                  </IconButton>
                </Paper>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
}
