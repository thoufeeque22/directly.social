"use client";
import React from 'react';
import { Tabs, Tab } from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import TuneIcon from '@mui/icons-material/Tune';
import StorageIcon from '@mui/icons-material/Storage';
import AppsIcon from '@mui/icons-material/Apps';
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined';
import SecurityIcon from '@mui/icons-material/Security';

const TABS = [
  { id: 'destinations', label: 'Destinations', icon: <AppsIcon /> },
  { id: 'snippets', label: 'Snippets', icon: <TuneIcon /> },
  { id: 'ai', label: 'AI Providers', icon: <KeyIcon /> },
  { id: 'storage', label: 'Storage (BYOS)', icon: <StorageIcon /> },
  { id: 'privacy', label: 'Privacy', icon: <SecurityIcon /> },
  { id: 'support', label: 'Support', icon: <HelpOutlinedIcon /> },
];

interface SettingsTabsProps {
  activeTab: string;
  onChange: (event: React.SyntheticEvent, newValue: string) => void;
}

export const SettingsTabs: React.FC<SettingsTabsProps> = ({ activeTab, onChange }) => (
  <Tabs 
    value={activeTab} 
    onChange={onChange} 
    orientation="vertical"
    sx={{ 
      borderRight: 0,
      '& .MuiTabs-indicator': {
        left: 0,
        right: 'auto',
        width: 4,
        borderRadius: '0 4px 4px 0'
      },
      '& .MuiTab-root': {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        textAlign: 'left',
        minHeight: 48,
        py: 1.5,
        px: 2,
        borderRadius: 1,
        mb: 0.5,
        transition: 'all 0.2s ease',
        '&:hover': {
          bgcolor: 'action.hover',
        },
        '&.Mui-selected': {
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          '& .MuiSvgIcon-root': {
            color: 'inherit'
          }
        }
      }
    }}
  >
    {TABS.map((tab) => (
      <Tab 
        key={tab.id} 
        value={tab.id} 
        icon={tab.icon} 
        iconPosition="start" 
        label={tab.label} 
        disableRipple
      />
    ))}
  </Tabs>
);
