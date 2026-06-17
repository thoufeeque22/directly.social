'use client';

import React from 'react';
import { TitleField } from './StandardMetadataFields.Title';
import { DescriptionField } from './StandardMetadataFields.Description';
import { HashtagsField } from './StandardMetadataFields.Hashtags';
import { FirstCommentField } from './StandardMetadataFields.FirstComment';

export const StandardMetadataFields: React.FC = () => {
  return (
    <>
      <TitleField />
      <DescriptionField />
      <HashtagsField />
      <FirstCommentField />
    </>
  );
};
