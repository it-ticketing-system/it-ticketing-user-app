'use client';

import { Button, Card } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';
import { TablePagination, TablePaginationFallback } from '@/containers';
import NotificationIcon from '../notification-icon';
import {
  NotificationListEmptyState,
  NotificationListErrorState,
} from '../notification-list/table-states';
import { MobileNotificationCardSkeleton } from '../skeleton/mobile-notifications-list-skeleton';
import type { NotificationListViewProps } from '../notification-list/types';

const MobileNotificationsList = ({
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

  if (isLoading) {
    return (
      <div aria-hidden="true" className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <MobileNotificationCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <NotificationListErrorState
        error={error}
        isRetrying={isPending}
        onRetry={onRetry}
        className="border-border bg-surface rounded-xl border shadow-sm"
      />
    );
  }

  if (items.length === 0) {
    return (
      <NotificationListEmptyState
        hasActiveFilter={activeTab !== 'all'}
        onClearFilters={onClearFilters}
        className="border-border bg-surface rounded-xl border shadow-sm"
      />
    );
  }

  return (
    <div className="space-y-3">
      <div role="list" className="space-y-3">
        {items.map((notification) => (
          <div key={notification.id} role="listitem">
            <Card
              variant="transparent"
              className={
                notification.isRead
                  ? 'border-border bg-surface min-h-24 rounded-xl border shadow-sm'
                  : 'border-primary-100 bg-primary-50 min-h-24 rounded-xl border shadow-sm'
              }
            >
              <Card.Content className="p-4">
                <div className="flex items-start gap-3">
                  <NotificationIcon
                    type={notification.type}
                    isRead={notification.isRead}
                  />

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-start gap-2">
                      <h2 className="text-body-sm text-foreground min-w-0 flex-1 font-semibold">
                        {notification.title}
                      </h2>
                      {!notification.isRead ? (
                        <span
                          aria-hidden="true"
                          className="bg-accent mt-1.5 size-2 shrink-0 rounded-full"
                        />
                      ) : null}
                    </div>

                    <p className="text-body-sm text-muted line-clamp-2">
                      {notification.body}
                    </p>

                    <div className="text-caption text-muted flex items-center justify-between gap-3 pt-1">
                      <span>{notification.createdAtRelativeLabel}</span>

                      {notification.relatedEntity?.ticketNumber ? (
                        <span dir="ltr" className="font-latin text-accent">
                          #{notification.relatedEntity.ticketNumber.replace(
                            /^#/,
                            '',
                          )}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <Button
                  fullWidth
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="mt-3 h-9"
                  aria-label={t('actions.openAriaLabel', {
                    title: notification.title,
                  })}
                  onPress={() => onNotificationOpen?.(notification)}
                >
                  {t('actions.open')}
                </Button>
              </Card.Content>
            </Card>
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
                page: (page) => t('pagination.page', { page }),
                summary: ({ from, to, total }) =>
                  t('pagination.summary', { from, to, total }),
              }}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
};

export default MobileNotificationsList;
