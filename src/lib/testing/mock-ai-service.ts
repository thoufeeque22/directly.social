/**
 * (OO-001): Extracted E2E mock logic for AI Chat to satisfy SRP.
 */
export async function getMockAiResponse() {
  const { streamText } = await import('ai');
  const { createOpenAI } = await import('@ai-sdk/openai');

  // Create a mock OpenAI provider that intercepts fetch and returns a fake chunked response
  const mockOpenAI = createOpenAI({
    apiKey: 'test-key',
    fetch: async () => {
      const stream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          controller.enqueue(
            encoder.encode(
              'data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"role":"assistant","content":""},"finish_reason":null}]}\n\n'
            )
          );
          controller.enqueue(
            encoder.encode(
              'data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{"content":"Mocked AI response"},"finish_reason":null}]}\n\n'
            )
          );
          controller.enqueue(
            encoder.encode(
              'data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-3.5-turbo-0613","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}\n\n'
            )
          );
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        },
      });
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
        },
      });
    },
  });

  return streamText({
    model: mockOpenAI('gpt-3.5-turbo'),
    prompt: 'Test',
  });
}
