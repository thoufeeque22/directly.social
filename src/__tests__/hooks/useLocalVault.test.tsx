import { renderHook, act } from '@testing-library/react';
import { vi, expect, it, describe, beforeEach, afterEach } from 'vitest';
import { useLocalVault } from '@/hooks/useLocalVault';
import { getVaultHandle, storeVaultHandle } from '@/lib/upload/vault-store';

vi.mock('@/lib/upload/vault-store', () => ({
  getVaultHandle: vi.fn(), storeVaultHandle: vi.fn(), clearVaultHandle: vi.fn(),
}));

vi.mock('@/lib/upload/vault-mobile', () => ({
  checkMobilePermissions: vi.fn(() => Promise.resolve('prompt')),
  requestMobilePermissions: vi.fn(() => Promise.resolve('prompt')),
  listMobileAssets: vi.fn(() => Promise.resolve([])),
  getMobileFile: vi.fn(() => Promise.resolve(new File([], 'test.mp4'))),
}));

describe('useLocalVault', () => {
  beforeEach(() => { vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:test') }); });
  afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks(); });

  it('Case 1: Fresh Launch', async () => {
    vi.mocked(getVaultHandle).mockResolvedValue(null);
    vi.stubGlobal('window', { showDirectoryPicker: vi.fn() });
    const { result } = renderHook(() => useLocalVault());
    expect(result.current.connectionName).toBeNull();
    expect(result.current.permissionState).toBe('prompt');
  });

  it('Case 2: Access Expired', async () => {
    const mockH = { name: 'Mock Folder', queryPermission: vi.fn().mockResolvedValue('prompt') } as unknown as FileSystemDirectoryHandle;
    vi.mocked(getVaultHandle).mockResolvedValue(mockH);
    vi.stubGlobal('window', { showDirectoryPicker: vi.fn() });
    const { result } = renderHook(() => useLocalVault());
    await act(async () => { await Promise.resolve(); await Promise.resolve(); });
    expect(result.current.connectionName).toBe('Mock Folder');
    expect(result.current.permissionState).toBe('prompt');
  });

  it('Case 3 & 4: Connect Folder & Filter Files', async () => {
    const f1 = { kind: 'file', name: 'video.mp4', getFile: vi.fn().mockResolvedValue(new File([], 'video.mp4', { type: 'video/mp4' })) };
    const f2 = { kind: 'file', name: 'notes.txt', getFile: vi.fn().mockResolvedValue(new File([], 'notes.txt', { type: 'text/plain' })) };
    const mockEntries = [f1, f2];
    const mockH = {
      name: 'Mock Folder',
      values: () => {
        let index = 0;
        return {
          [Symbol.asyncIterator]() {
            return {
              async next() {
                return index < mockEntries.length ? { value: mockEntries[index++], done: false } : { done: true, value: undefined };
              }
            };
          }
        };
      }
    } as unknown as FileSystemDirectoryHandle;

    const showPickerMock = vi.fn().mockResolvedValue(mockH);
    vi.stubGlobal('window', { showDirectoryPicker: showPickerMock });
    vi.mocked(getVaultHandle).mockResolvedValue(null);

    const { result } = renderHook(() => useLocalVault());
    await act(async () => { await Promise.resolve(); });
    await act(async () => { await result.current.connectDirectory(); });

    expect(showPickerMock).toHaveBeenCalled();
    expect(storeVaultHandle).toHaveBeenCalledWith(mockH);
    expect(result.current.connectionName).toBe('Mock Folder');
    expect(result.current.permissionState).toBe('granted');
    
    await act(async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); });
    expect(result.current.assets.length).toBe(1);
    expect(result.current.assets[0].fileName).toBe('video.mp4');
  });
});
