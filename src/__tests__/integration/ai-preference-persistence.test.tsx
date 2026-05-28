import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DashboardClient from '@/components/dashboard/DashboardClient';
import { Account, PlatformPreference } from '@/lib/core/types';
import { StyleMode, AITier } from '@/lib/core/constants';
import { AIProvider } from '@/lib/core/ai';

// Mock Auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  handlers: { GET: vi.fn(), POST: vi.fn() },
}));

// Mock Server Actions
vi.mock('@/app/actions/user', () => ({
  getUserAccounts: vi.fn(),
  getPlatformPreferences: vi.fn(),
  getVideoFormatPreference: vi.fn(),
  getAIStylePreference: vi.fn(),
  updateVideoFormatPreference: vi.fn(),
  updateAIStylePreference: vi.fn(),
  getAIProviderPreference: vi.fn(),
  updateAIProviderPreference: vi.fn(),
  getAIStyleModePreference: vi.fn(),
  updateAIStyleModePreference: vi.fn(),
  toggleAccountDistribution: vi.fn(),
  disconnectAccount: vi.fn(),
  togglePlatformPreference: vi.fn(),
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
  const mockSession = { user: { name: 'Test User', id: 'user_1' }, expires: '' };
  
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
        session={mockSession as any}
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
        session={mockSession as any}
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
