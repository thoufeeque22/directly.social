import React, { useState } from 'react';
import { Card, CardContent, Box, Typography, IconButton, Divider, CircularProgress } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ForumIcon from '@mui/icons-material/Forum';
import { Template } from '@/hooks/useTemplateManager';
import { TemplateForm, TemplateFormValues } from './TemplateForm';

export interface TemplateListItemProps {
  template: Template;
  isUpdating: boolean;
  isDeleting: boolean;
  onUpdate: (id: string, values: TemplateFormValues) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const TemplateListItem: React.FC<TemplateListItemProps> = ({
  template,
  isUpdating,
  isDeleting,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (values: TemplateFormValues) => {
    try {
      await onUpdate(template.id, values);
      setIsEditing(false);
    } catch {
      alert('Failed to update template.');
    }
  };

  const handleDeleteClick = async () => {
    if (confirm('Are you sure you want to delete this snippet?')) {
      try {
        await onDelete(template.id);
      } catch {
        alert('Failed to delete template.');
      }
    }
  };

  return (
    <Card data-testid="template-card" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {isEditing ? (
          <TemplateForm
            initialValues={{ name: template.name, description: template.description, firstComment: template.firstComment }}
            isUpdating={isUpdating}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BookmarkIcon color="primary" fontSize="small" />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {template.name}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton onClick={() => setIsEditing(true)} aria-label="Edit Snippet" data-testid={`edit-snippet-${template.id}`} size="small">
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={handleDeleteClick} disabled={isDeleting} aria-label="Delete Snippet" data-testid={`delete-snippet-${template.id}`} size="small" color="error">
                  {isDeleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon fontSize="small" />}
                </IconButton>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', maxHeight: 100, overflowY: 'auto', flexGrow: 1 }}>
              {template.description}
            </Typography>
            {template.firstComment && (
              <>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ForumIcon color="action" fontSize="small" />
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                    {template.firstComment}
                  </Typography>
                </Box>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
