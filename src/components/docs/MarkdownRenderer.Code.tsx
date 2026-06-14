import React from 'react';
import { Box } from '@mui/material';
import { MermaidRenderer } from './MermaidRenderer';
import { Components } from 'react-markdown';

/**
 * Custom Code component for ReactMarkdown.
 * Handles both block and inline code, including Mermaid diagrams.
 */
export const CodeComponent: Components['code'] = (props) => {
  const { children, className, ...rest } = props;
  const match = /language-(\w+)/.exec(className || '');
  const isMermaid = match && match[1] === 'mermaid';

  if (isMermaid) {
    return <MermaidRenderer chart={String(children).replace(/\n$/, '')} />;
  }

  const isBlock = !!className || String(children).includes('\n');

  if (isBlock) {
    return (
      <Box
        component="pre"
        sx={{
          p: 2,
          my: 2,
          bgcolor: 'action.hover',
          borderRadius: 2,
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
  }

  return (
    <Box
      component="code"
      sx={{
        px: 0.8,
        py: 0.2,
        bgcolor: 'action.selected',
        borderRadius: 1,
        fontFamily: 'monospace',
        fontSize: '0.9em',
        color: 'primary.main',
        fontWeight: 500,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      {children}
    </Box>
  );
};
