import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SettingsPage from '../../app/settings/SettingsContent';
import { useSession } from 'next-auth/react';
import { getUserAccounts } from '../../app/actions/user/accounts';
import { togglePlatformPreference, getPlatformPreferences } from '../../app/actions/user/preferences';

// Mock NextAuth
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
  signIn: vi.fn(),
}));

// Mock Server Actions
vi.mock('../../app/actions/user/accounts', () => ({
  getUserAccounts: vi.fn(),
  toggleAccountDistribution: vi.fn(),
}));
vi.mock('../../app/actions/user/preferences', () => ({
  getPlatformPreferences: vi.fn(),
  togglePlatformPreference: vi.fn(),
}));

interface MockAccount {
  id: string;
  provider: string;
  accountName: string | null;
  isDistributionEnabled: boolean;
}

interface MockPreference {
  id: string;
  userId: string;
  platformId: string;
  isEnabled: boolean;
}

describe('Settings Multi-Account Management', () => {
  const mockAccounts: MockAccount[] = [
    { id: 'acc_yt_1', provider: 'google', accountName: 'thoufiq.ar', isDistributionEnabled: true },
    { id: 'acc_yt_2', provider: 'google', accountName: 'other.channel', isDistributionEnabled: true },
    { id: 'acc_tk_1', provider: 'tiktok', accountName: 'tiktok_handle', isDistributionEnabled: false },
  ];

  const mockPreferences: MockPreference[] = [
    { id: 'p1', userId: 'u1', platformId: 'youtube', isEnabled: true },
    { id: 'p2', userId: 'u1', platformId: 'tiktok', isEnabled: true },
    { id: 'p3', userId: 'u1', platformId: 'instagram', isEnabled: false },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSession).mockReturnValue({
      data: { user: { id: 'u1' }, expires: '' },
      status: 'authenticated',
      update: vi.fn(),
    } as ReturnType<typeof useSession>);
    vi.mocked(getUserAccounts).mockResolvedValue(mockAccounts as Awaited<ReturnType<typeof getUserAccounts>>);
    vi.mocked(getPlatformPreferences).mockResolvedValue(mockPreferences as Awaited<ReturnType<typeof getPlatformPreferences>>);
    vi.mocked(togglePlatformPreference).mockResolvedValue({ success: true } as Awaited<ReturnType<typeof togglePlatformPreference>>);
  });

  it('renders the hardcoded platform list in the grid', async () => {
    render(<SettingsPage />);
    
    await waitFor(() => {
      expect(screen.getAllByText('YouTube Shorts')[0]).toBeInTheDocument();
      expect(screen.getAllByText('TikTok')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Instagram Reels')[0]).toBeInTheDocument();
    });
  });

  it('displays connected segments ONLY for enabled platforms', async () => {
    render(<SettingsPage />);
    const connectionsTab = screen.getByRole('tab', { name: /Destinations/i });
    fireEvent.click(connectionsTab);
    
    await waitFor(() => {
      // YouTube is enabled in prefs, so handles should be visible
      expect(screen.getByText('@thoufiq.ar')).toBeInTheDocument();
      expect(screen.getByText('@tiktok_handle')).toBeInTheDocument();
      
      // Instagram is NOT enabled in prefs (p3 above is false), so it should be hidden
      expect(screen.queryByText('Instagram')).not.toBeInTheDocument();
    });
  });

  it('toggles a platform visibility and calls togglePlatformPreference', async () => {
    render(<SettingsPage />);
    
    await waitFor(() => screen.getByText('YouTube Shorts'));
    
    const ytSwitchSpan = screen.getByLabelText('Toggle YouTube Shorts');
    const ytSwitch = ytSwitchSpan.querySelector('input')!;
    
    // Toggle OFF
    fireEvent.click(ytSwitch);
    
    await waitFor(() => {
      expect(togglePlatformPreference).toHaveBeenCalledWith('youtube', false);
    });
  });

  it('allows enabling a platform even with 0 accounts (to reveal connect button)', async () => {
    vi.mocked(getUserAccounts).mockResolvedValue([] as Awaited<ReturnType<typeof getUserAccounts>>);
    vi.mocked(getPlatformPreferences).mockResolvedValue([
      { id: '1', userId: 'user-1', platformId: 'instagram', isEnabled: false } // 0 accounts but disabled
    ] as Awaited<ReturnType<typeof getPlatformPreferences>>);
    
    render(<SettingsPage />);
    const connectionsTab = screen.getByRole('tab', { name: /Destinations/i });
    fireEvent.click(connectionsTab);
    
    await waitFor(() => screen.getByText('Instagram Reels'));
    
    // Initially hidden
    expect(screen.queryByText('Instagram')).not.toBeInTheDocument();
    
    const instaSwitchSpan = screen.getByLabelText('Toggle Instagram Reels');
    const instaSwitch = instaSwitchSpan.querySelector('input')!;
    fireEvent.click(instaSwitch);
    
    await waitFor(() => {
      expect(togglePlatformPreference).toHaveBeenCalledWith('instagram', true); // Was false, toggled to true.
    });
  });

  it('verifies LinkedIn and Twitter visibility logic', async () => {
    // Only LinkedIn enabled
    vi.mocked(getPlatformPreferences).mockResolvedValue([
      { id: 'p_li', userId: 'u1', platformId: 'linkedin', isEnabled: true },
      { id: 'p_tw', userId: 'u1', platformId: 'twitter', isEnabled: false },
    ] as Awaited<ReturnType<typeof getPlatformPreferences>>);

    render(<SettingsPage />);
    const connectionsTab = screen.getByRole('tab', { name: /Destinations/i });
    fireEvent.click(connectionsTab);

    await waitFor(() => {
      // LinkedIn heading should be visible in the connection grid
      expect(screen.getByRole('heading', { name: /LinkedIn/i })).toBeInTheDocument();
      // Twitter should also be visible in the coming soon section
      expect(screen.getByRole('heading', { name: /Twitter\/X/i })).toBeInTheDocument();
    });
  });
});
