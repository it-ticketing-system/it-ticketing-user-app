'use client';

import { Button } from '@heroui/react';
import { BellRing, BellOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { usePushNotifications, usePwa } from '@/hooks';

const PushPermission = () => {
  const t = useTranslations('pwa.push');
  const { isOnline } = usePwa();
  const {
    canRequestPermission,
    isBackendEnabled,
    isBrowserSubscribed,
    isCheckingSubscription,
    isPending,
    isSupported,
    permission,
    subscribe,
    unsubscribe,
  } = usePushNotifications();

  if (isCheckingSubscription) {
    return null;
  }

  if (!isSupported) {
    return null;
  }

  const description = (() => {
    if (!isOnline) {
      return t('offline');
    }

    if (!isBackendEnabled) {
      return t('disabled');
    }

    if (permission === 'denied') {
      return t('denied');
    }

    if (isBrowserSubscribed) {
      return t('enabled');
    }

    return t('description');
  })();

  if (!isBackendEnabled && isOnline) {
    return null;
  }

  return (
    <div className="border-border bg-surface flex flex-col gap-3 rounded-xl border p-3 text-start shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="bg-primary-50 text-accent flex size-10 shrink-0 items-center justify-center rounded-xl">
          <BellRing aria-hidden="true" className={ICON_SIZE_CLASS.md} />
        </div>

        <div className="space-y-1">
          <p className="text-title text-foreground">{t('title')}</p>
          <p className="text-body-sm text-muted leading-6">{description}</p>
        </div>
      </div>

      {isBrowserSubscribed ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-9 sm:shrink-0"
          isDisabled={!isOnline}
          isPending={isPending}
          onPress={() => {
            void unsubscribe();
          }}
        >
          <BellOff aria-hidden="true" className={ICON_SIZE_CLASS.sm} />
          {t('disable')}
        </Button>
      ) : (
        <Button
          type="button"
          size="sm"
          variant="primary"
          className="h-9 sm:shrink-0"
          isDisabled={!canRequestPermission}
          isPending={isPending}
          onPress={() => {
            void subscribe();
          }}
        >
          <BellRing aria-hidden="true" className={ICON_SIZE_CLASS.sm} />
          {t('enable')}
        </Button>
      )}
    </div>
  );
};

export default PushPermission;
