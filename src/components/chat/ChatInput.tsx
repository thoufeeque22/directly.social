import React from 'react';
import { Box, TextField, InputAdornment, IconButton } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

interface ChatInputProps {
  manualInput: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
}

export const ChatInput = ({ manualInput, handleInputChange, handleSubmit, isLoading }: ChatInputProps) => (
  <Box 
    component="form"
    onSubmit={handleSubmit}
    sx={{ 
      p: 2, 
      pb: 'calc(16px + var(--safe-area-bottom))',
      borderTop: '1px solid hsla(var(--border) / 0.5)', 
      background: 'hsla(var(--background) / 0.8)' 
    }}
  >
    <TextField
      fullWidth
      data-testid="chat-input"
      placeholder="Type a message..."
      value={manualInput}
      onChange={handleInputChange}
      disabled={isLoading}
      size="small"
      autoComplete="off"
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 3,
          bgcolor: 'hsla(var(--input) / 0.2)',
          transition: 'background-color 0.2s',
          '&:hover': { bgcolor: 'hsla(var(--input) / 0.3)' },
          '&.Mui-focused': { bgcolor: 'hsla(var(--input) / 0.4)' },
        }
      }}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton 
                data-testid="chat-send-button"
                type="submit" 
                disabled={!manualInput.trim() || isLoading}
                sx={{ color: 'primary.main' }}
              >
                <SendIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }
      }}
    />
  </Box>
);
