export const TICKET_ENDPOINTS = {
  myTickets: '/user/tickets',
  createTicket: '/user/tickets',
  ticketDetails: (ticketId: string) => `/user/tickets/${ticketId}`,
  ticketMessages: (ticketId: string) => `/user/tickets/${ticketId}/messages`,
} as const;
