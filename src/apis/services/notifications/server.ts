import {
  serverApiPaginatedRequest,
  serverApiRequest,
} from '@/apis/core/server/api-request';
import { createNotificationServices } from './_services';

export const serverNotificationServices = createNotificationServices(
  serverApiRequest,
  serverApiPaginatedRequest,
);
