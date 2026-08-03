'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  isPersistableQueryKey,
  persistReadableQueries,
  restoreReadableQueries,
} from '@/utils';

interface QueryPersistenceProviderProps {
  userId: number | null;
}

const SAVE_DEBOUNCE_MS = 750;

const QueryPersistenceProvider = ({ userId }: QueryPersistenceProviderProps) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId || !('indexedDB' in window)) {
      return;
    }

    let timeoutId: number | null = null;
    let isMounted = true;

    void restoreReadableQueries(userId, queryClient).catch(() => undefined);

    const schedulePersist = () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(() => {
        void persistReadableQueries(userId, queryClient).catch(() => undefined);
      }, SAVE_DEBOUNCE_MS);
    };

    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (!isMounted || event.type !== 'updated') {
        return;
      }

      if (!isPersistableQueryKey(event.query.queryKey)) {
        return;
      }

      if (event.query.state.status !== 'success') {
        return;
      }

      schedulePersist();
    });

    return () => {
      isMounted = false;
      unsubscribe();

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [queryClient, userId]);

  return null;
};

export default QueryPersistenceProvider;
