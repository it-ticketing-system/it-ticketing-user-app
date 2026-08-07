'use client';

import { toast } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { clientPushServices } from '@/apis/services/push/client';
import { QUERY_KEYS } from '@/constants';
import {
  getCurrentPushSubscription,
  subscribeCurrentBrowserToPush,
  toPushSubscriptionRequest,
  unsubscribeCurrentBrowserFromPush,
} from '@/utils';
import useGetRequest from './use-get-request';
import usePostRequest from './use-post-request';
import usePwa from './use-pwa';

const PUSH_SYNC_FAILED_KEY = 'push_sync_failed';

type PushPermissionState = NotificationPermission | 'unsupported';

const getPermissionState = (): PushPermissionState => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }

  return Notification.permission;
};

const usePushNotifications = () => {
  const { isOnline, pushSupport } = usePwa();
  const t = useTranslations('pwa.push');
  const [permission, setPermission] = useState<PushPermissionState>(() =>
    getPermissionState(),
  );
  const [isBrowserSubscribed, setIsBrowserSubscribed] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);

  const configQuery = useGetRequest({
    queryKey: QUERY_KEYS.push.config,
    requestFn: clientPushServices.getConfig,
    enabled: pushSupport.isSupported && isOnline,
    showErrorToast: false,
    staleTime: 10 * 60_000,
  });

  const refreshSubscriptionState = useCallback(async () => {
    if (!pushSupport.isSupported) {
      setIsCheckingSubscription(false);
      setIsBrowserSubscribed(false);
      return;
    }

    setIsCheckingSubscription(true);

    try {
      const subscription = await getCurrentPushSubscription();
      const hasSyncFailed =
        window.localStorage.getItem(PUSH_SYNC_FAILED_KEY) === '1';
      setIsBrowserSubscribed(Boolean(subscription) && !hasSyncFailed);
    } finally {
      setIsCheckingSubscription(false);
    }
  }, [pushSupport.isSupported]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refreshSubscriptionState();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [refreshSubscriptionState]);

  const subscribeMutation = usePostRequest({
    requestFn: async () => {
      if (!pushSupport.isSupported || !configQuery.data?.vapidPublicKey) {
        throw new Error('Push notification is not supported.');
      }

      const nextPermission = await Notification.requestPermission();
      setPermission(nextPermission);

      if (nextPermission !== 'granted') {
        throw new Error('Push notification permission was not granted.');
      }

      const subscription = await subscribeCurrentBrowserToPush(
        configQuery.data.vapidPublicKey,
      );

      try {
        const result = await clientPushServices.createOrUpdateSubscription(
          toPushSubscriptionRequest(subscription),
        );
        window.localStorage.removeItem(PUSH_SYNC_FAILED_KEY);
        return result;
      } catch (error) {
        window.localStorage.setItem(PUSH_SYNC_FAILED_KEY, '1');
        await unsubscribeCurrentBrowserFromPush().catch(() => undefined);
        throw error;
      }
    },
    showSuccessToast: false,
    showErrorToast: false,
    onSuccess: async () => {
      setIsBrowserSubscribed(true);
    },
    onError: () => {
      setIsBrowserSubscribed(false);
      toast.danger(t('failureTitle'), {
        description: t('failureDescription'),
      });
    },
  });

  const unsubscribeMutation = usePostRequest({
    requestFn: async () => {
      const subscription = await getCurrentPushSubscription();

      try {
        if (subscription) {
          await clientPushServices
            .unsubscribeCurrentBrowser({
              endpoint: subscription.endpoint,
            })
            .catch(() => undefined);
        }

        await unsubscribeCurrentBrowserFromPush();

        return {
          message: 'Push subscription removed locally.',
        };
      } finally {
        window.localStorage.removeItem(PUSH_SYNC_FAILED_KEY);
      }
    },
    showSuccessToast: false,
    showErrorToast: false,
    onSuccess: async () => {
      setIsBrowserSubscribed(false);
      await refreshSubscriptionState();
    },
  });

  const isBackendEnabled = Boolean(
    configQuery.data?.enabled && configQuery.data.vapidPublicKey,
  );

  const canRequestPermission = useMemo(() => {
    return (
      pushSupport.isSupported &&
      isBackendEnabled &&
      isOnline &&
      permission !== 'denied' &&
      !isBrowserSubscribed
    );
  }, [
    isBackendEnabled,
    isBrowserSubscribed,
    isOnline,
    permission,
    pushSupport.isSupported,
  ]);

  return {
    canRequestPermission,
    configError: configQuery.error,
    isBackendEnabled,
    isBrowserSubscribed,
    isCheckingSubscription,
    isPending: subscribeMutation.isPending || unsubscribeMutation.isPending,
    isSupported: pushSupport.isSupported,
    permission,
    subscribe: subscribeMutation.mutateAsync,
    unsubscribe: unsubscribeMutation.mutateAsync,
  };
};

export default usePushNotifications;
