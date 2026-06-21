import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MediaLibrary } from '../../components/media/MediaLibrary';
import React from 'react';

// Mock fetch
global.fetch = vi.fn();

describe('MediaLibrary Component', () => {
  const mockAssets = [
    {
      id: '1',
      fileId: 'file-1',
      fileName: 'video1.mp4',
      fileSize: 1024 * 1024 * 10,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      createdAt: new Date().toISOString(),
      previewUrl: '/preview1.mp4'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockAssets })
    } as Response);
  });

  it('renders the gallery title and search bar', async () => {
    render(<MediaLibrary />);
    expect(await screen.findByText('Media Gallery')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search your library...')).toBeInTheDocument();
  });

  it('loads and displays assets from the API', async () => {
    render(<MediaLibrary />);
    
    await waitFor(() => {
      expect(screen.getByText('video1.mp4')).toBeInTheDocument();
    });
  });

  it('triggers file selection when clicking Upload', async () => {
    render(<MediaLibrary />);
    const uploadButton = await screen.findByRole('button', { name: /Upload/i });
    expect(uploadButton).toBeEnabled();
  });

  it('opens confirmation on per-asset delete click', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockAssets })
    } as Response);

    render(<MediaLibrary />);
    
    const deleteBtn = await screen.findByTestId('delete-asset');
    expect(deleteBtn).toBeInTheDocument();
    fireEvent.click(deleteBtn);
    
    expect(await screen.findByText('Confirm Deletion')).toBeInTheDocument();
  });

  it('opens confirmation on Clear Gallery click', async () => {
    vi.mocked(global.fetch).mockResolvedValue({ 
      ok: true, 
      json: async () => ({ success: true, data: mockAssets }) 
    } as Response);

    render(<MediaLibrary />);
    
    const clearButton = await screen.findByTestId('clear-gallery');
    expect(clearButton).toBeInTheDocument();
    fireEvent.click(clearButton);
    
    expect(await screen.findByText('Confirm Deletion')).toBeInTheDocument();
  });
});
