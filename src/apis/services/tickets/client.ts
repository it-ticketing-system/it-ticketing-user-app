'use client';

import {
  clientApiPaginatedRequest,
  clientApiRequest,
} from '@/apis/core/client/api-request';
import { createTicketServices } from './_services';

export const clientTicketServices = createTicketServices(
  clientApiRequest,
  clientApiPaginatedRequest,
);

export type {
  CreateTicketRequest,
  CreateTicketResult,
  GetMyTicketsRequest,
  SendTicketMessageRequest,
  SendTicketMessageResult,
} from './_types';
