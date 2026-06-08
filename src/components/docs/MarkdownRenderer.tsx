import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MermaidRenderer } from './MermaidRenderer';

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
        components={{
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
          code: (props) => {
            const { children, className, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            const isMermaid = match && match[1] === 'mermaid';

            if (isMermaid) {
              return <MermaidRenderer chart={String(children).replace(/\n$/, '')} />;
            }

            return (
              <Box
                component="pre"
                sx={{
                  p: 2,
                  my: 2,
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                  overflowX: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <code {...rest} className={className}>
                  {children}
                </code>
              </Box>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};
