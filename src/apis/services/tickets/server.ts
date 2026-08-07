import {
  serverApiPaginatedRequest,
  serverApiRequest,
} from '@/apis/core/server/api-request';
import { createTicketServices } from './_services';

export const serverTicketServices = createTicketServices(
  serverApiRequest,
  serverApiPaginatedRequest,
);
