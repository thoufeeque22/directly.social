'use client';

import React, { useMemo } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import ct from 'countries-and-timezones';

interface TimezoneOption {
  value: string;
  label: string;
  country: string;
  searchText: string;
}

function buildTimezoneOptions(): TimezoneOption[] {
  const countries = ct.getAllCountries();
  const results: TimezoneOption[] = [];

  for (const country of Object.values(countries)) {
    for (const tz of country.timezones) {
      const tzData = ct.getTimezone(tz);
      if (!tzData || tzData.aliasOf) continue;
      const city = tz.includes('/') ? tz.split('/').pop()?.replace(/_/g, ' ') : tz;
      const offset = tzData.utcOffsetStr;
      results.push({
        value: tz,
        label: `(GMT${offset}) ${city}`,
        country: country.name,
        searchText: `${country.name} ${city} GMT${offset} ${tz}`,
      });
    }
  }

  results.sort((a, b) => a.country.localeCompare(b.country) || a.label.localeCompare(b.label));
  return results;
}

interface TimezonePickerProps {
  value: string;
  onChange: (timezone: string) => void;
}

export const TimezonePicker = ({ value, onChange }: TimezonePickerProps) => {
  const options = useMemo(() => {
    const built = buildTimezoneOptions();
    const hasUtc = built.some(o => o.value === 'UTC');
    if (!hasUtc) {
      built.unshift({ value: 'UTC', label: '(GMT+00:00) UTC', country: 'Universal', searchText: 'Universal UTC GMT+00:00' });
    }
    return built;
  }, []);
  const selected = options.find(o => o.value === value) || options[0];

  return (
    <Autocomplete
      options={options}
      groupBy={(option) => option.country}
      getOptionLabel={(option) => option.label}
      filterOptions={(opts, state) => {
        const q = state.inputValue.toLowerCase();
        if (!q) return opts;
        return opts.filter(o => o.searchText.toLowerCase().includes(q));
      }}
      value={selected}
      onChange={(_e, newValue) => {
        if (newValue) onChange(newValue.value);
      }}
      isOptionEqualToValue={(option, val) => option.value === val.value}
      renderInput={(params) => (
        <TextField {...params} label="Timezone" placeholder="Search by country, city, or offset..." />
      )}
      disableClearable
      fullWidth
    />
  );
};
