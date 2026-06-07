'use client';

import React from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, useTheme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion } from 'framer-motion';
import { faqs } from '../data-secondary';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };

export const FAQ = () => {
  const theme = useTheme();

  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="md">
        <Box 
          component={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
          sx={{ textAlign: 'center', mb: 8 }}
        >
          <Typography variant="overline" color="primary" sx={{ fontWeight: 800, letterSpacing: '0.2em' }}>
            Support & Clarity
          </Typography>
          <Typography variant="h2" sx={{ mt: 2, mb: 3, fontWeight: 800 }}>
            Common Questions
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 750, mx: 'auto', fontWeight: 400 }}>
            Everything you need to know about the native social revolution.
          </Typography>
        </Box>

        <Box 
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {faqs.map((faq, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Accordion 
                elevation={0} 
                sx={{ 
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: '8px !important',
                  mb: 2,
                  '&:before': { display: 'none' },
                  bgcolor: 'background.paper',
                  transition: 'border-color 0.2s',
                  '&:hover': { borderColor: 'primary.main' }
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}>
                  <Typography sx={{ fontWeight: 700 }}>{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
};
