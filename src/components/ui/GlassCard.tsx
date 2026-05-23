import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', style = {}, ...props }) => {
  return (
    <div 
      className={`glass-card ${className}`} 
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};
