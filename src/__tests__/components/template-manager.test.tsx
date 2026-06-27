import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TemplateManager } from '../../components/settings/TemplateManager';
import { getMetadataTemplates, deleteMetadataTemplate, updateMetadataTemplate } from '../../app/actions/metadata';

// Mock Server Actions
vi.mock('../../app/actions/metadata', () => ({
  getMetadataTemplates: vi.fn(),
  deleteMetadataTemplate: vi.fn(),
  updateMetadataTemplate: vi.fn(),
}));

describe('TemplateManager & Reusable Snippets', () => {
  const mockTemplates = [
    {
      id: 'template_1',
      name: 'Snippet One',
      content: JSON.stringify({ description: 'This is the first template description.', firstComment: 'Comment 1' }),
      category: 'description',
    },
    {
      id: 'template_2',
      name: 'Snippet Two',
      content: JSON.stringify({ description: 'This is the second template description.', firstComment: '' }),
      category: 'description',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getMetadataTemplates).mockResolvedValue(mockTemplates as never);
    vi.mocked(updateMetadataTemplate).mockResolvedValue({
      id: 'template_1',
      name: 'Snippet One Updated',
      content: JSON.stringify({ description: 'Updated Description', firstComment: 'Updated Comment' }),
      category: 'description',
    } as never);
    vi.mocked(deleteMetadataTemplate).mockResolvedValue({ success: true } as never);

    // Mock window.confirm
    vi.stubGlobal('confirm', vi.fn(() => true));
    // Mock window.alert
    vi.stubGlobal('alert', vi.fn());

    // Silence expected console errors
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders loading skeleton and then renders templates', async () => {
    render(<TemplateManager />);

    await waitFor(() => {
      expect(screen.getByText('Snippet One')).toBeInTheDocument();
      expect(screen.getByText('Snippet Two')).toBeInTheDocument();
    });

    expect(screen.getByText('This is the first template description.')).toBeInTheDocument();
    expect(screen.getByText('Comment 1')).toBeInTheDocument();
  });

  it('filters templates based on search query', async () => {
    render(<TemplateManager />);

    await waitFor(() => expect(screen.getByText('Snippet One')).toBeInTheDocument());

    const searchInput = screen.getByPlaceholderText('Search snippets...');
    fireEvent.change(searchInput, { target: { value: 'Two' } });

    expect(screen.queryByText('Snippet One')).not.toBeInTheDocument();
    expect(screen.getByText('Snippet Two')).toBeInTheDocument();
  });

  it('allows editing a template and triggers updateMetadataTemplate server action', async () => {
    render(<TemplateManager />);

    await waitFor(() => expect(screen.getByText('Snippet One')).toBeInTheDocument());

    // Click edit button
    const editBtn = screen.getByTestId('edit-snippet-template_1');
    fireEvent.click(editBtn);

    // Change fields
    const nameInput = screen.getByPlaceholderText('Name');
    const descInput = screen.getByPlaceholderText('Description');
    const commentInput = screen.getByPlaceholderText('First Comment');

    fireEvent.change(nameInput, { target: { value: 'Snippet One Updated' } });
    fireEvent.change(descInput, { target: { value: 'Updated Description' } });
    fireEvent.change(commentInput, { target: { value: 'Updated Comment' } });

    // Save
    const saveBtn = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(updateMetadataTemplate).toHaveBeenCalledWith('template_1', {
        name: 'Snippet One Updated',
        content: JSON.stringify({
          description: 'Updated Description',
          firstComment: 'Updated Comment',
        }),
      });
    });
  });

  it('allows deleting a template and triggers deleteMetadataTemplate server action', async () => {
    render(<TemplateManager />);

    await waitFor(() => expect(screen.getByText('Snippet One')).toBeInTheDocument());

    // Click delete button
    const deleteBtn = screen.getByTestId('delete-snippet-template_1');
    fireEvent.click(deleteBtn);

    expect(window.confirm).toHaveBeenCalled();
    await waitFor(() => {
      expect(deleteMetadataTemplate).toHaveBeenCalledWith('template_1');
    });
  });
});
