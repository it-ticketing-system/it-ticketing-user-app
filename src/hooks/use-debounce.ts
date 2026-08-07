'use client';

import { useEffect, useState } from 'react';

const DEBOUNCE_DELAY_MS = 400;

const useDebounce = <T>(value: T): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, DEBOUNCE_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [value]);

  return debouncedValue;
};

export default useDebounce;
