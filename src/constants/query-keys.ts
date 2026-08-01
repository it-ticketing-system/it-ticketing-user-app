const TICKET_LISTS_QUERY_KEY = ['tickets', 'list'] as const;

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
} as const;
