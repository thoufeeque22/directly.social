import React, { useState } from 'react';
import { TextField, Button, CircularProgress, Stack } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export interface TemplateFormValues {
  name: string;
  description: string;
  firstComment: string;
}

export interface TemplateFormProps {
  initialValues: TemplateFormValues;
  isUpdating: boolean;
  onSave: (values: TemplateFormValues) => void;
  onCancel: () => void;
}

export const TemplateForm: React.FC<TemplateFormProps> = ({
  initialValues,
  isUpdating,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(initialValues.name);
  const [description, setDescription] = useState(initialValues.description);
  const [firstComment, setFirstComment] = useState(initialValues.firstComment);

  const isSaveDisabled = !name.trim() || !description.trim() || isUpdating;

  return (
    <Stack spacing={2} sx={{ width: '100%', mt: 1 }}>
      <TextField
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        size="small"
        fullWidth
        disabled={isUpdating}
        slotProps={{ htmlInput: { 'aria-label': 'Name' } }}
      />
      <TextField
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        size="small"
        fullWidth
        multiline
        rows={3}
        disabled={isUpdating}
        slotProps={{ htmlInput: { 'aria-label': 'Description' } }}
      />
      <TextField
        value={firstComment}
        onChange={(e) => setFirstComment(e.target.value)}
        placeholder="First Comment"
        size="small"
        fullWidth
        multiline
        rows={2}
        disabled={isUpdating}
        slotProps={{ htmlInput: { 'aria-label': 'First Comment' } }}
      />
      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onSave({ name, description, firstComment })}
          disabled={isSaveDisabled}
          size="small"
          startIcon={isUpdating ? <CircularProgress size={16} color="inherit" /> : <CheckIcon />}
        >
          Save
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          onClick={onCancel}
          disabled={isUpdating}
          size="small"
          startIcon={<CloseIcon />}
        >
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
};
