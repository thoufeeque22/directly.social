import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { RefreshButton } from '@/components/layout/RefreshButton';
import { useRouter } from 'next/navigation';
import { vi, expect, it, describe, beforeEach, afterEach } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('RefreshButton', () => {
  const mockRefresh = vi.fn();

  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({
      refresh: mockRefresh,
    } as any);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<RefreshButton />);
    expect(screen.getByRole('button')).toBeDefined();
  });

  it('triggers refresh and global events when clicked', async () => {
    const dispatchSpy = vi.spyOn(globalThis, 'dispatchEvent');
    render(<RefreshButton />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockRefresh).toHaveBeenCalled();
    
    // Check for custom events
    const eventTypes = dispatchSpy.mock.calls.map(args => args[0].type);
    expect(eventTypes).toContain('refresh-upcoming');
    expect(eventTypes).toContain('app:refresh');
    
    // Should show loading state (disabled button)
    expect(button).toBeDisabled();

    // Fast-forward 1 second
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    // Should be enabled again
    expect(button).not.toBeDisabled();
  });

  it('prevents multiple refreshes when double-clicked rapidly', async () => {
    render(<RefreshButton />);
    const button = screen.getByRole('button');
    
    // Rapid clicks
    fireEvent.click(button);
    fireEvent.click(button);

    expect(mockRefresh).toHaveBeenCalledTimes(1);
    expect(button).toBeDisabled();

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(button).not.toBeDisabled();
  });
});
