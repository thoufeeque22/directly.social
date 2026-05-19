import { z } from 'zod';
import { 
  AITier, 
  StyleMode,
} from '../core/constants';
import { generateObjectWithFallback } from '../core/ai';

export type Platform = 'youtube' | 'instagram' | 'tiktok' | 'facebook' | 'linkedin' | 'twitter';

export interface AIWriteResult {
  title: string;
  description: string;
  hashtags: string[];
}

// Zod schema to strictly enforce the output format for all models
const resultSchema = z.object({
  title: z.string().describe("The generated title for the social media post"),
  description: z.string().describe("The main body text or description for the post"),
  hashtags: z.array(z.string()).describe("An array of 5 relevant hashtags, including the # symbol"),
});

function buildSystemPrompt(platform: Platform, tier: AITier, mode: StyleMode, hasVisualData: boolean, customStyleText?: string): string {
  let prompt = `You are an elite social media copywriter. 
Target Platform: ${(platform || "general").toUpperCase()}.
AI Strategy: ${(tier || "generate").toUpperCase()} mode.
Task: Write a title, description, and exactly 5 hashtags.

You MUST respond strictly with valid JSON data matching the requested schema.`;

  if (hasVisualData) {
    prompt += `\nContext: You have been provided with frames from the video. Analyze the VISUAL content to generate the most accurate and engaging title and description.`;
  }

  if (tier === 'Enrich') {
    prompt += `\nGoal: The user has provided a draft. Your job is to ENRICH it—make it more engaging, fix grammar, and optimize for ${platform} while keeping the original intent.`;
  } else if (tier === 'Generate') {
    prompt += `\nGoal: The user has provided a prompt or context. Your job is to GENERATE high-performing content from scratch for ${platform}.`;
  }

  const platformConstraints: Record<Platform, string> = {
    youtube: `\nConstraints: 
- YouTube is a SEARCH engine. Prioritize SEO and Search Intent.
- The Title MUST be under 60 characters and lead with high-volume keywords.
- The Description must be keyword-dense, include a summary of the video, and use searchable phrases.
- Tone: Informative, authoritative, yet engaging.`,
    tiktok: `\nConstraints: 
- TikTok is an ATTENTION engine. Prioritize the HOOK.
- The Description must start with a scroll-stopping statement or a curiosity gap.
- Use trendy, high-energy language and Gen-Z appropriate slang if it fits the vibe.
- Keep the caption short; the visuals do the talking. Maximum 5 hashtags.
- Tone: High-energy, raw, authentic, and fast-paced.`,
    instagram: `\nConstraints: 
- Instagram is a LIFESTYLE engine. Prioritize Aesthetics and Community.
- Use emojis strategically to break up text and add personality.
- Captions should be relatable, storyteller-focused, or highly curated.
- Include a clear 'Link in Bio' or 'Save for Later' call to action.
- Tone: Aesthetic, aspirational, relatable, and community-driven.`,
    facebook: `\nConstraints: 
- Facebook is a COMMUNITY engine. Prioritize Engagement and Sharing.
- Captions should encourage conversation or tagging friends.
- Keep the tone friendly, accessible, and inclusive.`,
    linkedin: `\nConstraints: 
- LinkedIn is a PROFESSIONAL engine. Prioritize Authority and Value.
- Use professional tone, focus on insights, learning, or career growth.
- Include industry-relevant keywords.`,
    twitter: `\nConstraints: 
- Twitter (X) is a NEWS engine. Prioritize Brevity and Buzz.
- Keep the description extremely short and punchy.
- Use trending topics or mentions if relevant.`
  };
  
  if (platformConstraints[platform]) {
    prompt += platformConstraints[platform];
  }

  let activeMode = mode;
  if (mode === 'Smart') {
    if (platform === 'youtube') activeMode = 'SEO';
    else if (platform === 'tiktok') activeMode = 'Gen-Z';
    else if (platform === 'instagram') activeMode = 'Story';
    else activeMode = 'Story'; // Default fallback
  }

  const styleConstraints: Record<StyleMode, string> = {
    Smart: `\nStyle: PLATFORM-OPTIMIZED. Switch your strategy dynamically to the absolute best cultural fit for ${platform}.`,
    "Gen-Z": `\nStyle: ADRENALINE & AUTHENTICITY. Use a 'pattern interrupt' hook to stop the scroll. Use specific slang like 'no cap', 'bet', or 'fr'. High energy and raw.`,
    SEO: `\nStyle: DISCOVERABILITY. Focus on semantic keywords and phrases that people actually type into search bars. Structure content logically for search intent.`,
    Story: `\nStyle: NARRATIVE. Use the 'Hero's Journey' or a simple 'Problem-Agitation-Solution' framework. Focus on building a human connection.`,
    Custom: `\nStyle: USER-DEFINED. Use the following specific tone and style as your primary constraint: ${customStyleText || 'Be helpful and engaging.'}`
  };

  if (styleConstraints[activeMode]) {
    prompt += styleConstraints[activeMode];
  }

  return prompt;
}

/**
 * AI Vibe-Writer
 * Generates platform-specific metadata using a unified LLM layer with automatic provider fallback.
 */
export async function generatePostContent(
  tier: AITier,
  mode: StyleMode,
  rawText: string,
  videoContext: string,
  platform: Platform,
  visualData?: string[],
  customStyleText?: string
): Promise<AIWriteResult> {
  if (tier === 'Manual') {
    return {
      title: rawText || 'Untitled Video',
      description: videoContext || '',
      hashtags: ['#socialstudio'],
    };
  }

  const systemPrompt = buildSystemPrompt(platform, tier, mode, !!visualData && visualData.length > 0, customStyleText);
  const userPrompt = tier === 'Enrich' 
    ? `Draft Title: ${rawText}\nDraft Description: ${videoContext}`
    : `User Prompt: ${rawText}\nAdditional Context: ${videoContext}`;

  // Execute using the unified SDK fallback layer
  return await generateObjectWithFallback<AIWriteResult>({
    systemPrompt,
    userPrompt,
    schema: resultSchema,
    visualData: visualData,
  });
}
