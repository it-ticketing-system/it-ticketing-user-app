'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { clientNotificationServices } from '@/apis/services/notifications/client';
import { QUERY_KEYS } from '@/constants';
import {
  useGetRequest,
  usePostRequest,
  useQueryState,
  useUnreadNotificationsCount,
} from '@/hooks';
import NotificationFilters from './notification-filters';
import {
  NotificationsList,
  type NotificationListData,
  type NotificationListItem,
} from './notification-list';
import {
  areNotificationFiltersEqual,
  createNotificationsParams,
  NOTIFICATION_FILTER_QUERY_KEYS,
  parseNotificationFilters,
} from './notifications-query';
import type { NotificationFiltersValue } from './notifications-query';
import type { ApiRequestError } from '@/apis/core/api-error';
import type { NotificationTab } from '@/models';

type NotificationsClientProps = {
  initialFilters: NotificationFiltersValue;
  initialNotifications: NotificationListData;
  initialNotificationsError: ApiRequestError | null;
};

const NotificationsClient = ({
  initialFilters,
  initialNotifications,
  initialNotificationsError,
}: NotificationsClientProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { getQuery, setQuery, updateQueries, removeQueries } = useQueryState();
  const unreadNotificationsCount = useUnreadNotificationsCount();

  const filters = parseNotificationFilters({
    tab: getQuery('tab') ?? undefined,
    page: getQuery('page') ?? undefined,
  });

  const notificationsParams = createNotificationsParams(filters);

  const notificationsQuery = useGetRequest({
    queryKey: QUERY_KEYS.notifications.list(notificationsParams),
    requestFn: async (signal) =>
      clientNotificationServices.getNotifications(notificationsParams, signal),
    initialData: () =>
      areNotificationFiltersEqual(filters, initialFilters)
        ? initialNotifications
        : undefined,
    keepPreviousData: true,
    showErrorToast: false,
    staleTime: 30_000,
  });

  const markReadMutation = usePostRequest<string, { id: string }>({
    requestFn: async (notificationId) =>
      clientNotificationServices.markNotificationAsRead(notificationId),
    showSuccessToast: false,
    showErrorToast: false,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.notifications.root,
      });
    },
  });

  const markAllReadMutation = usePostRequest({
    requestFn: clientNotificationServices.markAllNotificationsAsRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.notifications.root,
      });
    },
  });

  const notificationsError =
    notificationsQuery.error ??
    (initialNotificationsError &&
        areNotificationFiltersEqual(filters, initialFilters) &&
        !notificationsQuery.isFetched
      ? initialNotificationsError
      : null);

  const changeTab = (tab: NotificationTab) => {
    if (tab === filters.tab && filters.page === 1) {
      return;
    }

    updateQueries(
      {
        tab: tab === 'all' ? null : tab,
      },
      {
        clear: ['page'],
        history: 'replace',
        scroll: false,
        strategy: 'native',
      },
    );
  };

  const clearFilters = () => {
    if (filters.tab === 'all' && filters.page === 1) {
      return;
    }

    removeQueries(NOTIFICATION_FILTER_QUERY_KEYS, {
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

  const openNotification = (notification: NotificationListItem) => {
    const href = notification.relatedEntity?.href;

    if (!notification.isRead) {
      void markReadMutation
        .mutateAsync(notification.id)
        .catch(() => undefined);
    }

    if (href) {
      router.push(href);
    }
  };

  const retry = () => {
    void notificationsQuery.refetch();
  };

  const markAllRead = () => {
    void markAllReadMutation.mutateAsync();
  };

  return (
    <NotificationsList
      activeTab={filters.tab}
      data={notificationsQuery.data ?? initialNotifications}
      error={notificationsError}
      isLoading={notificationsQuery.isLoading}
      isPending={
        notificationsQuery.isFetching ||
        markReadMutation.isPending ||
        markAllReadMutation.isPending
      }
      onClearFilters={clearFilters}
      onNotificationOpen={openNotification}
      onPageChange={changePage}
      onRetry={retry}
      topContent={
        <NotificationFilters
          activeTab={filters.tab}
          isPending={notificationsQuery.isFetching}
          isMarkAllReadPending={markAllReadMutation.isPending}
          unreadCount={unreadNotificationsCount}
          onMarkAllRead={markAllRead}
          onTabChange={changeTab}
        />
      }
    />
  );
};

export default NotificationsClient;
