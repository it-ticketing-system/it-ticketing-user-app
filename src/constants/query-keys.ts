const TICKET_LISTS_QUERY_KEY = ['tickets', 'list'] as const;
const NOTIFICATIONS_QUERY_KEY = ['notifications'] as const;
const NOTIFICATION_LISTS_QUERY_KEY = ['notifications', 'list'] as const;

export const QUERY_KEYS = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  lookups: {
    departments: ['lookups', 'departments'] as const,
  },
  tickets: {
    lists: TICKET_LISTS_QUERY_KEY,
    list: (params: {
      page: number;
      perPage: number;
      search?: string;
      status?: string;
      departmentId?: number;
      from?: string;
      to?: string;
    }) => [...TICKET_LISTS_QUERY_KEY, params] as const,
    details: (ticketId: string) => ['tickets', 'details', ticketId] as const,
  },
  notifications: {
    root: NOTIFICATIONS_QUERY_KEY,
    lists: NOTIFICATION_LISTS_QUERY_KEY,
    list: (params: { page: number; perPage: number; tab?: string }) =>
      [...NOTIFICATION_LISTS_QUERY_KEY, params] as const,
    unreadCount: [...NOTIFICATIONS_QUERY_KEY, 'unread-count'] as const,
  },
} as const;
