'use client';

import React from 'react';
import { LocalVaultPanel } from './LocalVaultPanel';

interface LocalVaultViewProps {
  onPostAsset: (file: File) => void | Promise<void>;
}

export const LocalVaultView: React.FC<LocalVaultViewProps> = ({ onPostAsset }) => {
  return <LocalVaultPanel onPostAsset={onPostAsset} />;
};
