import 'server-only';

import { toApiRequestError, type ApiRequestError } from '@/apis/core/api-error';
import { serverNotificationServices } from '@/apis/services/notifications/server';
import {
  createEmptyNotifications,
  createNotificationsParams,
  parseNotificationFilters,
  type NotificationsSearchParams,
} from './notifications-query';
import type { NotificationListData } from './notification-list/types';

type NotificationsInitialData = {
  initialFilters: ReturnType<typeof parseNotificationFilters>;
  initialNotifications: NotificationListData;
  initialNotificationsError: ApiRequestError | null;
};

export const getNotificationsInitialData = async (
  searchParams: NotificationsSearchParams,
): Promise<NotificationsInitialData> => {
  const initialFilters = parseNotificationFilters(searchParams);
  const notificationsParams = createNotificationsParams(initialFilters);

  try {
    const initialNotifications =
      await serverNotificationServices.getNotifications(notificationsParams);

    return {
      initialFilters,
      initialNotifications,
      initialNotificationsError: null,
    };
  } catch (error) {
    return {
      initialFilters,
      initialNotifications: createEmptyNotifications(initialFilters.page),
      initialNotificationsError: toApiRequestError(error),
    };
  }
};
