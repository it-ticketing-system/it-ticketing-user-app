'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useTransition } from 'react';

type QueryPrimitive = string | number | boolean | null | undefined;

type QueryValue = QueryPrimitive | readonly QueryPrimitive[];

type QueryPatch = Record<string, QueryValue>;

type QueryUpdateOptions = {
  clear?: readonly string[];
  history?: 'push' | 'replace';
  scroll?: boolean;
  strategy?: 'router' | 'native';
};

const normalizeQueryValue = (value: QueryPrimitive): string | null => {
  if (value === null || value === undefined) {
    return null;
  }

  const normalizedValue = String(value).trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
};

export const useQueryState = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const values = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams],
  );

  const getQuery = useCallback(
    (key: string): string | null => {
      return searchParams.get(key);
    },
    [searchParams],
  );

  const getAllQueries = useCallback(
    (key: string): string[] => {
      return searchParams.getAll(key);
    },
    [searchParams],
  );

  const updateQueries = useCallback(
    (patch: QueryPatch, options: QueryUpdateOptions = {}) => {
      const {
        clear = [],
        history = 'replace',
        scroll = false,
        strategy = 'router',
      } = options;

      const nextSearchParams = new URLSearchParams(searchParams.toString());

      for (const key of clear) {
        nextSearchParams.delete(key);
      }

      for (const [key, rawValue] of Object.entries(patch)) {
        nextSearchParams.delete(key);

        if (Array.isArray(rawValue)) {
          for (const item of rawValue) {
            const normalizedValue = normalizeQueryValue(item);

            if (normalizedValue !== null) {
              nextSearchParams.append(key, normalizedValue);
            }
          }

          continue;
        }

        const normalizedValue = normalizeQueryValue(rawValue as QueryPrimitive);

        if (normalizedValue !== null) {
          nextSearchParams.set(key, normalizedValue);
        }
      }

      const queryString = nextSearchParams.toString();

      const href = queryString ? `${pathname}?${queryString}` : pathname;

      if (strategy === 'native') {
        if (history === 'push') {
          window.history.pushState(null, '', href);
          return;
        }

        window.history.replaceState(null, '', href);
        return;
      }

      startTransition(() => {
        if (history === 'push') {
          router.push(href, { scroll });
          return;
        }

        router.replace(href, { scroll });
      });
    },
    [pathname, router, searchParams],
  );

  const setQuery = useCallback(
    (key: string, value: QueryValue, options?: QueryUpdateOptions) => {
      updateQueries(
        {
          [key]: value,
        },
        options,
      );
    },
    [updateQueries],
  );

  const removeQueries = useCallback(
    (keys: readonly string[], options?: Omit<QueryUpdateOptions, 'clear'>) => {
      const patch = Object.fromEntries(keys.map((key) => [key, null]));

      updateQueries(patch, options);
    },
    [updateQueries],
  );

  return {
    values,
    isPending,
    getQuery,
    getAllQueries,
    setQuery,
    updateQueries,
    removeQueries,
  };
};

export default useQueryState;
