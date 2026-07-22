import { PaginatedResult } from './api-response';
import type { AxiosRequestConfig } from 'axios';

export type ApiRequestFunction = <TResponse, TBody = unknown>(
  config: AxiosRequestConfig<TBody>,
) => Promise<TResponse>;

export type ApiPaginatedRequestFunction = <TItem, TBody = unknown>(
  config: AxiosRequestConfig<TBody>,
) => Promise<PaginatedResult<TItem>>;
