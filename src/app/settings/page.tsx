import React, { Suspense } from 'react';
import SettingsPage from './SettingsContent';

const SettingsPageWrapper = () => {
  return (
    <Suspense fallback={<div>Loading settings...</div>}>
      <SettingsPage />
    </Suspense>
  );
};

export default SettingsPageWrapper;
