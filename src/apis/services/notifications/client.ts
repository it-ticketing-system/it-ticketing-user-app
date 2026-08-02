'use client';

import {
  clientApiPaginatedRequest,
  clientApiRequest,
} from '@/apis/core/client/api-request';
import { createNotificationServices } from './_services';

export const clientNotificationServices = createNotificationServices(
  clientApiRequest,
  clientApiPaginatedRequest,
);

export type {
  GetNotificationsRequest,
  GetNotificationsResponse,
  MarkAllNotificationsReadResult,
  MarkNotificationReadResult,
} from './_types';
