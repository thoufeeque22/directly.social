import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockInit = vi.fn();

vi.mock('@sentry/nextjs', () => ({
  init: mockInit,
  replayIntegration: vi.fn(),
  captureRouterTransitionStart: vi.fn(),
}));

describe('Sentry Configuration Isolation', () => {
  const originalEnv = process.env.NEXT_PUBLIC_APP_ENV;

  beforeEach(() => {
    vi.resetModules();
    mockInit.mockClear();
  });

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.NEXT_PUBLIC_APP_ENV;
    } else {
      process.env.NEXT_PUBLIC_APP_ENV = originalEnv;
    }
  });

  it('initializes server config with staging environment', async () => {
    process.env.NEXT_PUBLIC_APP_ENV = 'staging';
    await import('../../../sentry.server.config');
    
    expect(mockInit).toHaveBeenCalledWith(expect.objectContaining({
      environment: 'staging'
    }));
  });

  it('initializes edge config with development environment by default', async () => {
    delete process.env.NEXT_PUBLIC_APP_ENV;
    await import('../../../sentry.edge.config');
    
    expect(mockInit).toHaveBeenCalledWith(expect.objectContaining({
      environment: 'development'
    }));
  });

  it('initializes client config with staging environment', async () => {
    process.env.NEXT_PUBLIC_APP_ENV = 'staging';
    await import('../../../src/instrumentation-client');
    
    expect(mockInit).toHaveBeenCalledWith(expect.objectContaining({
      environment: 'staging'
    }));
  });
});
