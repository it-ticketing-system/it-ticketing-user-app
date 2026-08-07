import { ROUTES } from '@/constants';
import {
  formatPersianDateTime,
  formatPersianRelativeDateTime,
  toBackendProxyHref,
} from '@/utils';
import type {
  CreateTicketRequestDto,
  GetMyTicketsRequestDto,
  SendTicketMessageRequestDto,
  UserTicketDetailsDto,
  UserTicketListItemDto,
  UserTicketMessageDto,
  UserTicketStatusDto,
} from './_dto';
import type {
  CreateTicketRequest,
  GetMyTicketsRequest,
  SendTicketMessageRequest,
} from './_types';
import type { ITicket, ITicketMessage, TicketStatus } from '@/models';

const TICKET_STATUS_MAP = {
  OPEN: 'open',
  IN_PROGRESS: 'inProgress',
  WAITING_FOR_USER: 'waitingUser',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const satisfies Record<UserTicketStatusDto, TicketStatus>;

const TICKET_STATUS_DTO_MAP = {
  open: 'OPEN',
  inProgress: 'IN_PROGRESS',
  waitingUser: 'WAITING_FOR_USER',
  resolved: 'RESOLVED',
  closed: 'CLOSED',
} as const satisfies Record<TicketStatus, UserTicketStatusDto>;

export const toGetMyTicketsRequestDto = (
  params: GetMyTicketsRequest,
): GetMyTicketsRequestDto => ({
  ...params,
  status: params.status ? TICKET_STATUS_DTO_MAP[params.status] : undefined,
});

export const toCreateTicketRequestDto = (
  payload: CreateTicketRequest,
): CreateTicketRequestDto => ({
  title: payload.title,
  departmentId: payload.departmentId,
  initialMessage: payload.initialMessage,
  fileIds: payload.fileIds,
});

export const toSendTicketMessageRequestDto = (
  payload: SendTicketMessageRequest,
): SendTicketMessageRequestDto => ({
  body: payload.body,
  fileIds: payload.fileIds,
});

export const toTicketListItem = (ticket: UserTicketListItemDto): ITicket => ({
  id: String(ticket.id),
  ticketNumber: ticket.ticketNumber,
  title: ticket.title,
  departmentName: ticket.department.name,
  status: TICKET_STATUS_MAP[ticket.status],
  lastUpdatedLabel: formatPersianRelativeDateTime(ticket.lastUpdatedAt),
  detailsHref: ROUTES.ticketDetails(String(ticket.id)),
});

export const toTicket = (ticket: UserTicketDetailsDto): ITicket => ({
  id: String(ticket.id),
  ticketNumber: ticket.ticketNumber,
  title: ticket.title,
  departmentName: ticket.department.name,
  status: TICKET_STATUS_MAP[ticket.status],
  createdAtLabel: formatPersianDateTime(ticket.createdAt),
  lastUpdatedLabel: formatPersianRelativeDateTime(ticket.updatedAt),
  detailsHref: ROUTES.ticketDetails(String(ticket.id)),
});

export const toTicketMessage = (
  message: UserTicketMessageDto,
): ITicketMessage => {
  const isUser = message.sender.role === 'USER';

  return {
    id: String(message.id),
    type: isUser ? 'user' : 'support',
    senderName: message.sender.name,
    senderAvatarUrl: message.sender.profileImageUrl
      ? toBackendProxyHref(message.sender.profileImageUrl)
      : undefined,
    body: message.body,
    createdAtLabel: formatPersianDateTime(message.createdAt),
    attachments: message.files.map((file) => ({
      id: file.id,
      name: file.originalName,
      size: file.size ?? 0,
      href: toBackendProxyHref(file.url),
      mimeType: file.mimeType ?? '',
      createdAt: message.createdAt,
    })),
  };
};
