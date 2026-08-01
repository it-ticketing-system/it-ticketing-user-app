'use client';

import { Card } from '@heroui/react';
import { ArrowLeft, Clock3 } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';
import { TicketStatusChip } from '@/components/shared';
import {
  TablePagination,
  TablePaginationFallback,
} from '@/containers/table-container';
import { MobileTicketCardSkeleton } from '../skeleton/mobile-tickets-list-skeleton';
import {
  TicketsTableEmptyState,
  TicketsTableErrorState,
} from '../ticket-table/table-states';
import type { TicketsTableViewProps } from '../ticket-table/types';

const MobileTicketsList = ({
  items,
  meta,
  error = null,
  isLoading = false,
  isPending = false,
  onPageChange,
  onRetry,
}: TicketsTableViewProps) => {
  const t = useTranslations('tickets.table');

  if (isLoading) {
    return (
      <div aria-hidden="true" className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <MobileTicketCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <TicketsTableErrorState
        error={error}
        isRetrying={isPending}
        onRetry={onRetry}
        className="border-border bg-surface rounded-xl border shadow-sm"
      />
    );
  }

  if (items.length === 0) {
    return (
      <TicketsTableEmptyState className="border-border bg-surface rounded-xl border shadow-sm" />
    );
  }

  return (
    <div className="space-y-3">
      <div role="list" aria-label={t('ariaLabel')} className="space-y-3">
        {items.map((ticket) => (
          <div key={ticket.id} role="listitem">
            <Link
              href={ticket.detailsHref}
              className="group focus-visible:ring-focus block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              <Card
                variant="transparent"
                className="border-border bg-surface min-h-34 gap-0 overflow-hidden rounded-xl border p-0 shadow-sm transition duration-150 hover:-translate-y-px hover:shadow-md"
              >
                <Card.Header className="flex-row items-start justify-between gap-4 p-4 pb-0">
                  <span
                    dir="ltr"
                    className="font-latin text-caption text-muted font-medium whitespace-nowrap"
                  >
                    {ticket.ticketNumber}
                  </span>

                  <TicketStatusChip
                    status={ticket.status}
                    label={t(`statuses.${ticket.status}`)}
                  />
                </Card.Header>

                <Card.Content className="space-y-1 px-4 py-3">
                  <h3 className="text-body text-foreground line-clamp-2 font-semibold">
                    {ticket.title}
                  </h3>

                  <p className="text-caption text-muted truncate">
                    {ticket.departmentName}
                  </p>
                </Card.Content>

                <Card.Footer className="border-separator mt-auto flex-row items-center justify-between border-t px-4 py-3">
                  <div className="text-caption text-muted flex min-w-0 items-center gap-1.5">
                    <Clock3 aria-hidden="true" className="size-3.5 shrink-0" />

                    <span className="truncate">{ticket.lastUpdatedLabel}</span>
                  </div>

                  <div className="text-body-sm text-accent flex shrink-0 items-center gap-1 font-medium">
                    <span>{t('actions.details')}</span>

                    <ArrowLeft
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover:-translate-x-0.5"
                    />
                  </div>
                </Card.Footer>
              </Card>
            </Link>
          </div>
        ))}
      </div>

      {meta.total > 0 && (
        <div className="border-border bg-surface rounded-xl border px-4 py-3 shadow-sm">
          <Suspense fallback={<TablePaginationFallback />}>
            <TablePagination
              {...meta}
              isPending={isPending}
              onPageChange={onPageChange}
              labels={{
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
            />
          </Suspense>
        </div>
      )}
    </div>
  );
};

export default MobileTicketsList;
