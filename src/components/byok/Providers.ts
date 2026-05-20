import { AIProvider } from '@/lib/core/ai';

export const PROVIDERS: { value: AIProvider; label: string; models: { value: string; label: string }[] }[] = [
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
