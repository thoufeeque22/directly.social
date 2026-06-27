import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { useAppRefresh } from '@/hooks/useAppRefresh';
import { useRouter } from 'next/navigation';
import { vi, expect, it, describe, beforeEach, afterEach } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Test component to use the hook
const TestComponent = () => {
  const { refresh, isRefreshing } = useAppRefresh();
  return (
    <div>
      <button onClick={refresh} data-testid="refresh-btn">Refresh</button>
      {isRefreshing && <div data-testid="loading">Loading...</div>}
    </div>
  );
};

describe('useAppRefresh', () => {
  const mockRefresh = vi.fn();

  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({
      refresh: mockRefresh,
    } as unknown as ReturnType<typeof useRouter>);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('triggers router refresh and global events', async () => {
    const dispatchSpy = vi.spyOn(globalThis, 'dispatchEvent');
    render(<TestComponent />);
    
    const button = screen.getByTestId('refresh-btn');
    
    await act(async () => {
      button.click();
    });

    expect(mockRefresh).toHaveBeenCalled();
    
    const eventTypes = dispatchSpy.mock.calls.map(args => args[0].type);
    expect(eventTypes).toContain('refresh-upcoming');
    expect(eventTypes).toContain('app:refresh');
    
    expect(screen.getByTestId('loading')).toBeDefined();

    // Fast-forward 800ms
    await act(async () => {
      vi.advanceTimersByTime(800);
    });

    // Use a small flush to ensure promises resolve
    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.queryByTestId('loading')).toBeNull();
  });

  it('prevents concurrent refreshes', async () => {
    render(<TestComponent />);
    const button = screen.getByTestId('refresh-btn');
    
    await act(async () => {
      button.click();
      button.click(); // Double click
    });

    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });
});
