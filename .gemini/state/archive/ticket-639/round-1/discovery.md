
## [2026-06-04 12:50:42] Verdict: NECESSARY
**VERDICT:** NECESSARY

**SOCRATIC_LOG:**
1. **Feasibility:** The split is caused by a CSS container that doesn't span the full viewport width and has a hardcoded dark gradient background. This is easily fixed by setting width: 100% and linking background/text colors to global theme variables (hsl(var(--background)), etc.).
2. **Strategic Alignment:** Fixing the login screen ensures a consistent brand experience for users in light mode, preventing the application from feeling broken before they even log in.
3. **Architectural Integrity:** We will maintain the existing CSS Module structure but refactor it to use the project's standard HSL variables, ensuring it respects the light-mode class toggled by ThemeContextProvider.
4. **Necessity:** This is a critical UI polish task for a production-ready app.
5. **External Dependencies & Cost:** Zero.

**TECHNICAL SPECS:**
- **Refactor src/app/login/Login.module.css**:
    - .container:
        - Add width: 100%;
        - Replace background: radial-gradient(...) with background: hsl(var(--background));
    - .heroTitle & .title:
        - Update gradient to be theme-aware: linear-gradient(135deg, hsl(var(--foreground)) 0%, hsla(var(--foreground) / 0.6) 100%)
    - .heroSubtitle, .subtitle, .featureDesc, .footer:
        - Use color: hsl(var(--muted-foreground));
    - .featureTitle, .btnIcon, .modalTitle:
        - Use color: hsl(var(--foreground));
    - .loginCard:
        - Replace hardcoded background with hsla(var(--card) / 0.5) and backdrop-filter: blur(20px).
        - Replace hardcoded border with 1px solid hsla(var(--border) / 0.3).
    - .loginBtn:
        - Use background: hsla(var(--muted) / 0.5); and border: 1px solid hsla(var(--border) / 0.5);
        - Use color: hsl(var(--foreground));
- **Refactor src/components/layout/LayoutWrapper.tsx**:
    - Remove justifySelf: 'center' from the main element in the isLoginPage condition.
    - Set width: '100%' and ensure it doesn't constrain children.

**TEST SPECIFICATION:**
- **Happy Path:**
    - Open /login in a browser.
    - Toggle system theme to Light Mode; verify background becomes light and text remains legible.
    - Toggle system theme to Dark Mode; verify background becomes dark and text remains legible.
- **Edge Cases:**
    - Mobile Viewport: Verify the login card is centered and the background covers the entire screen (including safe areas).
    - Desktop Viewport (Ultra-wide): Verify .contentWrapper remains centered and doesn't stretch awkwardly.
- **Negative Scenarios:**
    - Check for any white-on-white or dark-on-dark text in either mode.
    - Verify that no side of the screen shows the body background instead of the .container background.
