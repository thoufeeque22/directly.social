'use client';

import React from 'react';

interface E2ELoginFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function E2ELoginForm({ onSubmit }: E2ELoginFormProps) {
  return (
    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid hsla(var(--border)/0.5)' }}>
      <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))', marginBottom: '1rem', letterSpacing: '0.05em' }}>E2E Test Login</h3>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <input 
          name="email" 
          type="email" 
          placeholder="Test Email" 
          defaultValue="tester@directly.social"
          required
          data-testid="e2e-email-input"
          style={{ background: 'hsla(var(--muted)/0.3)', border: '1px solid hsla(var(--border)/0.5)', padding: '0.75rem', borderRadius: '0.5rem', color: 'hsl(var(--foreground))' }}
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Test Password" 
          required
          data-testid="e2e-password-input"
          style={{ background: 'hsla(var(--muted)/0.3)', border: '1px solid hsla(var(--border)/0.5)', padding: '0.75rem', borderRadius: '0.5rem', color: 'hsl(var(--foreground))' }}
        />
        <button 
          type="submit"
          data-testid="e2e-login-submit"
          style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
        >
          Authenticate Tester
        </button>
      </form>
    </div>
  );
}
