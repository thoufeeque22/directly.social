import React from 'react';
import { Box } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { markdownComponents } from './MarkdownRenderer.components';

interface MarkdownRendererProps {
  content: string;
}

/**
 * Modern Markdown Renderer using react-markdown and MUI
 */
export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <Box sx={{ color: 'text.primary' }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};
