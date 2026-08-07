import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { ITicket, ITicketMessage, TicketStatus } from '@/models';

export interface GetMyTicketsRequest {
  page?: number;
  perPage?: number;
  status?: TicketStatus;
  search?: string;
  departmentId?: number;
  from?: string;
  to?: string;
}

export type GetMyTicketsResponse = PaginatedResult<ITicket>;

export interface CreateTicketRequest {
  title: string;
  departmentId: number;
  initialMessage: string;
  fileIds: number[];
}

export interface CreateTicketResult {
  id: string;
  ticketNumber: string;
  title: string;
}

export interface GetTicketDetailsResponse {
  ticket: ITicket;
  messages: ITicketMessage[];
}

export interface SendTicketMessageRequest {
  body: string;
  fileIds: number[];
}

export type SendTicketMessageResult = ITicketMessage;
