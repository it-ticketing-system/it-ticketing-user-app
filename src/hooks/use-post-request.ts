'use client';

import { toast } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import { ApiException, normalizeApiError } from '@/apis/core/api-error';

interface BaseOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

interface UsePostRequestWithPayloadOptions<
  TPayload,
  TResponse,
> extends BaseOptions {
  requestFn: (payload: TPayload) => Promise<TResponse>;
  getSuccessDescription?: (data: TResponse, payload: TPayload) => string;
  onSuccess?: (data: TResponse, payload: TPayload) => void | Promise<void>;
  onError?: (error: ApiException, payload: TPayload) => void | Promise<void>;
}

interface UsePostRequestWithoutPayloadOptions<TResponse> extends BaseOptions {
  requestFn: () => Promise<TResponse>;
  getSuccessDescription?: (data: TResponse) => string;
  onSuccess?: (data: TResponse) => void | Promise<void>;
  onError?: (error: ApiException) => void | Promise<void>;
}

interface BaseResult<TResponse> {
  data: TResponse | null;
  error: ApiException | null;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  reset: () => void;
}

interface UsePostRequestWithPayloadResult<
  TPayload,
  TResponse,
> extends BaseResult<TResponse> {
  mutateAsync: (payload: TPayload) => Promise<TResponse>;
}

interface UsePostRequestWithoutPayloadResult<
  TResponse,
> extends BaseResult<TResponse> {
  mutateAsync: () => Promise<TResponse>;
}

function usePostRequest<TResponse>(
  options: UsePostRequestWithoutPayloadOptions<TResponse>,
): UsePostRequestWithoutPayloadResult<TResponse>;

function usePostRequest<TPayload, TResponse>(
  options: UsePostRequestWithPayloadOptions<TPayload, TResponse>,
): UsePostRequestWithPayloadResult<TPayload, TResponse>;

function usePostRequest<TPayload, TResponse>({
  requestFn,
  showSuccessToast = true,
  showErrorToast = true,
  getSuccessDescription,
  onSuccess,
  onError,
}:
  | UsePostRequestWithPayloadOptions<TPayload, TResponse>
  | UsePostRequestWithoutPayloadOptions<TResponse>) {
  const t = useTranslations('common');

  const [data, setData] = useState<TResponse | null>(null);
  const [error, setError] = useState<ApiException | null>(null);
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = useCallback(
    async (payload?: TPayload): Promise<TResponse> => {
      setIsPending(true);
      setError(null);

      try {
        const response = await (
          requestFn as (payload?: TPayload) => Promise<TResponse>
        )(payload);

        setData(response);

        if (showSuccessToast) {
          const description =
            (
              getSuccessDescription as
                ((data: TResponse, payload?: TPayload) => string) | undefined
            )?.(response, payload) ?? t('toast.successDescription');

          toast.success(t('toast.successTitle'), {
            description,
          });
        }

        await (
          onSuccess as
            | ((data: TResponse, payload?: TPayload) => void | Promise<void>)
            | undefined
        )?.(response, payload);

        return response;
      } catch (error) {
        const apiError = normalizeApiError(error);

        setError(apiError);

        if (showErrorToast) {
          toast.danger(t('toast.errorTitle'), {
            description: t(apiError.messageKey),
          });
        }

        await (
          onError as
            | ((
                error: ApiException,
                payload?: TPayload,
              ) => void | Promise<void>)
            | undefined
        )?.(apiError, payload);

        throw apiError;
      } finally {
        setIsPending(false);
      }
    },
    [
      requestFn,
      showSuccessToast,
      showErrorToast,
      getSuccessDescription,
      onSuccess,
      onError,
      t,
    ],
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsPending(false);
  }, []);

  return {
    data,
    error,
    isPending,
    isSuccess: data !== null && error === null,
    isError: error !== null,
    mutateAsync,
    reset,
  };
}

export default usePostRequest;
