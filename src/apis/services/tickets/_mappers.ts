import { ROUTES } from '@/constants';
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
import type {
  ITicket,
  ITicketMessage,
  TicketStatus,
} from '@/models';

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

const timeFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Tehran',
});

const dateTimeFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Tehran',
});

const relativeFormatter = new Intl.RelativeTimeFormat('fa-IR', {
  numeric: 'auto',
});

const toDayStart = (date: Date): number => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).getTime();
};

const formatLastUpdatedLabel = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const now = new Date();
  const dayDiff = Math.round(
    (toDayStart(date) - toDayStart(now)) / (24 * 60 * 60 * 1000),
  );
  const timeLabel = timeFormatter.format(date);

  return `${relativeFormatter.format(dayDiff, 'day')}\u060C ${timeLabel}`;
};

const formatDateTimeLabel = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return dateTimeFormatter.format(date);
};

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
  lastUpdatedLabel: formatLastUpdatedLabel(ticket.lastUpdatedAt),
  detailsHref: `${ROUTES.tickets}/${ticket.id}`,
});

export const toTicket = (ticket: UserTicketDetailsDto): ITicket => ({
  id: String(ticket.id),
  ticketNumber: ticket.ticketNumber,
  title: ticket.title,
  departmentName: ticket.department.name,
  status: TICKET_STATUS_MAP[ticket.status],
  createdAtLabel: formatDateTimeLabel(ticket.createdAt),
  lastUpdatedLabel: formatLastUpdatedLabel(ticket.updatedAt),
  detailsHref: `${ROUTES.tickets}/${ticket.id}`,
});

export const toTicketMessage = (
  message: UserTicketMessageDto,
): ITicketMessage => {
  const isUser = message.sender.role === 'USER';

  return {
    id: String(message.id),
    type: isUser ? 'user' : 'support',
    senderName: message.sender.name,
    senderAvatarUrl: message.sender.profileImageUrl ?? undefined,
    body: message.body,
    createdAtLabel: formatDateTimeLabel(message.createdAt),
    attachments: message.files.map((file) => ({
      id: file.id,
      name: file.originalName,
      size: file.size ?? 0,
      href: file.url,
      mimeType: file.mimeType ?? '',
      createdAt: message.createdAt,
    })),
  };
};
