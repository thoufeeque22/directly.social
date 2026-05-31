'use client';

import React from 'react';

export interface Update {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface WhatsNewContextType {
  updates: Update[];
  setUpdates: React.Dispatch<React.SetStateAction<Update[]>>;
  refreshUpdates: () => Promise<Update[]>;
}
