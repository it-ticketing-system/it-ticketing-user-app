'use client';

import { Button, Table } from '@heroui/react';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { TableContainer } from '@/containers';
import NotificationIcon from '../notification-icon';
import {
  NotificationListEmptyState,
  NotificationListErrorState,
} from './table-states';
import type { NotificationListViewProps } from './types';
import type { TableHeaderOptions } from '@/containers';

type NotificationTableColumnKey =
  'status' | 'title' | 'body' | 'related' | 'time' | 'actions';

const NotificationsDesktopTable = ({
  items,
  meta,
  activeTab,
  error = null,
  isLoading = false,
  isPending = false,
  onClearFilters,
  onNotificationOpen,
  onPageChange,
  onRetry,
}: NotificationListViewProps) => {
  const t = useTranslations('notifications.list');

  const headerCells: Array<TableHeaderOptions<NotificationTableColumnKey>> = [
    {
      id: 'status',
      label: t('columns.status'),
      className: 'w-28',
    },
    {
      id: 'title',
      label: t('columns.title'),
      isRowHeader: true,
      className: 'w-[22%]',
    },
    {
      id: 'body',
      label: t('columns.body'),
      className: 'w-[34%]',
    },
    {
      id: 'related',
      label: t('columns.related'),
      className: 'w-40',
    },
    {
      id: 'time',
      label: t('columns.time'),
      className: 'w-44',
    },
    {
      id: 'actions',
      label: t('columns.actions'),
      className: 'w-20 text-center',
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
          <NotificationListErrorState
            error={error}
            isRetrying={isPending}
            onRetry={onRetry}
          />
        ) : null
      }
      emptyComponent={
        <NotificationListEmptyState
          hasActiveFilter={activeTab !== 'all'}
          onClearFilters={onClearFilters}
        />
      }
      pagination={{
        ...meta,
        isPending,
        onPageChange,
      }}
      paginationLabels={{
        previous: t('pagination.previous'),
        next: t('pagination.next'),
        page: (page) => t('pagination.page', { page }),
        summary: ({ from, to, total }) =>
          t('pagination.summary', { from, to, total }),
      }}
    >
      {(notification) => (
        <Table.Row id={notification.id}>
          <Table.Cell>
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={
                  notification.isRead
                    ? 'size-2 rounded-full bg-neutral-300'
                    : 'bg-accent size-2 rounded-full'
                }
              />
              <NotificationIcon
                type={notification.type}
                isRead={notification.isRead}
              />
            </div>
          </Table.Cell>

          <Table.Cell>
            <span className="text-foreground block truncate font-semibold">
              {notification.title}
            </span>
          </Table.Cell>

          <Table.Cell className="text-muted">
            <span className="block truncate">{notification.body}</span>
          </Table.Cell>

          <Table.Cell>
            {notification.relatedEntity?.ticketNumber ? (
              <span
                dir="ltr"
                className="font-latin bg-primary-50 text-accent inline-flex rounded-md px-2.5 py-1 text-xs font-medium"
              >
                #{notification.relatedEntity.ticketNumber.replace(/^#/, '')}
              </span>
            ) : (
              <span className="text-muted text-caption">
                {t('related.system')}
              </span>
            )}
          </Table.Cell>

          <Table.Cell className="text-muted">
            <span className="block whitespace-nowrap">
              {notification.createdAtLabel}
            </span>
            <span className="text-caption mt-1 block whitespace-nowrap">
              {notification.createdAtRelativeLabel}
            </span>
          </Table.Cell>

          <Table.Cell className="text-center">
            <Button
              isIconOnly
              size="sm"
              variant="outline"
              aria-label={t('actions.openAriaLabel', {
                title: notification.title,
              })}
              onPress={() => onNotificationOpen?.(notification)}
            >
              <ArrowLeft aria-hidden="true" className={ICON_SIZE_CLASS.md} />
            </Button>
          </Table.Cell>
        </Table.Row>
      )}
    </TableContainer>
  );
};

export default NotificationsDesktopTable;
