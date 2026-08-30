'use client';

import { clientNotificationServices } from '@/apis/services/notifications/client';
import { QUERY_KEYS } from '@/constants';
import useGetRequest from './use-get-request';

const useUnreadNotificationsCount = () => {
  const unreadCountQuery = useGetRequest({
    queryKey: QUERY_KEYS.notifications.unreadCount,
    requestFn: async (signal) =>
      clientNotificationServices.getUnreadNotificationsCount(signal),
    showErrorToast: false,
    staleTime: 30_000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  return unreadCountQuery.data ?? 0;
};

export default useUnreadNotificationsCount;
