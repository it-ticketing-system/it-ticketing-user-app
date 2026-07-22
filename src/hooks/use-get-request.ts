'use client';

import { toast } from '@heroui/react';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiException, normalizeApiError } from '@/apis/core/api-error';

interface UseGetRequestOptions<TResponse> {
  requestFn: (signal?: AbortSignal) => Promise<TResponse>;
  enabled?: boolean;
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
  requestFn,
  enabled = true,
  showErrorToast = true,
  onSuccess,
  onError,
}: UseGetRequestOptions<TResponse>): UseGetRequestResult<TResponse> {
  const t = useTranslations('common');

  const [data, setData] = useState<TResponse | null>(null);
  const [error, setError] = useState<ApiException | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isFetching, setIsFetching] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(async (): Promise<TResponse> => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsFetching(true);
    setError(null);

    try {
      const response = await requestFn(controller.signal);

      if (controller.signal.aborted) {
        throw new DOMException('Request aborted', 'AbortError');
      }

      setData(response);
      await onSuccess?.(response);

      return response;
    } catch (error) {
      if (isCancelledRequest(error)) {
        throw error;
      }

      const apiError = normalizeApiError(error);
      setError(apiError);

      if (showErrorToast) {
        toast.danger(t('toast.errorTitle'), {
          description: t(apiError.messageKey),
        });
      }

      await onError?.(apiError);

      throw apiError;
    } finally {
      if (!controller.signal.aborted) {
        setIsFetching(false);
        setIsLoading(false);
      }
    }
  }, [requestFn, showErrorToast, onSuccess, onError, t]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let isActive = true;

    queueMicrotask(() => {
      if (!isActive) {
        return;
      }

      void execute().catch((error) => {
        if (isCancelledRequest(error)) {
          return;
        }
      });
    });

    return () => {
      isActive = false;
      abortControllerRef.current?.abort();
    };
  }, [enabled, execute]);

  const reset = useCallback(() => {
    abortControllerRef.current?.abort();
    setData(null);
    setError(null);
    setIsLoading(false);
    setIsFetching(false);
  }, []);

  return {
    data,
    error,
    isLoading: enabled && isLoading,
    isFetching,
    isSuccess: data !== null && error === null,
    isError: error !== null,
    refetch: execute,
    reset,
  };
}

export default useGetRequest;
