'use client';

import { toast } from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
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

  const mutation = useMutation<TResponse, ApiException, TPayload | undefined>({
    mutationFn: async (payload) => {
      try {
        return await (requestFn as (payload?: TPayload) => Promise<TResponse>)(
          payload,
        );
      } catch (error) {
        throw normalizeApiError(error);
      }
    },

    onSuccess: async (response, payload) => {
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
    },

    onError: async (apiError, payload) => {
      if (showErrorToast) {
        toast.danger(t('toast.errorTitle'), {
          description: t(apiError.messageKey),
        });
      }

      await (
        onError as
          | ((error: ApiException, payload?: TPayload) => void | Promise<void>)
          | undefined
      )?.(apiError, payload);
    },
  });

  return {
    data: mutation.data ?? null,
    error: mutation.error,
    isPending: mutation.isPending,
    isSuccess: mutation.data !== undefined && mutation.error === null,
    isError: mutation.error !== null,
    mutateAsync: mutation.mutateAsync as (
      payload?: TPayload,
    ) => Promise<TResponse>,
    reset: mutation.reset,
  };
}

export default usePostRequest;
