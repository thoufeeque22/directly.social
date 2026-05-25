'use client';

import React from 'react';
import SearchIcon from '@mui/icons-material/Search';

interface AssetSearchProps {
  query: string;
  onChange: (val: string) => void;
}

export const AssetSearch: React.FC<AssetSearchProps> = ({ query, onChange }) => {
  return (
    <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
      <SearchIcon style={searchIconStyle} />
      <input 
        type="text" 
        placeholder="Search filenames..."
        value={query}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    </div>
  );
};

const searchIconStyle: React.CSSProperties = { 
  position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', 
  color: 'hsl(var(--muted-foreground))', fontSize: 16 
};

const inputStyle: React.CSSProperties = { 
  width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', 
  borderRadius: '0.75rem', border: '1px solid hsla(var(--border) / 0.5)',
  background: 'hsla(var(--muted) / 0.3)', color: 'white'
};
