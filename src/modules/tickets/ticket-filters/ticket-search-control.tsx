'use client';

import { useEffect, useRef, useState } from 'react';
import { useDebounce } from '@/hooks';
import TicketSearchField from './ticket-search-field';

type TicketSearchControlProps = {
  querySearch: string;
  onSearchChange: (value: string) => void;
  className?: string;
};

const TicketSearchControl = ({
  querySearch,
  onSearchChange,
  className,
}: TicketSearchControlProps) => {
  const [value, setValue] = useState(querySearch);
  const debouncedValue = useDebounce(value.trim());
  const lastRequestedSearchRef = useRef(querySearch);
  const skipDebouncedUpdateRef = useRef(false);

  useEffect(() => {
    if (querySearch === lastRequestedSearchRef.current) {
      return;
    }

    skipDebouncedUpdateRef.current = true;
    lastRequestedSearchRef.current = querySearch;
    setValue(querySearch);
  }, [querySearch]);

  useEffect(() => {
    if (skipDebouncedUpdateRef.current) {
      skipDebouncedUpdateRef.current = false;
      return;
    }

    if (debouncedValue === querySearch) {
      return;
    }

    lastRequestedSearchRef.current = debouncedValue;

    onSearchChange(debouncedValue);
  }, [debouncedValue, onSearchChange, querySearch]);

  return (
    <TicketSearchField
      value={value}
      onChange={setValue}
      className={className}
    />
  );
};

export default TicketSearchControl;
