import React from 'react';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface Props { isScheduled: boolean; scheduledAt: string; onChange: (isScheduled: boolean, date: string) => void; }

export const SchedulingSelector: React.FC<Props> = ({ isScheduled, scheduledAt, onChange }) => (
  <div style={containerStyle}>
    <div style={wrapperStyle}>
      <label style={labelStyle}>
        <input type="checkbox" checked={isScheduled} onChange={(e) => onChange(e.target.checked, scheduledAt)} style={checkboxStyle} />
        Schedule for later
      </label>
      {isScheduled && (
        <div style={pickerWrapperStyle} onClick={(e) => (e.currentTarget.querySelector('input') as HTMLInputElement & { showPicker?: () => void })?.showPicker?.()}>
          <CalendarMonthIcon sx={{ position: 'absolute', left: '0.75rem', fontSize: 20 }} />
          <input type="datetime-local" value={scheduledAt} onChange={(e) => onChange(true, e.target.value)}
            min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
            required style={inputStyle} />
        </div>
      )}
    </div>
  </div>
);

const containerStyle: React.CSSProperties = { padding: '1rem', borderRadius: '0.75rem', background: 'hsla(var(--muted)/0.3)', border: '1px solid hsla(var(--border)/0.3)' };
const wrapperStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' };
const labelStyle: React.CSSProperties = { fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center' };
const checkboxStyle: React.CSSProperties = { marginRight: '0.5rem', width: '1.1rem', height: '1.1rem' };
const pickerWrapperStyle: React.CSSProperties = { position: 'relative', display: 'flex', alignItems: 'center', cursor: 'pointer', width: '100%', maxWidth: '300px' };
const inputStyle: React.CSSProperties = { background: 'hsla(var(--background)/0.5)', border: '1px solid hsla(var(--border)/0.5)', borderRadius: '0.5rem', padding: '0.5rem 0.75rem 0.5rem 2.5rem', color: 'white', fontSize: '0.85rem', outline: 'none', width: '100%', cursor: 'pointer' };
