'use client';

import React from 'react';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';

interface MediaLibraryDialogsProps {
  singleDeleteId: string | null;
  setSingleDeleteId: (id: string | null) => void;
  onSingleDeleteConfirm: () => void;
  showClearAllDialog: boolean;
  setShowClearAllDialog: (show: boolean) => void;
  onClearAllConfirm: () => void;
}

export const MediaLibraryDialogs: React.FC<MediaLibraryDialogsProps> = ({
  singleDeleteId,
  setSingleDeleteId,
  onSingleDeleteConfirm,
  showClearAllDialog,
  setShowClearAllDialog,
  onClearAllConfirm,
}) => {
  return (
    <>
      <DeleteConfirmationDialog
        open={singleDeleteId !== null}
        onClose={() => setSingleDeleteId(null)}
        onConfirm={onSingleDeleteConfirm}
        message="Are you sure you want to delete this asset?"
      />

      <DeleteConfirmationDialog
        open={showClearAllDialog}
        onClose={() => setShowClearAllDialog(false)}
        onConfirm={onClearAllConfirm}
        message="Are you sure you want to delete ALL assets?"
      />
    </>
  );
};
