/* eslint-disable max-lines */
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';
import { createOllama } from 'ai-sdk-ollama';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { generateObject, LanguageModel } from 'ai';
import { ModelMessage } from '@ai-sdk/provider-utils';
import { z } from 'zod';
import { logger } from './logger';
import { OLLAMA_DEFAULT_BASE_URL, OLLAMA_DEFAULT_MODEL } from './constants';

export type AIProvider = 'gemini' | 'groq' | 'ollama' | 'openai' | 'anthropic';

// Initialize providers lazily via factory functions for system keys
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || 'no-key',
});

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || 'no-key',
});

const ollama = createOllama({
  baseURL: process.env.OLLAMA_BASE_URL || OLLAMA_DEFAULT_BASE_URL,
});

/**
 * Returns the configured Language Model instance based on the provider string.
 * Supports dynamic instantiation for BYOK keys to prevent cross-tenant leaks.
 */
export function getAIModel(provider: AIProvider, modelId?: string, byokKey?: string): LanguageModel {
  if (byokKey) {
    // Dynamic instantiation for BYOK
    switch (provider) {
      case 'openai':
        return createOpenAI({ apiKey: byokKey })(modelId || 'gpt-5.5-instant');
      case 'anthropic':
        return createAnthropic({ apiKey: byokKey })(modelId || 'claude-haiku-4-5');
      case 'groq':
        return createGroq({ apiKey: byokKey })(modelId || 'meta-llama/llama-4-maverick-17b-128e-instruct');
      case 'gemini':
        return createGoogleGenerativeAI({ apiKey: byokKey })(modelId || 'gemini-3.5-flash');
      case 'ollama':
      default:
        throw new Error(`BYOK is not currently supported for provider: ${provider}`);
    }
  }

  // System defaults
  switch (provider) {
    case 'openai':
      return createOpenAI({ apiKey: process.env.OPENAI_API_KEY || 'no-key' })(modelId || 'gpt-5.5-instant');
    case 'anthropic':
      return createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY || 'no-key' })(modelId || 'claude-haiku-4-5');
    case 'groq':
      return groq(modelId || 'meta-llama/llama-4-maverick-17b-128e-instruct');
    case 'ollama':
      return ollama(modelId || process.env.OLLAMA_MODEL || OLLAMA_DEFAULT_MODEL);
    case 'gemini':
    default:
      return google(modelId || 'gemini-3.5-flash');
  }
}

/**
 * Returns the ordered fallback chain based on the primary provider.
 */
function getFallbackChain(primary: AIProvider): AIProvider[] {
  if (primary === 'openai') return ['openai', 'anthropic', 'gemini'];
  if (primary === 'anthropic') return ['anthropic', 'openai', 'gemini'];
  if (primary === 'groq') return ['groq', 'gemini', 'ollama'];
  if (primary === 'ollama') return ['ollama'];
  return ['gemini', 'groq', 'ollama'];
}

export interface FallbackOptions<T> {
  systemPrompt: string;
  userPrompt: string;
  schema: z.ZodSchema<T>;
  modelIdOverride?: string;
  visualData?: string[];
  byokConfigs?: Record<string, { apiKey: string; modelId: string }>;
}

/**
 * Executes structured object generation with automatic provider fallback.
 * Uses the Vercel AI SDK `generateObject` under the hood.
 */
export async function generateObjectWithFallback<T>(options: FallbackOptions<T>): Promise<T> {
  const primaryProvider = (process.env.ACTIVE_AI_PROVIDER as AIProvider) || 'gemini';
  const fallbackChain = getFallbackChain(primaryProvider);

  let lastError: Error | null = null;

  for (const provider of fallbackChain) {
    try {
      const byok = options.byokConfigs?.[provider];
      logger.info(`Attempting AI generation with provider: ${provider}${byok ? ' (BYOK)' : ''}`);
      const model = getAIModel(
        provider, 
        byok ? byok.modelId : options.modelIdOverride, 
        byok ? byok.apiKey : undefined
      );

      // Build messages array for multi-modal support
      const messages: ModelMessage[] = [];

      if (options.visualData && options.visualData.length > 0) {
        const parts: UserMessageContentPart[] = [
          { type: 'text' as const, text: options.userPrompt }
        ];

        options.visualData.forEach(base64 => {
          const base64Data = base64.includes(';base64,')
            ? base64.split(';base64,')[1]
            : base64;
          parts.push({
            type: 'file' as const,
            data: base64Data,
            mediaType: 'image/jpeg',
          });
        });

        messages.push({ role: 'user', content: parts });
      } else {
        messages.push({ role: 'user', content: [{ type: 'text', text: options.userPrompt }] });
      }

      const result = await generateObject({
        model,
        system: options.systemPrompt,
        messages,
        schema: options.schema,
        temperature: 0.7,
      });

      logger.info(`AI generation succeeded with provider: ${provider}`);
      return result.object;
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error));
      logger.warn(`AI Provider '${provider}' failed: ${lastError.message}`);
      
      const byok = options.byokConfigs?.[provider];
      // Explicit error handling for BYOK auth/quota issues
      if (byok) {
        const errorMsg = lastError.message.toLowerCase();
        if (errorMsg.includes('401') || errorMsg.includes('403') || errorMsg.includes('unauthorized') || errorMsg.includes('quota') || errorMsg.includes('429')) {
          throw new Error(`Your API key for ${provider} failed (Auth/Quota). Please update your key in Settings.`);
        }
      }
    }
  }

  logger.error('All AI providers failed in fallback chain', { lastError });
  throw lastError ?? new Error('All AI providers failed.');
}

// Internal type for building multi-modal user message content
type UserMessageContentPart =
  | { type: 'text'; text: string }
  | { type: 'file'; data: string; mediaType: string };
