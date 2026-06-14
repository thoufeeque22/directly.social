
## [2026-06-04 20:45:17] Verdict: APPROVED
Verdict: APPROVED

SOCRATIC LOG

Q: Where will the platform logos be stored?
A: High-quality SVGs will be used. For official platform logos (TikTok, IG, YT, FB), we will store them in public/logos/platforms/ to ensure sharp rendering and easy management.

Q: How do we handle the light/dark mode transition for complex mockup components like DashboardMockup?
A: We will leverage MUI useTheme hook and CSS variables. The DashboardMockup will be a CSS-heavy component using glassmorphism effects (backdrop-filter) that automatically adjust based on the theme's background and surface variables.

Q: What about the 'Creator vs Developer toggle' in the Persona section?
A: This will be implemented using a MUI ToggleButtonGroup in a client component. It will drive the state for the PersonaContent sub-component to ensure a smooth transition between target audiences.

Q: Should the landing page be in src/app/page.tsx or a separate route like /landing?
A: It will reside in src/app/page.tsx. This maintains the primary domain entry point. The existing logic to check for an active session will be preserved, showing the Dashboard only to authenticated users.

Q: How do we ensure '100-line modularity' for large sections?
A: We will decompose each of the 10 sections into atomic sub-components within a dedicated src/components/landing directory. For instance, the HeroSection will be split into HeroContent, HeroMockup, and HeroCTA.

Q: How do we handle 'Directly vs [Competitor]' comparison links in the footer?
A: These will be implemented as static footer columns linking to future comparison paths. For this ticket, they will be structural placeholders following the competitive analysis.

TECHNICAL SPECS

1. Directory Structure
- src/components/landing/: Main container and section sub-directories.
- src/components/landing/[SectionName]/: Atomic parts (e.g., Hero/Hero.tsx, Hero/HeroHeadline.tsx).
- public/logos/platforms/: SVGs for social proof icons.

2. Component Architecture (MUI-first)
- Header: Sticky AppBar with transparent-to-solid transition on scroll.
- Hero: Container with responsive Grid. Headline using Typography with gradient text options.
- Social Proof: Flex-wrap container with greyscale SVG platform logos (TikTok, IG, YouTube, Facebook).
- Core Feature Grid: Grid of FeatureCard components using MUI Card with hover elevations.
- Comparison: Side-by-side comparison block using colored semantic borders (Error for cons, Success for pros).
- Personas: ToggleButtonGroup switcher with animated content swap for 'Creator' vs 'Developer'.
- Testimonials: Masonry layout (from @mui/lab or custom CSS grid) for the 'Wall of Love'.
- Pricing: Grid of three PricingCard components highlighting the 'Local Core' (Free) tier.
- FAQ: Improved MUI Accordion with distinct glassmorphism styling.
- Footer: Multi-column Box with standard navigation and 'VS' comparison links.

3. State Management (Client Components)
- Use 'use client' for components with interactivity (Persona toggle, FAQ accordions, Sticky Header behavior).
- Ensure all components are 'Theme Aware' by utilizing MUI's theme.palette.

4. Performance
- Use next/image for any rasterized mockups.
- Inline critical SVGs to prevent layout shift.

TEST SPECIFICATION

1. Manual Testing
- Theme Resilience: Verify all 10 sections adapt seamlessly to Light and Dark modes.
- Responsive Layout: Verify grid stacking on Mobile (< 600px) and Tablet (< 900px).
- Interactivity: Verify Persona toggle switches content correctly without page reload.
- Navigation: Verify all CTA buttons lead to /login.

2. Automated Testing (Playwright)
- landing.smoke.spec.ts: Verify page title and presence of all 10 major sections.
- landing.visual.spec.ts:
  - visual-light: Full page snapshot in light mode.
  - visual-dark: Full page snapshot in dark mode.
- landing.a11y.spec.ts: Run axe-core accessibility checks.
