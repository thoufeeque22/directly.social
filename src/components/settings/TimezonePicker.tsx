'use client';

import React, { useMemo } from 'react';
import { Autocomplete, TextField } from '@mui/material';

interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
  continent: string;
}

function buildTimezoneOptions(): TimezoneOption[] {
  const zones = Intl.supportedValuesOf('timeZone');
  return zones.map(tz => {
    const formatter = new Intl.DateTimeFormat('en', { timeZone: tz, timeZoneName: 'longOffset' });
    const parts = formatter.formatToParts(new Date());
    const offset = parts.find(p => p.type === 'timeZoneName')?.value || 'GMT';
    const continent = tz.includes('/') ? tz.split('/')[0] : 'Other';
    return { value: tz, label: `(${offset}) ${tz.replace(/_/g, ' ')}`, offset, continent };
  });
}

interface TimezonePickerProps {
  value: string;
  onChange: (timezone: string) => void;
}

export const TimezonePicker = ({ value, onChange }: TimezonePickerProps) => {
  const options = useMemo(() => buildTimezoneOptions(), []);
  const selected = options.find(o => o.value === value) || undefined;

  return (
    <Autocomplete
      options={options}
      groupBy={(option) => option.continent}
      getOptionLabel={(option) => option.label}
      value={selected}
      onChange={(_e, newValue) => {
        if (newValue) onChange(newValue.value);
      }}
      isOptionEqualToValue={(option, val) => option.value === val.value}
      renderInput={(params) => (
        <TextField {...params} label="Timezone" placeholder="Search by city or offset..." />
      )}
      disableClearable
      fullWidth
    />
  );
};
