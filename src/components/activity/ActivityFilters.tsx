import React from 'react';
import { SearchField } from '@/components/ui/SearchField';

interface ActivityFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function ActivityFilters({ searchQuery, setSearchQuery }: ActivityFiltersProps) {
  return (
    <SearchField 
      value={searchQuery}
      onChange={setSearchQuery}
      placeholder="Search activity by title or description..."
    />
  );
}
