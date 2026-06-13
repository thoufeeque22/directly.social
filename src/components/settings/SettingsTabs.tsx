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
  <Tabs value={activeTab} onChange={onChange} variant="scrollable" scrollButtons="auto">
    {TABS.map((tab) => (
      <Tab key={tab.id} value={tab.id} icon={tab.icon} iconPosition="start" label={tab.label} />
    ))}
  </Tabs>
);
