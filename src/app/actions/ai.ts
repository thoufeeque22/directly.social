"use server";

import { protectedAction } from "@/lib/core/action-utils";
import { generatePostContent, AIWriteResult, Platform } from "@/lib/utils/ai-writer";
import { AITier, StyleMode } from "@/lib/core/constants";
import { z } from "zod";
import { checkRateLimit } from "@/lib/core/ratelimit";
import { aiRateLimit } from "@/lib/core/ratelimit-config";
import { logger } from "@/lib/core/logger";
import { AIProvider } from "@/lib/core/ai";

import { AIPreviewSchema, MultiPlatformAIPreviewParams } from "@/lib/schemas/ai-preview";

/**
 * GENERATES PREVIEWS FOR ALL SELECTED PLATFORMS.
 * used for the AI Review Step.
 */
export async function getMultiPlatformAIPreviews(params: MultiPlatformAIPreviewParams) {
  const {
    title,
    description,
    tier,
    mode,
    platforms,
    visualData,
    customStyleText,
    byokConfigs,
    aiProvider,
  } = params;

  return protectedAction(async function generatePreviews(userId, session) {
    if (!session.user.aiProcessingConsent) {
      throw new Error("Forbidden: You must consent to AI processing before generating content.");
    }

    // 1. Runtime Validation
    const validated = AIPreviewSchema.parse({ 
      title, 
      description, 
      tier, 
      mode, 
      platforms, 
      visualData, 
      customStyleText,
      aiProvider
    });
    
    // Use validated values to ensure type safety and correctness
    const { 
      tier: vTier, 
      platforms: vPlatforms, 
      mode: vMode 
    } = validated;

    if (vTier === 'Manual') {
      throw new Error("Cannot generate previews in Manual mode.");
    }

    // 2. Rate Limiting (Server Action - not caught by middleware)
    await checkRateLimit(aiRateLimit, userId, "AI Generation limit reached. Please wait a minute.");

    // 3. AI Credits
    const { consumeAiCredit } = await import("@/lib/core/credits");
    const activeProvider = aiProvider || (process.env.ACTIVE_AI_PROVIDER as AIProvider) || 'gemini';
    await consumeAiCredit(userId, activeProvider, byokConfigs);

    logger.info(`Generating AI previews for user ${userId}`, { platforms: vPlatforms, tier: vTier, mode: vMode, provider: aiProvider });

    const results: { platform: string, result: AIWriteResult }[] = [];

    for (const platform of vPlatforms) {
      try {
        const result = await generatePostContent(
          vTier,
          vMode,
          title,
          description,
          platform as Platform,
          visualData,
          customStyleText,
          byokConfigs,
          aiProvider
        );
        results.push({ platform, result });
      } catch (err: unknown) {
        logger.error(`AI Preview Error for ${platform}`, err);
        results.push({ 
          platform, 
          result: { 
            title: title || "Strategy Placeholder", 
            description: `AI Error: ${err instanceof Error ? err.message : 'Unknown error'}. Please try a manual prompt or a different video.`, 
            hashtags: [] 
          } as AIWriteResult 
        });
      }
    }
    
    // Convert array to record
    return results.reduce((acc, curr) => {
      acc[curr.platform] = curr.result;
      return acc;
    }, {} as Record<string, AIWriteResult>);
  });
}
