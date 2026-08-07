import 'server-only';

import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/constants';
import { createApiExceptionFromPayload, normalizeApiError } from '../api-error';
import type {
  ApiPaginatedResponse,
  ApiResponse,
  PaginatedResult,
} from '@/apis/core/types/api-response';

const API_BASE_URL = process.env.API_BASE_URL;

function getApiBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not defined');
  }
  return API_BASE_URL;
}

async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}

export async function serverApiRequest<TResponse, TBody = unknown>(
  config: AxiosRequestConfig<TBody>,
): Promise<TResponse> {
  try {
    const { meta, headers, ...axiosConfig } = config;
    const requiresAuth = meta?.auth === 'required';
    const accessToken = requiresAuth ? await getAccessToken() : undefined;

    const response = await axios.request<
      ApiResponse<TResponse>,
      AxiosResponse<ApiResponse<TResponse>>,
      TBody
    >({
      ...axiosConfig,
      baseURL: getApiBaseUrl(),
      headers: {
        ...headers,
        Accept: 'application/json',
        ...(accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {}),
      },
    });

    const payload = response.data;

    if (!payload.success) {
      throw createApiExceptionFromPayload(payload.error, response.status);
    }

    return payload.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function serverApiPaginatedRequest<TItem, TBody = unknown>(
  config: AxiosRequestConfig<TBody>,
): Promise<PaginatedResult<TItem>> {
  try {
    const { meta, headers, ...axiosConfig } = config;
    const requiresAuth = meta?.auth === 'required';
    const accessToken = requiresAuth ? await getAccessToken() : undefined;

    const response = await axios.request<
      ApiPaginatedResponse<TItem>,
      AxiosResponse<ApiPaginatedResponse<TItem>>,
      TBody
    >({
      ...axiosConfig,
      baseURL: getApiBaseUrl(),
      headers: {
        ...headers,
        Accept: 'application/json',
        ...(accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {}),
      },
    });

    const payload = response.data;

    if (!payload.success) {
      throw createApiExceptionFromPayload(payload.error, response.status);
    }

    return {
      items: payload.data,
      meta: payload.meta,
    };
  } catch (error) {
    throw normalizeApiError(error);
  }
}
