'use client';

import React from 'react';
import { useUploadFormContext } from './UploadFormContext';

export const UploadHeader: React.FC = () => {
  const { byosActive, byosProvider } = useUploadFormContext();

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '8px' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Upload & Automate</h2>
      {byosActive && (
        <div
          id="byos-active-badge"
          style={{
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            boxShadow: '0 0 10px rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 8px #10B981' }}></span>
          BYOS: {byosProvider} Active Pipeline
        </div>
      )}
    </div>
  );
};
