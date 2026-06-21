import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DashboardClient from '@/components/dashboard/DashboardClient';
import { Session } from 'next-auth';

// Mock Auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  handlers: { GET: vi.fn(), POST: vi.fn() },
}));

// Mock Server Actions
vi.mock('@/app/actions/user/accounts', () => ({
  getUserAccounts: vi.fn(),
  toggleAccountDistribution: vi.fn(),
  disconnectAccount: vi.fn(),
}));

vi.mock('@/app/actions/user/platform', () => ({
  getPlatformPreferences: vi.fn(),
  togglePlatformPreference: vi.fn(),
}));

vi.mock('@/app/actions/user/ai-style', () => ({
  getAIStylePreference: vi.fn(),
  updateAIStylePreference: vi.fn(),
  getAIStyleModePreference: vi.fn(),
  updateAIStyleModePreference: vi.fn(),
}));

vi.mock('@/app/actions/user/ai-provider', () => ({
  getAIProviderPreference: vi.fn(),
  updateAIProviderPreference: vi.fn(),
}));

vi.mock('@/app/actions/user/video-format', () => ({
  getVideoFormatPreference: vi.fn(),
  updateVideoFormatPreference: vi.fn(),
}));

// Mock Next.js Navigation
vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(() => ({
    get: vi.fn(),
  })),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value.toString(); }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

describe('AI Preference Persistence', () => {
  const mockSession: Session = { user: { name: 'Test User', id: 'user_1' }, expires: '' };
  
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it('prioritizes localStorage over initial server props on mount', async () => {
    // Set localStorage values
    localStorageMock.setItem('SS_AI_TIER', 'Enrich');
    localStorageMock.setItem('SS_AI_PROVIDER', 'groq');
    localStorageMock.setItem('SS_AI_MODE', 'Gen-Z');

    render(
      <DashboardClient 
        session={mockSession}
        initialAccounts={[]}
        initialPreferences={[]}
        initialAIStyle="Smart"
        initialAITier="Manual"
        initialAIProvider="gemini"
      />
    );

    // Should reflect localStorage values instead of "initial" props
    await waitFor(() => {
      const notice = screen.getByTestId('ai-strategy-notice');
      expect(notice.textContent).toContain('Refining draft'); // Enrich mode
      expect(notice.textContent).toContain('Gen-Z');
      expect(notice.textContent).toContain('Groq');
    }, { timeout: 2000 });
  });

  it('uses initial server props if localStorage is empty', async () => {
    render(
      <DashboardClient 
        session={mockSession}
        initialAccounts={[]}
        initialPreferences={[]}
        initialAIStyle="Story"
        initialAITier="Generate"
        initialAIProvider="anthropic"
      />
    );

    await waitFor(() => {
      const notice = screen.getByTestId('ai-strategy-notice');
      expect(notice.textContent).toContain('Generating content'); // Generate mode
      expect(notice.textContent).toContain('Story');
      expect(notice.textContent).toContain('Anthropic');
    }, { timeout: 2000 });
  });
});
