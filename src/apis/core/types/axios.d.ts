import 'axios';

export interface ApiRequestMeta {
  auth?: 'required' | 'none';
  skipUnauthorizedRedirect?: boolean;
}

declare module 'axios' {
  interface AxiosRequestConfig<_D = unknown> {
    meta?: ApiRequestMeta;
  }

  interface InternalAxiosRequestConfig<_D = unknown> {
    meta?: ApiRequestMeta;
  }
}

export {};
