import React, { Suspense } from 'react';
import { Metadata } from 'next';
import SettingsPage from './SettingsContent';

export const metadata: Metadata = {
  title: "Settings | SocialStudio",
};

const SettingsPageWrapper = () => {
  return (
    <Suspense fallback={<div>Loading settings...</div>}>
      <SettingsPage />
    </Suspense>
  );
};

export default SettingsPageWrapper;
