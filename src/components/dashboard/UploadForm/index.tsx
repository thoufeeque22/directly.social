import React from 'react';
import { UploadFormProvider } from './UploadFormContext';
import { UploadFormProps } from './UploadFormContext.types';
import { UploadFormInner } from './UploadFormInner';

export { type UploadFormProps } from './UploadFormContext.types';

export const UploadForm: React.FC<UploadFormProps> = (props) => (
  <UploadFormProvider props={props}>
    <UploadFormInner />
  </UploadFormProvider>
);
