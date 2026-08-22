import { z } from "zod";
import { AITier, StyleMode } from "@/lib/core/constants";
import { AIProvider } from "@/lib/core/ai";

export const AIPreviewSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().min(1, "Description is required").max(2000, "Description is too long"),
  tier: z.enum(['Manual', 'Enrich', 'Generate']),
  mode: z.enum(['Smart', 'Gen-Z', 'SEO', 'Story', 'Custom']),
  platforms: z.array(z.string().max(50)).min(1, "At least one platform is required").max(20, "Too many platforms"),
  visualData: z.array(z.string().max(1000000)).max(60, "Too many frames").optional(),
  customStyleText: z.string().max(2000, "Custom style text is too long").optional(),
  aiProvider: z.string().max(50).optional(),
  byokConfigs: z.record(z.string().max(100), z.object({
    apiKey: z.string().max(500),
    modelId: z.string().max(100)
  })).optional(),
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
