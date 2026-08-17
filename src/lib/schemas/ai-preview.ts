import { z } from "zod";
import { AITier, StyleMode } from "@/lib/core/constants";
import { AIProvider } from "@/lib/core/ai";

export const AIPreviewSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  tier: z.enum(['Manual', 'Enrich', 'Generate']),
  mode: z.enum(['Smart', 'Gen-Z', 'SEO', 'Story', 'Custom']),
  platforms: z.array(z.string()).min(1, "At least one platform is required"),
  visualData: z.array(z.string()).optional(),
  customStyleText: z.string().optional(),
  aiProvider: z.string().optional(),
});

export interface MultiPlatformAIPreviewParams {
  title: string;
  description: string;
  tier: AITier;
  mode: StyleMode;
  platforms: string[];
  visualData?: string[];
  customStyleText?: string;
  byokConfigs?: Record<string, { apiKey: string; modelId: string }>;
  aiProvider?: AIProvider;
}
