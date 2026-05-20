"use client";

import { useEffect, useState } from "react";
import { createSyncSession } from "@/lib/actions/auth";

export default function AuthSuccessPage() {
  const [status, setStatus] = useState("Crafting your space...");
  const [debugToken, setDebugToken] = useState<string | null>(null);

  useEffect(() => {
    async function sync() {
      try {
        const result = await createSyncSession();

        if (result.token) {
          setDebugToken(result.token);
          setStatus("Welcoming you home...");

          const token = result.token;

          // Strategy 1: Custom Scheme (Simple)
          const deepLink = `socialstudio://login-success?token=${token}`;

          // Strategy 2: Package-specific Scheme (Capacitor default style)
          const packageLink = `com.thoufeeque.socialstudio://login-success?token=${token}`;

          // Try both
          window.location.href = deepLink;

          setTimeout(() => {
            window.location.href = packageLink;
          }, 500);

          // Strategy 3: Intent as absolute last resort
          setTimeout(() => {
            const intentLink = `intent://login-success?token=${token}#Intent;scheme=socialstudio;package=com.thoufeeque.socialstudio;S.browser_fallback_url=${encodeURIComponent(window.location.origin)};end`;
            window.location.href = intentLink;
          }, 1500);

        } else {
          setStatus("Something went wrong. Let us try that again.");
        }
      } catch (err) {
        console.error("Sync error:", err);
        setStatus("A gentle hiccup occurred during synchronization.");
      }
    }

    sync();
  }, []);

  const manualRedirect = () => {
    if (debugToken) {
       window.location.href = `socialstudio://login-success?token=${debugToken}`;
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: 'hsl(var(--background))',
      color: 'hsl(var(--foreground))',
      fontFamily: 'Inter, sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{ fontSize: '60px' }}>🌌</div>
      <h1 style={{ marginTop: '20px', fontSize: '24px' }}>Welcome Back!</h1>
      <p style={{ opacity: 0.8, marginBottom: '30px' }}>{status}</p>

      {debugToken && (
        <button
          onClick={manualRedirect}
          style={{
            padding: '16px 32px',
            backgroundColor: 'hsl(var(--primary))',
            borderRadius: '1.25rem',
            color: 'hsl(var(--primary-foreground))',
            border: 'none',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
          }}
        >
          Open Social Studio
        </button>
      )}

      <div style={{ marginTop: '40px', fontSize: '12px', opacity: 0.4 }}>
        If the button doesn&apos;t work, ensure you are opening this page <br/> in Chrome or the system browser.
      </div>
    </div>
  );
}
