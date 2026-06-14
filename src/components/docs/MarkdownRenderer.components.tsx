import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { Components } from 'react-markdown';
import { CodeComponent } from './MarkdownRenderer.Code';

/**
 * Custom MUI-based components for ReactMarkdown
 */
export const markdownComponents: Components = {
  h1: ({ children }) => (
    <Typography variant="h3" sx={{ mt: 4, mb: 2, fontWeight: 800 }}>
      {children}
    </Typography>
  ),
  h2: ({ children }) => (
    <Typography variant="h4" sx={{ mt: 4, mb: 2, fontWeight: 700 }}>
      {children}
    </Typography>
  ),
  h3: ({ children }) => (
    <Typography variant="h5" sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
      {children}
    </Typography>
  ),
  p: ({ children }) => (
    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
      {children}
    </Typography>
  ),
  blockquote: ({ children }) => (
    <Box 
      sx={{ 
        pl: 2, 
        borderLeft: '4px solid', 
        borderColor: 'primary.main', 
        bgcolor: 'action.hover',
        py: 0.5,
        my: 2,
        borderRadius: '0 4px 4px 0',
        '& p': { mb: 0 }
      }}
    >
      {children}
    </Box>
  ),
  hr: () => <Divider sx={{ my: 4 }} />,
  ul: ({ children }) => (
    <Box component="ul" sx={{ pl: 4, mb: 2 }}>
      {children}
    </Box>
  ),
  ol: ({ children }) => (
    <Box component="ol" sx={{ pl: 4, mb: 2 }}>
      {children}
    </Box>
  ),
  li: ({ children }) => (
    <Box component="li" sx={{ mb: 1 }}>
      <Typography variant="body1" component="div">
        {children}
      </Typography>
    </Box>
  ),
  code: CodeComponent,
};
