'use client';

import { Button, Table } from '@heroui/react';
import { Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { TicketStatusChip } from '@/components/shared';
import { TableContainer } from '@/containers/table-container';
import { TicketsTableEmptyState, TicketsTableErrorState } from './table-states';
import type { TicketsTableViewProps } from './types';
import type { TableHeaderOptions } from '@/containers/table-container';

type TicketTableColumnKey =
  | 'ticketNumber'
  | 'title'
  | 'department'
  | 'status'
  | 'lastUpdated'
  | 'actions';

const TicketsDesktopTable = ({
  items,
  meta,
  error = null,
  isLoading = false,
  isPending = false,
  onPageChange,
  onRetry,
}: TicketsTableViewProps) => {
  const t = useTranslations('tickets.table');
  const router = useRouter();

  const headerCells: Array<TableHeaderOptions<TicketTableColumnKey>> = [
    {
      id: 'ticketNumber',
      label: t('columns.ticketNumber'),
      isRowHeader: true,
      className: 'w-[150px]',
    },
    {
      id: 'title',
      label: t('columns.title'),
      className: 'w-[34%]',
    },
    {
      id: 'department',
      label: t('columns.department'),
      className: 'w-[180px]',
    },
    {
      id: 'status',
      label: t('columns.status'),
      className: 'w-[160px]',
    },
    {
      id: 'lastUpdated',
      label: t('columns.lastUpdated'),
      className: 'w-[190px]',
    },
    {
      id: 'actions',
      label: t('columns.actions'),
      className: 'w-24 text-center',
    },
  ];

  return (
    <TableContainer
      ariaLabel={t('ariaLabel')}
      headerCells={headerCells}
      isLoading={isLoading}
      loadingLabel={t('loading')}
      items={items}
      errorComponent={
        error ? (
          <TicketsTableErrorState
            error={error}
            isRetrying={isPending}
            onRetry={onRetry}
          />
        ) : null
      }
      emptyComponent={<TicketsTableEmptyState />}
      pagination={{
        ...meta,
        isPending,
        onPageChange,
      }}
      paginationLabels={{
        previous: t('pagination.previous'),
        next: t('pagination.next'),
        page: (page) =>
          t('pagination.page', {
            page,
          }),
        summary: ({ from, to, total }) =>
          t('pagination.summary', {
            from,
            to,
            total,
          }),
      }}
    >
      {(ticket) => (
        <Table.Row id={ticket.id}>
          <Table.Cell>
            <span
              dir="ltr"
              className="font-latin text-foreground inline-block font-medium whitespace-nowrap"
            >
              {ticket.ticketNumber}
            </span>
          </Table.Cell>

          <Table.Cell>
            <span className="text-foreground block truncate font-medium">
              {ticket.title}
            </span>
          </Table.Cell>

          <Table.Cell className="text-muted">
            <span className="block truncate">{ticket.departmentName}</span>
          </Table.Cell>

          <Table.Cell>
            <TicketStatusChip
              status={ticket.status}
              label={t(`statuses.${ticket.status}`)}
            />
          </Table.Cell>

          <Table.Cell className="text-muted">
            <span className="whitespace-nowrap">{ticket.lastUpdatedLabel}</span>
          </Table.Cell>

          <Table.Cell className="text-center">
            <Button
              isIconOnly
              size="sm"
              variant="outline"
              aria-label={t('actions.viewAriaLabel', {
                number: ticket.ticketNumber,
              })}
              onPress={() => router.push(ticket.detailsHref)}
              className="[&>svg]:!size-[18px]"
            >
              <Eye aria-hidden="true" />
            </Button>
          </Table.Cell>
        </Table.Row>
      )}
    </TableContainer>
  );
};

export default TicketsDesktopTable;
