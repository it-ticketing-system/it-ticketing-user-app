'use client';

import { Button } from '@heroui/react';
import { BellOff, BellRing, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { usePushNotifications, usePwa } from '@/hooks';

interface PushPermissionProps {
  hideIfSubscribed?: boolean;
  showDismissButton?: boolean;
}

const PushPermission = ({
  hideIfSubscribed = false,
  showDismissButton = false,
}: PushPermissionProps) => {
  const t = useTranslations('pwa.push');
  const { isOnline, isPushPromptDismissed, dismissPushPrompt } = usePwa();
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

  if (hideIfSubscribed && isBrowserSubscribed) {
    return null;
  }

  if (showDismissButton && isPushPromptDismissed) {
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
    <div className="border-border bg-surface flex flex-col gap-3 rounded-xl border p-4 text-start shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-3">
        <div className="bg-primary-50 text-accent flex size-10 shrink-0 items-center justify-center rounded-xl">
          <BellRing aria-hidden="true" className={ICON_SIZE_CLASS.md} />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-title text-foreground">{t('title')}</p>

            {showDismissButton ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                aria-label={t('dismiss')}
                className="size-8 min-w-8 shrink-0 p-0 lg:hidden"
                onPress={dismissPushPrompt}
              >
                <X aria-hidden="true" className={ICON_SIZE_CLASS.sm} />
              </Button>
            ) : null}
          </div>

          <p className="text-body-sm text-muted leading-6">{description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:shrink-0">
        {isBrowserSubscribed ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-9 w-full lg:w-auto"
            isDisabled={!isOnline}
            isPending={isPending}
            onPress={() => {
              void unsubscribe().catch(() => undefined);
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
            className="h-9 w-full lg:w-auto"
            isDisabled={!canRequestPermission}
            isPending={isPending}
            onPress={() => {
              void subscribe().catch(() => undefined);
            }}
          >
            <BellRing aria-hidden="true" className={ICON_SIZE_CLASS.sm} />
            {t('enable')}
          </Button>
        )}

        {showDismissButton ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            aria-label={t('dismiss')}
            className="hidden h-9 min-w-9 px-0 lg:inline-flex"
            onPress={dismissPushPrompt}
          >
            <X aria-hidden="true" className={ICON_SIZE_CLASS.sm} />
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default PushPermission;
