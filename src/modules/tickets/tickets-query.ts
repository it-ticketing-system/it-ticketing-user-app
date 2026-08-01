import { PAGE_SIZE } from '@/constants';
import { getSearchParamValue, toPositiveInteger } from '@/utils';
import type { TicketFiltersValue } from './ticket-filters/ticket-filters.shared';
import type { TicketTableData } from './ticket-table';
import type { GetMyTicketsRequest } from '@/apis/services/tickets/client';
import type { TicketStatus } from '@/models';

const TICKET_STATUS_VALUES = [
  'open',
  'inProgress',
  'waitingUser',
  'resolved',
  'closed',
] as const satisfies readonly TicketStatus[];

export const FILTER_QUERY_KEYS = [
  'search',
  'status',
  'department',
  'from',
  'to',
  'page',
] as const;

export type TicketsSearchParams = Record<string, string | string[] | undefined>;

const isTicketStatus = (value: string): value is TicketStatus => {
  return TICKET_STATUS_VALUES.includes(value as TicketStatus);
};

export const parseTicketFilters = (
  searchParams: TicketsSearchParams,
): TicketFiltersValue & { page: number } => {
  const status = getSearchParamValue(searchParams, 'status');

  return {
    search: getSearchParamValue(searchParams, 'search'),
    status: isTicketStatus(status) ? status : '',
    department: getSearchParamValue(searchParams, 'department'),
    from: getSearchParamValue(searchParams, 'from'),
    to: getSearchParamValue(searchParams, 'to'),
    page: toPositiveInteger(getSearchParamValue(searchParams, 'page')) ?? 1,
  };
};

export const createMyTicketsParams = (
  filters: TicketFiltersValue & { page: number },
): Required<Pick<GetMyTicketsRequest, 'page' | 'perPage'>> &
  Omit<GetMyTicketsRequest, 'page' | 'perPage'> => {
  const departmentId = toPositiveInteger(filters.department);
  const status = isTicketStatus(filters.status) ? filters.status : undefined;

  return {
    page: filters.page,
    perPage: PAGE_SIZE,
    search: filters.search.trim() || undefined,
    status,
    departmentId,
    from: filters.from || undefined,
    to: filters.to || undefined,
  };
};

export const createEmptyTickets = (page: number): TicketTableData => ({
  items: [],
  meta: {
    page,
    perPage: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  },
});

export const areTicketFiltersEqual = (
  first: TicketFiltersValue & { page: number },
  second: TicketFiltersValue & { page: number },
): boolean => {
  return (
    first.search === second.search &&
    first.status === second.status &&
    first.department === second.department &&
    first.from === second.from &&
    first.to === second.to &&
    first.page === second.page
  );
};
