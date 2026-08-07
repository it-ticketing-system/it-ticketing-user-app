import type { IUploadedFile } from './file';

export type TicketStatus =
  'open' | 'inProgress' | 'waitingUser' | 'resolved' | 'closed';
type TicketMessageType = 'user' | 'support' | 'system';
export type TicketSystemMessageTone = 'info' | 'warning' | 'neutral';

export interface ITicketMessage {
  id: string;
  type: TicketMessageType;
  senderName?: string;
  senderAvatarUrl?: string;
  body: string;
  createdAtLabel: string;
  attachments?: IUploadedFile[];
  systemTone?: TicketSystemMessageTone;
}

export interface ITicket {
  id: string;
  ticketNumber: string;
  title: string;
  departmentName: string;
  status: TicketStatus;
  lastUpdatedLabel: string;
  detailsHref: string;
  createdAtLabel?: string;
}
