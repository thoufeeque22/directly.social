import React from 'react';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import RefreshIcon from '@mui/icons-material/Refresh';

interface ActionsProps {
  onBack: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
}

export const ReviewActions: React.FC<ActionsProps> = ({ onBack, onConfirm, isProcessing }) => (
  <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
    <button onClick={onBack} disabled={isProcessing} style={backButtonStyle}>
      <RefreshIcon sx={{ fontSize: 18, transform: 'rotate(-90deg)' }} /> Back to Step 1
    </button>
    <button onClick={onConfirm} disabled={isProcessing} style={confirmButtonStyle(isProcessing)}>
      {isProcessing ? <RocketLaunchIcon className="animate-pulse" /> : <RocketLaunchIcon />}
      {isProcessing ? 'Distributing...' : 'Confirm Strategy & Distribute'}
    </button>
  </div>
);

const backButtonStyle: React.CSSProperties = { flex: 1, padding: '1rem', borderRadius: '0.75rem', border: '1px solid hsla(var(--border) / 0.5)', background: 'transparent', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' };
const confirmButtonStyle = (isProcessing: boolean): React.CSSProperties => ({ flex: 2, padding: '1rem', borderRadius: '0.75rem', border: 'none', background: 'hsl(var(--primary))', color: 'white', fontWeight: 700, cursor: isProcessing ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px hsla(var(--primary) / 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' });
