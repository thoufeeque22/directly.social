'use client';

import React from 'react';
import { Box, Typography, TextField, InputAdornment, Skeleton, Stack, Tabs, Tab } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useTemplateManager } from '@/hooks/useTemplateManager';
import { TemplateListItem } from './TemplateListItem';

const CATEGORIES = ['All', 'Title', 'Description', 'Hashtags', 'First Comment'];

export const TemplateManager: React.FC = () => {
  const {
    filteredTemplates,
    isLoading,
    deletingId,
    updatingId,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    handleUpdate,
    handleDelete,
  } = useTemplateManager();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
          <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700 }}>
        Reusable Snippets
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={categoryFilter} onChange={(_, newValue) => setCategoryFilter(newValue)} variant="scrollable" scrollButtons="auto">
          {CATEGORIES.map((cat) => (
            <Tab key={cat} label={cat} value={cat} />
          ))}
        </Tabs>
      </Box>

      <TextField
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search snippets..."
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          },
        }}
      />
      {filteredTemplates.length === 0 ? (
        <Stack
          spacing={2}
          sx={{
            p: 4,
            textAlign: 'center',
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'action.hover',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BookmarkBorderIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {searchQuery ? 'No matching snippets found.' : 'No saved snippets yet. Save them from the Upload dashboard!'}
          </Typography>
        </Stack>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
          {filteredTemplates.map((template) => (
            <TemplateListItem
              key={template.id}
              template={template}
              isUpdating={updatingId === template.id}
              isDeleting={deletingId === template.id}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
