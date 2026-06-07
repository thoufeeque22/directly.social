'use client';

import React from 'react';
import { Box, Container, Typography, Paper, Stack, Avatar, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { testimonials } from '../data-secondary';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };

export const Testimonials = () => {
  const theme = useTheme();

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box 
          component={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
          sx={{ textAlign: 'center', mb: 8 }}
        >
          <Typography variant="overline" color="primary" sx={{ fontWeight: 800, letterSpacing: '0.2em' }}>
            The Wall of Love
          </Typography>
          <Typography variant="h2" sx={{ mt: 2, mb: 3, fontWeight: 800 }}>
            Join 1,000+ Native Creators
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 750, mx: 'auto', fontWeight: 400 }}>
            See why power users are leaving legacy tools for the freedom of Directly Social.
          </Typography>
        </Box>

        <Box 
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
            gap: 4 
          }}
        >
          {testimonials.map((t, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  borderRadius: 4, 
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: 'background.paper',
                  transition: 'transform 0.2s',
                  height: '100%',
                  '&:hover': { transform: 'translateY(-4px)', borderColor: 'primary.main' }
                }}
              >
                <Stack spacing={3} sx={{ height: '100%', justifyContent: 'space-between' }}>
                  <Typography variant="body1" sx={{ fontStyle: 'italic', fontSize: '1.1rem', lineHeight: 1.7 }}>
                    &quot;{t.content}&quot;
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 800 }}>{t.avatar}</Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>{t.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{t.role}</Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Paper>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
};
