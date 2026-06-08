import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from './LoginComponents.module.css';

export function FAQSection() {
  const faqs = [
    {
      q: "Is my data and social account safe?",
      a: "Absolutely. We use official platform APIs and OAuth2 for all connections. Directly Social never sees or stores your passwords, and you can revoke access at any time directly from the platform's settings."
    },
    {
      q: "How does the 'Bring Your Own Storage' (BYOS) work?",
      a: "Unlike other platforms that lock your media in their proprietary cloud, Directly Social allows you to connect your own AWS S3 or Cloudflare R2 buckets. You maintain 100% ownership and control over your source files."
    },
    {
      q: "Is there a subscription fee?",
      a: "We offer transparent, value-based pricing. You can choose between a standard subscription or a pay-as-you-go model for AI generation and distribution. No hidden middleman automation taxes."
    },
    {
      q: "Which platforms are supported?",
      a: "Currently, we support direct publishing to YouTube Shorts, TikTok, Instagram Reels, and Facebook Reels. We are constantly adding new integrations based on our public roadmap."
    }
  ];

  return (
    <section className={styles.faqSection}>
      <Typography variant="h4" className={styles.faqHeading}>
        Common Questions
      </Typography>
      <Box sx={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        {faqs.map((faq, i) => (
          <Accordion 
            key={i} 
            sx={{ 
              background: 'hsla(var(--card) / 0.3)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid hsla(var(--border) / 0.2)',
              borderRadius: '1rem !important',
              marginBottom: '1rem',
              color: 'hsl(var(--foreground))',
              '&:before': { display: 'none' },
              boxShadow: 'none',
              overflow: 'hidden'
            }}
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon sx={{ color: 'hsl(var(--primary))' }} />}
              sx={{ padding: '0.5rem 1.5rem' }}
            >
              <Typography sx={{ fontWeight: 600 }}>{faq.q}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: '0 1.5rem 1.5rem', opacity: 0.8 }}>
              <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                {faq.a}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </section>
  );
}
