/**
 * AI Provider Fallback Chain Tests
 * Automates the manual test cases from docs/manual_tests/373-multi-provider-ai-strategy.md
 */
import { describe, it, beforeEach, vi, expect } from 'vitest';
import { generateObjectWithFallback, getAIModel } from '../../lib/core/ai';
import { z } from 'zod';

// Mock the entire 'ai' module to intercept generateObject calls
vi.mock('ai', () => ({
  generateObject: vi.fn(),
}));

// Mock provider factories to avoid real SDK initialization
vi.mock('@ai-sdk/google', () => ({
  createGoogleGenerativeAI: () => (modelId: string) => ({ provider: 'gemini', modelId }),
}));
vi.mock('@ai-sdk/groq', () => ({
  createGroq: () => (modelId: string) => ({ provider: 'groq', modelId }),
}));
vi.mock('ai-sdk-ollama', () => ({
  createOllama: () => (modelId: string) => ({ provider: 'ollama', modelId }),
}));

const { generateObject } = await import('ai');

const testSchema = z.object({
  title: z.string(),
  description: z.string(),
  hashtags: z.array(z.string()),
});

type TestResult = z.infer<typeof testSchema>;

const mockResult: TestResult = {
  title: 'Test Title',
  description: 'Test Description',
  hashtags: ['#test'],
};

describe('AI Provider Factory (getAIModel)', () => {
  it('returns a gemini model by default', () => {
    const model = getAIModel('gemini');
    expect(model).toHaveProperty('provider', 'gemini');
  });

  it('returns a groq model when specified', () => {
    const model = getAIModel('groq');
    expect(model).toHaveProperty('provider', 'groq');
  });

  it('returns an ollama model when specified', () => {
    const model = getAIModel('ollama');
    expect(model).toHaveProperty('provider', 'ollama');
  });

  it('accepts a custom modelId override', () => {
    const model = getAIModel('groq', 'mixtral-8x7b-32768');
    expect(model).toHaveProperty('modelId', 'mixtral-8x7b-32768');
  });
});

describe('Automatic Fallback Chain (generateObjectWithFallback)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('ACTIVE_AI_PROVIDER', 'gemini');
  });

  it('succeeds on the first provider without triggering fallback', async () => {
    vi.mocked(generateObject).mockResolvedValueOnce({ object: mockResult } as never);

    const result = await generateObjectWithFallback<TestResult>({
      systemPrompt: 'Test system',
      userPrompt: 'Test user',
      schema: testSchema,
    });

    expect(result).toEqual(mockResult);
    expect(generateObject).toHaveBeenCalledTimes(1);
  });

  it('falls back to groq when gemini fails', async () => {
    vi.mocked(generateObject)
      .mockRejectedValueOnce(new Error('Gemini API error'))
      .mockResolvedValueOnce({ object: mockResult } as never);

    const result = await generateObjectWithFallback<TestResult>({
      systemPrompt: 'Test system',
      userPrompt: 'Test user',
      schema: testSchema,
    });

    expect(result).toEqual(mockResult);
    expect(generateObject).toHaveBeenCalledTimes(2);
  });

  it('falls back through entire chain: gemini -> groq -> ollama', async () => {
    vi.mocked(generateObject)
      .mockRejectedValueOnce(new Error('Gemini failed'))
      .mockRejectedValueOnce(new Error('Groq failed'))
      .mockResolvedValueOnce({ object: mockResult } as never);

    const result = await generateObjectWithFallback<TestResult>({
      systemPrompt: 'Test system',
      userPrompt: 'Test user',
      schema: testSchema,
    });

    expect(result).toEqual(mockResult);
    expect(generateObject).toHaveBeenCalledTimes(3);
  });

  it('throws when ALL providers in the chain fail', async () => {
    vi.mocked(generateObject)
      .mockRejectedValueOnce(new Error('Gemini failed'))
      .mockRejectedValueOnce(new Error('Groq failed'))
      .mockRejectedValueOnce(new Error('Ollama failed'));

    await expect(
      generateObjectWithFallback<TestResult>({
        systemPrompt: 'Test system',
        userPrompt: 'Test user',
        schema: testSchema,
      })
    ).rejects.toThrow('Ollama failed');
  });

  it('respects ACTIVE_AI_PROVIDER=groq and uses groq-first chain', async () => {
    vi.stubEnv('ACTIVE_AI_PROVIDER', 'groq');
    vi.mocked(generateObject).mockResolvedValueOnce({ object: mockResult } as never);

    await generateObjectWithFallback<TestResult>({
      systemPrompt: 'Test',
      userPrompt: 'Test',
      schema: testSchema,
    });

    // Verify the model passed to generateObject is a groq model
    const callArgs = vi.mocked(generateObject).mock.calls[0][0];
    expect(callArgs.model).toHaveProperty('provider', 'groq');
  });

  it('ollama-only chain does not fall back to cloud providers', async () => {
    vi.stubEnv('ACTIVE_AI_PROVIDER', 'ollama');
    vi.mocked(generateObject).mockRejectedValueOnce(new Error('Ollama failed'));

    await expect(
      generateObjectWithFallback<TestResult>({
        systemPrompt: 'Test',
        userPrompt: 'Test',
        schema: testSchema,
      })
    ).rejects.toThrow('Ollama failed');

    // Only 1 attempt (ollama only, no cloud fallback)
    expect(generateObject).toHaveBeenCalledTimes(1);
  });

  it('passes visual data as file parts in the message', async () => {
    vi.mocked(generateObject).mockResolvedValueOnce({ object: mockResult } as never);

    await generateObjectWithFallback<TestResult>({
      systemPrompt: 'Analyze this',
      userPrompt: 'Describe the video',
      schema: testSchema,
      visualData: ['data:image/jpeg;base64,abc123', 'rawBase64Data'],
    });

    const callArgs = vi.mocked(generateObject).mock.calls[0][0];
    expect(callArgs.system).toBe('Analyze this');
    // Verify messages contain file parts
    const messages = callArgs.messages as Array<{ role: string; content: Array<{ type: string }> }>;
    expect(messages[0].content).toHaveLength(3); // 1 text + 2 images
    expect(messages[0].content[0]).toHaveProperty('type', 'text');
    expect(messages[0].content[1]).toHaveProperty('type', 'file');
    expect(messages[0].content[2]).toHaveProperty('type', 'file');
  });
});
