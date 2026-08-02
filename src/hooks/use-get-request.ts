'use client';

import { toast } from '@heroui/react';
import {
  keepPreviousData as keepPreviousQueryData,
  useQuery,
  useQueryClient,
  type QueryKey,
} from '@tanstack/react-query';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { ApiException, normalizeApiError } from '@/apis/core/api-error';

interface UseGetRequestOptions<TResponse> {
  queryKey: QueryKey;
  requestFn: (signal?: AbortSignal) => Promise<TResponse>;
  enabled?: boolean;
  initialData?: TResponse | (() => TResponse | undefined);
  keepPreviousData?: boolean;
  staleTime?: number;
  showErrorToast?: boolean;
  onSuccess?: (data: TResponse) => void | Promise<void>;
  onError?: (error: ApiException) => void | Promise<void>;
}

interface UseGetRequestResult<TResponse> {
  data: TResponse | null;
  error: ApiException | null;
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
  isFetched: boolean;
  refetch: () => Promise<TResponse>;
  reset: () => void;
}

function isCancelledRequest(error: unknown): boolean {
  return (
    axios.isCancel(error) ||
    (error instanceof DOMException && error.name === 'AbortError')
  );
}

function useGetRequest<TResponse>({
  queryKey,
  requestFn,
  enabled = true,
  initialData,
  keepPreviousData = false,
  staleTime,
  showErrorToast = true,
  onSuccess,
  onError,
}: UseGetRequestOptions<TResponse>): UseGetRequestResult<TResponse> {
  const t = useTranslations('common');
  const queryClient = useQueryClient();
  const handledSuccessAtRef = useRef(0);
  const handledErrorAtRef = useRef(0);

  const query = useQuery<TResponse, unknown>({
    queryKey,
    enabled,
    queryFn: async ({ signal }) => {
      try {
        return await requestFn(signal);
      } catch (error) {
        if (isCancelledRequest(error)) {
          throw error;
        }

        throw normalizeApiError(error);
      }
    },
    initialData,
    placeholderData: keepPreviousData ? keepPreviousQueryData : undefined,
    staleTime,
  });

  useEffect(() => {
    if (
      query.data === undefined ||
      query.dataUpdatedAt === 0 ||
      handledSuccessAtRef.current === query.dataUpdatedAt
    ) {
      return;
    }

    handledSuccessAtRef.current = query.dataUpdatedAt;
    void onSuccess?.(query.data);
  }, [onSuccess, query.data, query.dataUpdatedAt]);

  const error = useMemo(() => {
    if (!query.error || isCancelledRequest(query.error)) {
      return null;
    }

    return normalizeApiError(query.error);
  }, [query.error]);

  useEffect(() => {
    if (
      !error ||
      query.errorUpdatedAt === 0 ||
      handledErrorAtRef.current === query.errorUpdatedAt
    ) {
      return;
    }

    handledErrorAtRef.current = query.errorUpdatedAt;

    if (showErrorToast) {
      toast.danger(t('toast.errorTitle'), {
        description: t(error.messageKey),
      });
    }

    void onError?.(error);
  }, [error, onError, query.errorUpdatedAt, showErrorToast, t]);

  const refetch = useCallback(async (): Promise<TResponse> => {
    const result = await query.refetch({
      throwOnError: true,
    });

    return result.data as TResponse;
  }, [query]);

  const reset = useCallback(() => {
    queryClient.removeQueries({
      queryKey,
      exact: true,
    });
  }, [queryClient, queryKey]);

  return {
    data: query.data ?? null,
    error,
    isLoading: enabled && query.isPending,
    isFetching: query.isFetching,
    isSuccess: query.data !== undefined && error === null,
    isError: error !== null,
    isFetched: query.isFetched,
    refetch,
    reset,
  };
}

export default useGetRequest;
