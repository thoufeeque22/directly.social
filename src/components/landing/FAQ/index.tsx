'use client';

import React from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, useTheme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqs = [
  {
    question: "What does 'Native' actually mean?",
    answer: "Most social media tools act as a middleman. They store your data and passwords on their servers and then send them to the platforms. Directly connects your computer directly to the platforms using their official APIs, meaning your data never leaves your control."
  },
  {
    question: "Is Directly really free?",
    answer: "Yes, our Local Core tier is free forever. Since the app runs on your machine and uses your own API keys, our overhead is low, and we pass those savings directly to you."
  },
  {
    question: "How do I get my own API keys?",
    answer: "We provide step-by-step guides for creating developer accounts on TikTok, Instagram, and YouTube. It's a one-time setup that gives you total independence from SaaS middlemen."
  },
  {
    question: "Can I use Directly for team collaboration?",
    answer: "Team features are coming soon to our Cloud Pro tier, which will allow for shared local vaults and synchronized workflows while maintaining our privacy-first architecture."
  }
];

export const FAQ = () => {
  const theme = useTheme();

  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 800 }}>
            Common Questions
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Everything you need to know about the native social revolution.
          </Typography>
        </Box>

        <Box>
          {faqs.map((faq, i) => (
            <Accordion 
              key={i} 
              elevation={0} 
              sx={{ 
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '8px !important',
                mb: 2,
                '&:before': { display: 'none' }
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700 }}>{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
                <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
};
