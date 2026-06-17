import React from 'react';
import { AIProvider } from '@/lib/core/ai';

interface AIProviderSelectorProps {
  selectedProvider: AIProvider;
  onChange: (provider: AIProvider) => void;
}

const PROVIDERS: { id: AIProvider; name: string }[] = [
  { id: 'gemini', name: 'Gemini' },
  { id: 'groq', name: 'Groq' },
  { id: 'ollama', name: 'Ollama' },
  { id: 'openai', name: 'OpenAI' },
  { id: 'anthropic', name: 'Anthropic' },
];

export const AIProviderSelector: React.FC<AIProviderSelectorProps> = ({ selectedProvider, onChange }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
      <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>AI Provider</label>
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {PROVIDERS.map(provider => (
          <button
            key={provider.id}
            type="button"
            onClick={() => onChange(provider.id)}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '0.5rem',
              border: `1px solid ${selectedProvider === provider.id ? 'hsl(var(--primary))' : 'hsla(var(--border) / 0.5)'}`,
              background: selectedProvider === provider.id ? 'hsla(var(--primary) / 0.2)' : 'hsla(var(--muted) / 0.3)',
              color: selectedProvider === provider.id ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: selectedProvider === provider.id ? 700 : 500,
              transition: 'all 0.2s',
              minWidth: '70px',
              textAlign: 'center'
            }}
          >
            {provider.name}
          </button>
        ))}
      </div>
    </div>
  );
};
