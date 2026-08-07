'use client';

import { clientLookupServices } from '@/apis/services/lookups/client';
import { clientTicketServices } from '@/apis/services/tickets/client';
import { QUERY_KEYS } from '@/constants';
import { useGetRequest, useQueryState } from '@/hooks';
import { getPatchValue } from '@/utils';
import MyTicketsFilters from './ticket-filters';
import {
  type TicketFiltersPatch,
  type TicketFiltersValue,
} from './ticket-filters/ticket-filters.shared';
import { TicketsTable, type TicketTableData } from './ticket-table';
import {
  areTicketFiltersEqual,
  createMyTicketsParams,
  FILTER_QUERY_KEYS,
  parseTicketFilters,
} from './tickets-query';
import type { ApiRequestError } from '@/apis/core/api-error';
import type { IDepartmentLookup } from '@/models';

type TicketsClientProps = {
  initialDepartments: IDepartmentLookup[];
  initialFilters: TicketFiltersValue & { page: number };
  initialTickets: TicketTableData;
  initialTicketsError: ApiRequestError | null;
};

const TicketsClient = ({
  initialDepartments,
  initialFilters,
  initialTickets,
  initialTicketsError,
}: TicketsClientProps) => {
  const { getQuery, setQuery, updateQueries, removeQueries } = useQueryState();

  const filters = parseTicketFilters({
    search: getQuery('search') ?? undefined,
    status: getQuery('status') ?? undefined,
    department: getQuery('department') ?? undefined,
    from: getQuery('from') ?? undefined,
    to: getQuery('to') ?? undefined,
    page: getQuery('page') ?? undefined,
  });

  const ticketsParams = createMyTicketsParams(filters);

  const departmentsQuery = useGetRequest({
    queryKey: QUERY_KEYS.lookups.departments,
    requestFn: async (signal) => clientLookupServices.getDepartments(signal),
    initialData: initialDepartments,
    showErrorToast: false,
    staleTime: 5 * 60_000,
  });

  const ticketsQuery = useGetRequest({
    queryKey: QUERY_KEYS.tickets.list(ticketsParams),
    requestFn: async (signal) =>
      clientTicketServices.getMyTickets(ticketsParams, signal),
    initialData: () =>
      areTicketFiltersEqual(filters, initialFilters)
        ? initialTickets
        : undefined,
    keepPreviousData: true,
    showErrorToast: false,
    staleTime: 30_000,
  });

  const ticketsError =
    ticketsQuery.error ??
    (initialTicketsError &&
    areTicketFiltersEqual(filters, initialFilters) &&
    !ticketsQuery.isFetched
      ? initialTicketsError
      : null);

  const filterValue: TicketFiltersValue = {
    search: filters.search,
    status: filters.status,
    department: filters.department,
    from: filters.from,
    to: filters.to,
  };

  const changeFilters = (patch: TicketFiltersPatch) => {
    const nextSearch = getPatchValue(patch, 'search');
    const nextStatus = getPatchValue(patch, 'status');
    const nextDepartment = getPatchValue(patch, 'department');
    const nextFrom = getPatchValue(patch, 'from');
    const nextTo = getPatchValue(patch, 'to');
    const hasChange =
      (nextSearch !== undefined && nextSearch !== filters.search) ||
      (nextStatus !== undefined && nextStatus !== filters.status) ||
      (nextDepartment !== undefined && nextDepartment !== filters.department) ||
      (nextFrom !== undefined && nextFrom !== filters.from) ||
      (nextTo !== undefined && nextTo !== filters.to);

    if (!hasChange && filters.page === 1) {
      return;
    }

    updateQueries(patch, {
      clear: ['page'],
      history: 'replace',
      scroll: false,
      strategy: 'native',
    });
  };

  const resetFilters = () => {
    if (
      !filters.search &&
      !filters.status &&
      !filters.department &&
      !filters.from &&
      !filters.to &&
      filters.page === 1
    ) {
      return;
    }

    removeQueries(FILTER_QUERY_KEYS, {
      history: 'replace',
      scroll: false,
      strategy: 'native',
    });
  };

  const changePage = (nextPage: number) => {
    setQuery('page', nextPage === 1 ? null : nextPage, {
      history: 'push',
      scroll: false,
      strategy: 'native',
    });
  };

  const retry = () => {
    void ticketsQuery.refetch();
  };

  return (
    <TicketsTable
      data={ticketsQuery.data ?? initialTickets}
      error={ticketsError}
      isLoading={ticketsQuery.isLoading}
      isPending={ticketsQuery.isFetching}
      onPageChange={changePage}
      onRetry={retry}
      topContent={
        <MyTicketsFilters
          departments={departmentsQuery.data ?? []}
          value={filterValue}
          isPending={ticketsQuery.isFetching || departmentsQuery.isFetching}
          onChange={changeFilters}
          onReset={resetFilters}
        />
      }
    />
  );
};

export default TicketsClient;
