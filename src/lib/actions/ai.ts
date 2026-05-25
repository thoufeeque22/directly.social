'use server';

import { generateText } from 'ai';
import { getAIModel, AIProvider } from '@/lib/core/ai';
import { protectedAction } from '@/lib/core/action-utils';
import { AIKeyValidationSchema } from '@/lib/schemas/ai';

/**
 * Validates an AI provider API key.
 * This is a Server Action version of the /api/ai/validate-key route.
 */
export async function validateAIKeyAction(data: unknown) {
  return protectedAction(async () => {
    // 1. Validation
    const validated = AIKeyValidationSchema.parse(data);
    const { provider, apiKey } = validated;

    // 2. Model Instantiation
    const aiProvider = provider as AIProvider;
    const model = getAIModel(aiProvider, undefined, apiKey);

    // 3. Validation Generation
    const { text } = await generateText({
      model,
      prompt: 'Please respond with exactly two letters: OK',
    });

    if (text && text.trim().toUpperCase().includes('OK')) {
      return { success: true };
    } else {
      throw new Error('Key validation failed. Invalid response from model.');
    }
  });
}
