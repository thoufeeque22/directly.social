# Manual Test Script: Ticket #644 - Marketing Landing Page

## Metadata
- **Ticket ID**: 644
- **Feature**: Marketing Landing Page
- **Tester**: [Name]
- **Date**: [YYYY-MM-DD]

## Prerequisites
1. Ensure the development server is running (`npm run dev`).
2. Ensure you are logged out (or use an Incognito/Private window).

## Test Scenarios

### 1. Initial Load & Layout
1. **Navigate** to `http://localhost:3000/`.
2. **Verify** that the landing page loads successfully.
3. **Verify** that all 10 major sections are present and visible:
   - Header (Sticky)
   - Hero (Headline, Sub-headline, CTA, Mockup)
   - Social Proof (Platform Logos)
   - Feature Grid
   - Comparison (SaaS Tax)
   - Persona Switcher
   - Testimonials
   - Pricing Table
   - FAQ
   - Footer

### 2. Header & Navigation
1. **Verify** that the header stays sticky while scrolling.
2. **Click** on the "Features" link in the header.
3. **Verify** that it scrolls smoothly to the features section.
4. **Click** on the "Pricing" link in the header.
5. **Verify** that it scrolls smoothly to the pricing section.
6. **Click** on the "Get Started" button.
7. **Verify** that it redirects to the `/login` page.

### 3. Hero Section Interactivity
1. **Click** on the "Get Started for Free" button in the Hero section.
2. **Verify** that it redirects to the `/login` page.
3. **Click** on "Explore Features".
4. **Verify** that it scrolls to the features section.

### 4. Persona Switcher
1. **Locate** the "Built for Every Workflow" section.
2. **Click** on the "Developers" toggle.
3. **Verify** that the content (Title, Description, Benefits) updates to the Developer persona.
4. **Click** back to "Creators".
5. **Verify** that the content reverts to the Creator persona.

### 5. FAQ Accordion
1. **Locate** the "Common Questions" section.
2. **Click** on several FAQ questions.
3. **Verify** that they expand to show the answer and collapse when clicked again.

### 6. Theme Resilience (Visual)
1. **Toggle** system appearance between Light and Dark mode.
2. **Verify** that all sections remain readable and aesthetically pleasing.
3. **Verify** specifically that the `DashboardMockup` colors adapt correctly to the background.

### 7. Responsive Layout
1. **Resize** the browser window to mobile width (< 600px).
2. **Verify** that the Hero section stacks vertically.
3. **Verify** that the Feature grid and Testimonials adapt to a single column.
4. **Verify** that the Footer links stack correctly.

## Verdict
- [ ] **PASS**
- [ ] **FAIL** (Reason: ____________________)
