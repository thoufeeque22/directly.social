# Mobile Architecture & Standards

## 1. Capacitor Wrapper

The application is wrapped using **Capacitor**, allowing it to run as a native app on iOS and Android while sharing the same web codebase. Native features (camera, gallery, auth) are accessed via Capacitor plugins.

## 2. Mobile UI/UX Standards

To ensure a premium, native-like experience on iOS and Android devices, Directly follows specific mobile UI/UX standards.

### 2.1 Safe Area Insets

The application handles system UI overlaps using CSS environment variables:

- **Viewport Configuration:** The main layout includes `<meta name="viewport" content="viewport-fit=cover">`.
- **Global CSS Variables:** Standard safe area insets are mapped to CSS variables in `src/app/globals.css`:
  ```css
  :root {
    --safe-area-inset-top: env(safe-area-inset-top, 0px);
    --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
    --safe-area-inset-left: env(safe-area-inset-left, 0px);
    --safe-area-inset-right: env(safe-area-inset-right, 0px);
  }
  ```
- **Component Implementation:** Components use `calc()` to combine base padding with these safe area insets.

### 2.2 Gestures & Interactions

- **Pull-to-Refresh:** Integrated via the `useAppRefresh` hook and `LayoutWrapper`.
- **Overscroll Behavior:** `overscroll-behavior-y: none` is applied to the root container to prevent the "rubber-band" effect.
