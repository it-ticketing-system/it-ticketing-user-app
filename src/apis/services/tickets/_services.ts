import {
  ApiPaginatedRequestFunction,
  ApiRequestFunction,
} from '@/apis/core/types/api-request.types';
import {
  type CreateTicketRequestDto,
  type CreateTicketResponseDto,
  type GetMyTicketsRequestDto,
  type SendTicketMessageRequestDto,
  type SendTicketMessageResponseDto,
  type UserTicketDetailsDto,
  type UserTicketListItemDto,
} from './_dto';
import { TICKET_ENDPOINTS } from './_endpoints';
import {
  toCreateTicketRequestDto,
  toGetMyTicketsRequestDto,
  toSendTicketMessageRequestDto,
  toTicket,
  toTicketListItem,
  toTicketMessage,
} from './_mappers';
import type {
  CreateTicketRequest,
  CreateTicketResult,
  GetMyTicketsRequest,
  GetMyTicketsResponse,
  GetTicketDetailsResponse,
  SendTicketMessageRequest,
  SendTicketMessageResult,
} from './_types';

export function createTicketServices(
  request: ApiRequestFunction,
  paginatedRequest: ApiPaginatedRequestFunction,
) {
  async function getMyTickets(
    params: GetMyTicketsRequest,
    signal?: AbortSignal,
  ): Promise<GetMyTicketsResponse> {
    const response = await paginatedRequest<
      UserTicketListItemDto,
      GetMyTicketsRequestDto
    >({
      url: TICKET_ENDPOINTS.myTickets,
      method: 'GET',
      params: toGetMyTicketsRequestDto(params),
      signal,
      meta: {
        auth: 'required',
      },
    });

    return {
      items: response.items.map(toTicketListItem),
      meta: response.meta,
    };
  }

  async function createTicket(
    payload: CreateTicketRequest,
  ): Promise<CreateTicketResult> {
    const response = await request<
      CreateTicketResponseDto,
      CreateTicketRequestDto
    >({
      url: TICKET_ENDPOINTS.createTicket,
      method: 'POST',
      data: toCreateTicketRequestDto(payload),
      meta: {
        auth: 'required',
      },
    });

    return {
      id: String(response.ticket.id),
      ticketNumber: response.ticket.ticketNumber,
      title: response.ticket.title,
    };
  }

  async function getTicketDetails(
    ticketId: string,
  ): Promise<GetTicketDetailsResponse> {
    const response = await request<UserTicketDetailsDto>({
      url: TICKET_ENDPOINTS.ticketDetails(ticketId),
      method: 'GET',
      meta: {
        auth: 'required',
      },
    });

    return {
      ticket: toTicket(response),
      messages: response.messages.map(toTicketMessage),
    };
  }

  async function sendTicketMessage(
    ticketId: string,
    payload: SendTicketMessageRequest,
  ): Promise<SendTicketMessageResult> {
    const response = await request<
      SendTicketMessageResponseDto,
      SendTicketMessageRequestDto
    >({
      url: TICKET_ENDPOINTS.ticketMessages(ticketId),
      method: 'POST',
      data: toSendTicketMessageRequestDto(payload),
      meta: {
        auth: 'required',
      },
    });

    return toTicketMessage(response);
  }

  return {
    getMyTickets,
    createTicket,
    getTicketDetails,
    sendTicketMessage,
  };
}
