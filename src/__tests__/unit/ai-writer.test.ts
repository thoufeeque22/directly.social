import { describe, it, beforeEach, vi, expect } from 'vitest';
import { generatePostContent } from '../../lib/utils/ai-writer';
import { generateObjectWithFallback } from '../../lib/core/ai';

vi.mock('../../lib/core/ai', () => ({
  generateObjectWithFallback: vi.fn()
}));

describe('AI Vibe-Writer (generatePostContent)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return manual data directly without calling AI', async () => {
    const result = await generatePostContent('Manual', 'Story', 'Raw Title', 'Context', 'youtube');
    expect(result.title).toBe('Raw Title');
    expect(result.description).toBe('Context');
    expect(generateObjectWithFallback).not.toHaveBeenCalled();
  });

  it('should call generateObjectWithFallback with correct schema and parameters', async () => {
    const mockOutput = {
      title: "Viral Title",
      description: "Amazing description",
      hashtags: ["#viral", "#test"]
    };
    
    vi.mocked(generateObjectWithFallback).mockResolvedValue(mockOutput);

    const result = await generatePostContent('Generate', 'SEO', 'Input Title', 'Input Context', 'youtube');
    
    expect(result).toEqual(mockOutput);
    expect(generateObjectWithFallback).toHaveBeenCalled();
  });

  describe('Cultural Intelligence & Custom Styles', () => {
    it('Smart Mode: should use SEO strategy for YouTube', async () => {
      vi.mocked(generateObjectWithFallback).mockResolvedValue({ title: "YT", description: "Desc", hashtags: [] });

      await generatePostContent('Generate', 'Smart', 'Title', 'Context', 'youtube');
      
      const callArgs = vi.mocked(generateObjectWithFallback).mock.calls[0][0];
      expect(callArgs.systemPrompt).toContain('DISCOVERABILITY');
      expect(callArgs.systemPrompt).toContain('SEARCH engine');
    });

    it('Smart Mode: should use Gen-Z strategy for TikTok', async () => {
      vi.mocked(generateObjectWithFallback).mockResolvedValue({ title: "TT", description: "Desc", hashtags: [] });

      await generatePostContent('Generate', 'Smart', 'Title', 'Context', 'tiktok');
      
      const callArgs = vi.mocked(generateObjectWithFallback).mock.calls[0][0];
      expect(callArgs.systemPrompt).toContain('ADRENALINE & AUTHENTICITY');
      expect(callArgs.systemPrompt).toContain('ATTENTION engine');
    });

    it('Custom Mode: should inject user-defined style text', async () => {
      vi.mocked(generateObjectWithFallback).mockResolvedValue({ title: "Custom", description: "Desc", hashtags: [] });

      const customVibe = "Like a 1950s Detective";
      await generatePostContent('Generate', 'Custom', 'Title', 'Context', 'instagram', undefined, customVibe);
      
      const callArgs = vi.mocked(generateObjectWithFallback).mock.calls[0][0];
      expect(callArgs.systemPrompt).toContain('USER-DEFINED');
      expect(callArgs.systemPrompt).toContain(customVibe);
    });
  });
});
