/* eslint-disable max-lines */
import { streamText, convertToModelMessages } from 'ai';
import { auth } from '@/auth';
import { logger } from '@/lib/core/logger';
import { getAIModel, AIProvider } from '@/lib/core/ai';
import { getMockAiResponse } from '@/lib/testing/mock-ai-service';
import { chatTools } from '@/lib/actions/ai-chat-tools';
import { BRAND } from '@/lib/core/brand';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

/**
 * AI Chat API Route
 * Handles conversational assistant with tool calling capabilities.
 * (OO-001, CA-002): Refactored to extract mock logic and tools for SRP and modularity.
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });
  const userId = session.user.id;

  try {
    const body = await req.json();
    const { messages, byokConfigs } = body;
    const modelMessages = await convertToModelMessages(messages);

    const primaryProvider = (process.env.ACTIVE_AI_PROVIDER as AIProvider) || 'gemini';
    const byok = byokConfigs?.[primaryProvider];

    // AI Credit Consumption
    const { consumeAiCredit } = await import('@/lib/core/credits');
    try {
      await consumeAiCredit(userId, primaryProvider, byokConfigs);
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "Insufficient AI Credits") {
        return new Response(JSON.stringify({ error: error.message }), { 
          status: 402,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      throw error;
    }

    if (req.headers.get('x-e2e-test') === 'true') {
      const result = await getMockAiResponse();
      return result.toUIMessageStreamResponse();
    }

    const model = getAIModel(primaryProvider, byok ? byok.modelId : undefined, byok ? byok.apiKey : undefined);
    logger.info("Starting AI chat session", { userId, primaryProvider });

    // Initialize streaming with Vercel AI SDK
    const result = streamText({
      model,
      messages: modelMessages,
      onFinish: (event) => {
        logger.info("Chat finished", { text: event.text });
      },
      system: `You are the ${BRAND.name} AI Assistant. You help users manage their social media content. 
      You can list upcoming posts, view staged media, schedule new posts, update existing ones, and cancel/delete schedules. 
      Always be professional, helpful, and concise. 
      
      CRITICAL: After you call a tool, you MUST ALWAYS provide a short summary of the results in plain text to the user.
      Start your summary with "I've checked..." or "I have processed..." to acknowledge the action.
      DO NOT return an empty response. Even if there are no results, say so clearly.`,
      tools: chatTools, // (CA-002): Extracted tools
    });

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    logger.error("Chat API Error", error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return new Response(JSON.stringify({ error: message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
