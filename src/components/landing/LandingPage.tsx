'use client';

import React from 'react';
import { LandingHeader } from './Header';
import { Hero } from './Hero';
import { SocialProof } from './SocialProof';
import { Features } from './Features';
import { Comparison } from './Comparison';
import { Personas } from './Personas';
import { Testimonials } from './Testimonials';
import { Pricing } from './Pricing';
import { FAQ } from './FAQ';
import { LandingFooter } from './Footer';

export const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <LandingHeader />
      <main style={{ flexGrow: 1 }}>
        <Hero />
        <SocialProof />
        <Features />
        <Comparison />
        <Personas />
        <Testimonials />
        <Pricing />
        <FAQ />
        <LandingFooter />
      </main>
    </div>
  );
};
