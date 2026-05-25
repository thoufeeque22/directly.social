import React from 'react';
import { SearchField } from '@/components/ui/SearchField';

interface HistoryFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function HistoryFilters({ searchQuery, setSearchQuery }: HistoryFiltersProps) {
  return (
    <SearchField 
      value={searchQuery}
      onChange={setSearchQuery}
      placeholder="Search history by title or description..."
    />
  );
}
