/**
 * LAYOUT WRAPPER TESTS
 * Verifies the conditional rendering of the main application shell.
 * Ensures that Sidebar and Header are:
 * - Hidden on public/auth pages like /login.
 * - Displayed on internal dashboard and settings pages.
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Mock next/navigation specifically for control
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock components to simplify detection
vi.mock('@/components/layout/Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar Mock</div>,
}));
vi.mock('@/components/layout/Header', () => ({
  Header: () => <div data-testid="header">Header Mock</div>,
}));
vi.mock('@/components/chat/AIChatbot', () => ({
  AIChatbot: () => <div data-testid="ai-chatbot">Chatbot Mock</div>,
}));

// Mock NextAuth useSession to avoid errors in real components
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({ data: null, status: 'unauthenticated' })),
}));

describe('LayoutWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders only children when on the /login page (no sidebar/header)', () => {
    vi.mocked(usePathname).mockReturnValue('/login');
    vi.mocked(useSession).mockReturnValue({ data: null, status: 'unauthenticated' } as never);
    
    render(
      <LayoutWrapper session={null}>
        <div data-testid="content">Login Page Content</div>
      </LayoutWrapper>
    );
    
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('header')).not.toBeInTheDocument();
  });

  it('renders sidebar, header, and content when on the dashboard (/)', () => {
    vi.mocked(usePathname).mockReturnValue('/');
    const mockSession = { user: { name: 'Test User' } };
    vi.mocked(useSession).mockReturnValue({ data: mockSession, status: 'authenticated' } as never);
    
    render(
      <LayoutWrapper session={mockSession as never}>
        <div data-testid="content">Dashboard Content</div>
      </LayoutWrapper>
    );
    
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renders layout components on internal pages like /settings', () => {
    vi.mocked(usePathname).mockReturnValue('/settings');
    const mockSession = { user: { name: 'Test User' } };
    vi.mocked(useSession).mockReturnValue({ data: mockSession, status: 'authenticated' } as never);
    
    render(
      <LayoutWrapper session={mockSession as never}>
        <div data-testid="content">Settings Content</div>
      </LayoutWrapper>
    );
    
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });
});
