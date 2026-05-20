import { AIProvider } from '@/lib/core/ai';

export const PROVIDERS: { value: AIProvider; label: string; models: { value: string; label: string }[] }[] = [
  {
    value: 'openai',
    label: 'OpenAI',
    models: [
      { value: 'gpt-5.5-instant', label: 'GPT-5.5 Instant' },
      { value: 'gpt-5.5', label: 'GPT-5.5' },
      { value: 'gpt-4o', label: 'GPT-4o (Legacy)' },
    ],
  },
  {
    value: 'anthropic',
    label: 'Anthropic',
    models: [
      { value: 'claude-haiku-4-5', label: 'Claude 4.5 Haiku' },
      { value: 'claude-sonnet-4-6', label: 'Claude 4.6 Sonnet' },
      { value: 'claude-opus-4-7', label: 'Claude 4.7 Opus' },
    ],
  },
  {
    value: 'gemini',
    label: 'Google Gemini',
    models: [
      { value: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash' },
      { value: 'gemini-3.5-pro', label: 'Gemini 3.5 Pro' },
      { value: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash-Lite' },
    ],
  },
  {
    value: 'groq',
    label: 'Groq',
    models: [
      { value: 'meta-llama/llama-4-maverick-17b-128e-instruct', label: 'Llama 4 Maverick (17B)' },
      { value: 'meta-llama/llama-4-scout-17b-16e-instruct', label: 'Llama 4 Scout (17B)' },
      { value: 'qwen/qwen3-32b', label: 'Qwen 3 (32B)' },
    ],
  },
];
