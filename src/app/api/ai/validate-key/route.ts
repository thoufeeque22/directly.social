import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { getAIModel, AIProvider } from '@/lib/core/ai';
import { logger } from '@/lib/core/logger';
import { auth } from '@/auth';
import { AIKeyValidationSchema } from '@/lib/schemas/ai';

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = AIKeyValidationSchema.parse(body);
    const { provider, apiKey } = validated;

    // Cast provider to AIProvider
    const aiProvider = provider as AIProvider;

    // Instantiate dynamic model
    const model = getAIModel(aiProvider, undefined, apiKey);

    // Attempt a lightweight generation
    const { text } = await generateText({
      model,
      prompt: 'Please respond with exactly two letters: OK',
    });

    if (text && text.trim().toUpperCase().includes('OK')) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Key validation failed. Invalid response from model.' }, { status: 400 });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.warn(`AI Provider Key Validation failed: ${errorMessage}`);
    return NextResponse.json({ success: false, error: `Validation failed: ${errorMessage}` }, { status: 400 });
  }
}
