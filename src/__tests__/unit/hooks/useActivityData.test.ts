import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useActivityData } from '@/hooks/useActivity/useActivityData';
import { useActivityFetcher } from '@/hooks/useActivity/useActivityFetcher';
import { PostActivityEntry } from '@/hooks/useActivity/types';

vi.mock('@/hooks/useActivity/useActivityFetcher', () => ({
  useActivityFetcher: vi.fn(),
}));

vi.mock('@/hooks/useActivity/useActivityPolling', () => ({
  useActivityPolling: vi.fn(),
}));

interface MockFetcher {
  fetchActivity: Mock;
}

describe('useActivityData regression test', () => {
  const mockFetchActivity = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    (useActivityFetcher as unknown as Mock).mockReturnValue({ fetchActivity: mockFetchActivity } as MockFetcher);
  });

  it('should NOT reset to page 1 when posts change (FIX VERIFICATION)', async () => {
    mockFetchActivity.mockResolvedValue({ data: [{ id: '1' }], nextCursor: 'c1' });

    const setPosts = vi.fn();
    const setNextCursor = vi.fn();
    const setIsLoading = vi.fn();
    const setLoadingMore = vi.fn();

    const { rerender } = renderHook(
      (props) => useActivityData(props),
      {
        initialProps: {
          searchQuery: '',
          setPosts,
          setNextCursor,
          setIsLoading,
          setLoadingMore,
          posts: [] as PostActivityEntry[],
          nextCursor: null as string | null,
          loadingMore: false,
        },
      }
    );

    act(() => {
      vi.runAllTimers();
    });

    await act(async () => { /* wait */ });

    expect(mockFetchActivity).toHaveBeenCalledWith(undefined, '');
    const firstCallCount = mockFetchActivity.mock.calls.length;
    
    const newPosts = [{ id: '1' }, { id: '2' }] as PostActivityEntry[];
    
    rerender({
      searchQuery: '',
      setPosts,
      setNextCursor,
      setIsLoading,
      setLoadingMore,
      posts: newPosts,
      nextCursor: 'c1',
      loadingMore: false,
    });

    act(() => {
      vi.runAllTimers();
    });

    await act(async () => { /* wait */ });

    expect(mockFetchActivity.mock.calls.length).toBe(firstCallCount);
  });
});
