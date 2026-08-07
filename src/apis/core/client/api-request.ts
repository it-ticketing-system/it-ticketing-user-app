'use client';

import { createApiExceptionFromPayload } from '../api-error';
import { clientApiClient } from './api-client';
import type {
  ApiPaginatedResponse,
  ApiResponse,
  PaginatedResult,
} from '@/apis/core/types/api-response';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export async function clientApiRequest<TResponse, TBody = unknown>(
  config: AxiosRequestConfig<TBody>,
): Promise<TResponse> {
  const response = await clientApiClient.request<
    ApiResponse<TResponse>,
    AxiosResponse<ApiResponse<TResponse>>,
    TBody
  >(config);

  const payload = response.data;

  if (!payload.success) {
    throw createApiExceptionFromPayload(payload.error, response.status);
  }

  return payload.data;
}

export async function clientApiPaginatedRequest<TItem, TBody = unknown>(
  config: AxiosRequestConfig<TBody>,
): Promise<PaginatedResult<TItem>> {
  const response = await clientApiClient.request<
    ApiPaginatedResponse<TItem>,
    AxiosResponse<ApiPaginatedResponse<TItem>>,
    TBody
  >(config);

  const payload = response.data;

  if (!payload.success) {
    throw createApiExceptionFromPayload(payload.error, response.status);
  }

  return {
    items: payload.data,
    meta: payload.meta,
  };
}
