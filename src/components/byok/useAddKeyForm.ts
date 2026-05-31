import { useState } from 'react';
import { AIProvider } from '@/lib/core/ai';
import { PROVIDERS } from './Providers';
import { validateAIKeyAction } from '@/lib/actions/ai';

export function useAddKeyForm(onSave: (provider: AIProvider, apiKey: string, modelId: string) => Promise<boolean>) {
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('openai');
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-5.5-instant');
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
      const result = await validateAIKeyAction({ provider: selectedProvider, apiKey: apiKey.trim() });
      if (result.success) {
        await onSave(selectedProvider, apiKey.trim(), selectedModel);
        setSuccess(`Successfully saved and validated ${PROVIDERS.find(p => p.value === selectedProvider)?.label} API key.`);
        setApiKey('');
      } else {
        setError(result.error || 'Validation failed.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsValidating(false);
    }
  };

  return {
    selectedProvider, apiKey, setApiKey, selectedModel, setSelectedModel,
    showPassword, isValidating, error, success,
    handleClickShowPassword, handleProviderChange, handleSave,
  };
}
