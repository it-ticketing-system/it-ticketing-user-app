import 'server-only';

import { toApiRequestError, type ApiRequestError } from '@/apis/core/api-error';
import { serverLookupServices } from '@/apis/services/lookups/server';
import { serverTicketServices } from '@/apis/services/tickets/server';
import {
  createEmptyTickets,
  createMyTicketsParams,
  parseTicketFilters,
  type TicketsSearchParams,
} from './tickets-query';
import type { TicketTableData } from './ticket-table';
import type { IDepartmentLookup } from '@/models';

type TicketsInitialData = {
  initialDepartments: IDepartmentLookup[];
  initialFilters: ReturnType<typeof parseTicketFilters>;
  initialTickets: TicketTableData;
  initialTicketsError: ApiRequestError | null;
};

export const getTicketsInitialData = async (
  searchParams: TicketsSearchParams,
): Promise<TicketsInitialData> => {
  const initialFilters = parseTicketFilters(searchParams);
  const ticketsParams = createMyTicketsParams(initialFilters);

  const [departmentsResult, ticketsResult] = await Promise.allSettled([
    serverLookupServices.getDepartments(),
    serverTicketServices.getMyTickets(ticketsParams),
  ]);

  const initialDepartments: IDepartmentLookup[] =
    departmentsResult.status === 'fulfilled' ? departmentsResult.value : [];
  const initialTickets: TicketTableData =
    ticketsResult.status === 'fulfilled'
      ? ticketsResult.value
      : createEmptyTickets(initialFilters.page);
  const initialTicketsError =
    ticketsResult.status === 'rejected'
      ? toApiRequestError(ticketsResult.reason)
      : null;

  return {
    initialDepartments,
    initialFilters,
    initialTickets,
    initialTicketsError,
  };
};
