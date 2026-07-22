'use client';

import axios from 'axios';
import { ROUTES } from '@/constants';
import { normalizeApiError } from '../api-error';

export const clientApiClient = axios.create({
  baseURL: '/api/backend',
  timeout: 20_000,
  headers: {
    Accept: 'application/json',
  },
});

let isRedirectingToLogin = false;

clientApiClient.interceptors.response.use(
  (response) => response,

  (error: unknown) => {
    const apiError = normalizeApiError(error);
    const config = axios.isAxiosError(error) ? error.config : undefined;
    const requiresAuth = config?.meta?.auth === 'required';

    const shouldRedirect =
      apiError.status === 401 &&
      requiresAuth &&
      !config?.meta?.skipUnauthorizedRedirect;

    if (shouldRedirect && !isRedirectingToLogin) {
      isRedirectingToLogin = true;

      if (
        typeof window !== 'undefined' &&
        window.location.pathname !== ROUTES.login
      ) {
        window.location.replace(ROUTES.login);
      }
    }

    return Promise.reject(apiError);
  },
);
