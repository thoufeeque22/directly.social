import React from 'react';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { Box, Container, Paper } from '@mui/material';
import { Metadata } from 'next';
import { MarkdownRenderer } from '@/components/docs/MarkdownRenderer';
import { BRAND } from '@/lib/core/brand';

import { glob } from 'glob';

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export const dynamicParams = true;
export const revalidate = 86400; // Cache for 24 hours

export async function generateStaticParams() {
  const docsRootDir = path.join(process.cwd(), 'docs');
  const userDocs = glob.sync('user/**/*.md', { cwd: docsRootDir });
  const devDocs = glob.sync('dev/**/*.md', { cwd: docsRootDir });
  
  const allDocs = [...userDocs, ...devDocs];
  return allDocs.map((file) => ({
    slug: file.replace(/\.md$/, '').split('/'),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = slug[slug.length - 1].replace(/_/g, ' ').replace(/-/g, ' ');
  return {
    title: `${title} | ${BRAND.name} Docs`,
    description: `Learn more about ${title} in the ${BRAND.name} documentation.`
  };
}

/**
 * Dynamic documentation page that renders markdown files from the docs/ directory.
 * Supports /docs/user/... and /docs/dev/... paths.
 */
export default async function DocGuidePage({ params }: PageProps) {
  const { slug } = await params;
  
  const docsRootDir = path.join(process.cwd(), 'docs');
  const docPath = path.normalize(path.join(docsRootDir, ...slug) + '.md');
  
  // Security check: ensure the normalized path is still within the docs directory
  // and specifically within the 'user' or 'dev' subdirectories.
  const allowedDirs = [path.join(docsRootDir, 'user'), path.join(docsRootDir, 'dev')];
  const isAllowed = allowedDirs.some(dir => docPath.startsWith(dir));

  if (!isAllowed || !fs.existsSync(docPath)) {
    notFound();
  }

  const content = fs.readFileSync(docPath, 'utf8');

  return (
    <Box component="main" sx={{ flexGrow: 1, py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
      <Container maxWidth="md">
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 4, md: 8 }, 
            borderRadius: 4, 
            border: '1px solid', 
            borderColor: 'divider', 
            bgcolor: 'background.paper',
            boxShadow: '0 8px 32px rgba(0,0,0,0.05)'
          }}
        >
          <MarkdownRenderer content={content} />
        </Paper>
      </Container>
    </Box>
  );
}
