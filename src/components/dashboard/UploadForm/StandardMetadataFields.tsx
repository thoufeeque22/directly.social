'use client';

import React from 'react';
import { useUploadFormContext } from './UploadFormContext';
import { TitleField } from './StandardMetadataFields.Title';
import { DescriptionField } from './StandardMetadataFields.Description';

export const StandardMetadataFields: React.FC = () => {
  const { isPlatformSpecific } = useUploadFormContext();
  if (isPlatformSpecific) return null;

  return (
    <>
      <TitleField />
      <DescriptionField />
    </>
  );
};
