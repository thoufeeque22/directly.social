import React from 'react';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { Box, Container, Paper } from '@mui/material';
import { LandingHeader } from '@/components/landing/Header';
import { LandingFooter } from '@/components/landing/Footer';
import { Metadata } from 'next';
import { MarkdownRenderer } from '@/components/docs/MarkdownRenderer';

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = slug[slug.length - 1].replace(/_/g, ' ').replace(/-/g, ' ');
  return {
    title: `${title} | Directly Docs`,
    description: `Learn more about ${title} in the Directly Social documentation.`
  };
}

export default async function DocGuidePage({ params }: PageProps) {
  const { slug } = await params;
  
  // RESTRICTION: Only allow files from docs/
  const docsDir = path.join(process.cwd(), 'docs');
  const docPath = path.normalize(path.join(docsDir, ...slug) + '.md');
  
  // Security check: ensure the normalized path is still within the docs directory
  if (!docPath.startsWith(docsDir) || !fs.existsSync(docPath)) {
    notFound();
  }

  const content = fs.readFileSync(docPath, 'utf8');

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <LandingHeader />
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
        <Container maxWidth="md">
          <Paper elevation={0} sx={{ p: { xs: 4, md: 8 }, borderRadius: 4, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <MarkdownRenderer content={content} />
          </Paper>
        </Container>
      </Box>
      <LandingFooter />
    </Box>
  );
}
