import { PAGE_SIZE } from '@/constants';
import { getSearchParamValue, toPositiveInteger } from '@/utils';
import type { NotificationListData } from './notification-list/types';
import type { GetNotificationsRequest } from '@/apis/services/notifications/client';
import type { NotificationTab } from '@/models';

const NOTIFICATION_TABS = [
  'all',
  'unread',
  'messages',
  'assignments',
  'system',
] as const satisfies readonly NotificationTab[];

export const NOTIFICATION_FILTER_QUERY_KEYS = ['tab', 'page'] as const;

export type NotificationsSearchParams = Record<
  string,
  string | string[] | undefined
>;

export type NotificationFiltersValue = {
  tab: NotificationTab;
  page: number;
};

const isNotificationTab = (value: string): value is NotificationTab => {
  return NOTIFICATION_TABS.includes(value as NotificationTab);
};

export const parseNotificationFilters = (
  searchParams: NotificationsSearchParams,
): NotificationFiltersValue => {
  const tab = getSearchParamValue(searchParams, 'tab');

  return {
    tab: isNotificationTab(tab) ? tab : 'all',
    page: toPositiveInteger(getSearchParamValue(searchParams, 'page')) ?? 1,
  };
};

export const createNotificationsParams = (
  filters: NotificationFiltersValue,
): Required<Pick<GetNotificationsRequest, 'page' | 'perPage'>> &
  Omit<GetNotificationsRequest, 'page' | 'perPage'> => ({
  page: filters.page,
  perPage: PAGE_SIZE,
  tab: filters.tab,
});

export const createEmptyNotifications = (
  page: number,
): NotificationListData => ({
  items: [],
  meta: {
    page,
    perPage: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  },
});

export const areNotificationFiltersEqual = (
  first: NotificationFiltersValue,
  second: NotificationFiltersValue,
): boolean => first.tab === second.tab && first.page === second.page;
