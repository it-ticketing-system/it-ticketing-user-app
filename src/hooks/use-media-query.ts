'use client';

import { useEffect, useState } from 'react';
import { BREAKPOINTS } from '@/constants';

type UseMediaQueryResult = {
  isDesktop: boolean | null;
};

const DESKTOP_MEDIA_QUERY = `(min-width: ${BREAKPOINTS.lg}px)`;

const useMediaQuery = (): UseMediaQueryResult => {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);

    const updateIsDesktop = () => {
      setIsDesktop(mediaQuery.matches);
    };

    updateIsDesktop();
    mediaQuery.addEventListener('change', updateIsDesktop);

    return () => {
      mediaQuery.removeEventListener('change', updateIsDesktop);
    };
  }, []);

  return {
    isDesktop,
  };
};

export default useMediaQuery;
