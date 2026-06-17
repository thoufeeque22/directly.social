import { AITier, StyleMode } from '@/lib/core/constants';
import { AIProvider } from '@/lib/core/ai';
import { AIWriteResult } from '@/lib/utils/ai-writer';

interface AIPreviewOptions {
  title: string;
  description: string;
  tier: AITier;
  mode: StyleMode;
  platforms: string[];
  customStyleText: string;
  byokConfigs: Record<string, { apiKey: string; modelId: string }> | undefined;
  aiProvider: AIProvider;
  visualData?: string[];
}

export const generateAIStrategy = async (options: AIPreviewOptions): Promise<Record<string, AIWriteResult>> => {
  const { getMultiPlatformAIPreviews } = await import('@/app/actions/ai');
  
  const previews = await getMultiPlatformAIPreviews({
    ...options,
    visualData: options.visualData || [],
  });

  return previews;
};
