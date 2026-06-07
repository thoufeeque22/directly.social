'use client';

import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { features } from '../data';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } } as const;
const itemVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } } as const;

export const Features = () => {
  const theme = useTheme();

  return (
    <Box id="features" sx={{ py: { xs: 8, md: 12 }, position: 'relative' }}>
      <Container maxWidth="lg">
        <Box 
          component={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
          sx={{ textAlign: 'center', mb: 8 }}
        >
          <Typography variant="overline" color="primary" sx={{ fontWeight: 800, letterSpacing: '0.2em' }}>Core Magic</Typography>
          <Typography variant="h2" sx={{ mt: 2, mb: 3, fontWeight: 800 }}>The SaaS Tax is Over</Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 750, mx: 'auto', fontWeight: 400 }}>
            Stop paying for middlemen to hold your data. <strong>Directly Social</strong> connects your own cloud storage or local disk to the platforms you love.
          </Typography>
        </Box>

        <Box 
          component={motion.div} 
          variants={containerVariants} 
          initial="hidden" 
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={index}>
                <motion.div variants={itemVariants} style={{ height: '100%' }}>
                  <Card 
                    elevation={0} 
                    sx={{ 
                      height: '100%', 
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 4,
                      bgcolor: 'background.paper',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: `0 20px 40px -10px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)'}`,
                        borderColor: 'primary.main',
                        '& .icon-wrapper': { 
                          bgcolor: 'primary.main', 
                          color: theme.palette.mode === 'dark' ? 'black' : 'white', 
                          transform: 'scale(1.1) rotate(5deg)' 
                        },
                        '& .icon-wrapper svg': {
                          fill: 'currentColor',
                        }
                      }
                    }}
                  >
                    <CardContent sx={{ p: { xs: 4, md: 5 } }}>
                      <Box 
                        className="icon-wrapper"
                        sx={{ 
                          mb: 3, 
                          width: 64, 
                          height: 64, 
                          borderRadius: 3, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          bgcolor: 'action.hover', 
                          color: 'primary.main', 
                          transition: 'all 0.3s ease',
                          '& svg': {
                            transition: 'fill 0.3s ease',
                            fill: 'currentColor'
                          }
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 800 }}>{feature.title}</Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>{feature.description}</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};
