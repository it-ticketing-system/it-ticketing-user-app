export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  app: '/app',
  tickets: '/app/tickets',
  createTicket: '/app/tickets/create',
  ticketDetails: (ticketId: string) =>
    `/app/tickets/${encodeURIComponent(ticketId)}`,
  notifications: '/app/notifications',
  profile: '/app/profile',
} as const;
