export const ROUTES = {
  home: '/',
  login: '/app/login',
  register: '/app/register',
  app: '/app',
  offline: '/app/offline',
  tickets: '/app/tickets',
  createTicket: '/app/tickets/create',
  ticketDetails: (ticketId: string) =>
    `/app/tickets/${encodeURIComponent(ticketId)}`,
  notifications: '/app/notifications',
  profile: '/app/profile',
} as const;
