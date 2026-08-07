import type { ITicket, ITicketMessage } from '@/models';

export type TicketDetails = ITicket;

export type TicketMessage = ITicketMessage;

export interface TicketDetailsInitialData {
  ticket: TicketDetails;
  messages: TicketMessage[];
}

export interface TicketDetailsModuleProps {
  ticketId: string;
  initialData: TicketDetailsInitialData;
}
