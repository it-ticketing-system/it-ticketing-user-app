'use client';

import { Button, Chip } from '@heroui/react';
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ICON_SIZE_CLASS } from '@/constants';
import { usePwa } from '@/hooks';
import { cn } from '@/utils';

type ErrorModuleProps = {
  reset?: () => void;
};

const ErrorModule = ({ reset }: ErrorModuleProps) => {
  const t = useTranslations('error');
  const { isOnline } = usePwa();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);

    if (reset) {
      reset();
      setIsRetrying(false);
      return;
    }

    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const isNetworkIssue = !isOnline;

  return (
    <main className="bg-background text-foreground flex min-h-dvh flex-col items-center justify-center px-4 py-8 lg:px-6">
      <section className="flex w-full max-w-md flex-col items-center text-center gap-5">
        <Chip
          variant="soft"
          color={isNetworkIssue ? 'danger' : 'warning'}
          size="sm"
          className="font-medium"
        >
          <span
            className={cn(
              'ml-1.5 inline-block size-2 rounded-full animate-pulse',
              isNetworkIssue ? 'bg-danger' : 'bg-warning',
            )}
          />
          <Chip.Label>
            {isNetworkIssue ? t('badgeOffline') : t('badgeServer')}
          </Chip.Label>
        </Chip>

        <div
          className={cn(
            'flex size-16 items-center justify-center rounded-2xl',
            isNetworkIssue
              ? 'bg-primary-50 text-primary'
              : 'bg-warning-50 text-warning-600',
          )}
        >
          {isNetworkIssue ? (
            <WifiOff aria-hidden="true" className={ICON_SIZE_CLASS.lg} />
          ) : (
            <AlertTriangle aria-hidden="true" className={ICON_SIZE_CLASS.lg} />
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-h2 font-bold tracking-tight text-foreground lg:text-h1">
            {isNetworkIssue ? t('offlineTitle') : t('serverTitle')}
          </h1>
          <p className="text-body-sm text-muted max-w-sm leading-7 lg:text-body">
            {isNetworkIssue ? t('offlineDescription') : t('serverDescription')}
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
          <Button
            type="button"
            variant="primary"
            onPress={handleRetry}
            isDisabled={isRetrying}
            className="h-11 w-full font-medium sm:w-auto sm:min-w-[140px]"
          >
            <RefreshCw
              aria-hidden="true"
              className={cn(ICON_SIZE_CLASS.sm, isRetrying && 'animate-spin')}
            />
            {isRetrying ? t('retrying') : t('retry')}
          </Button>
        </div>
      </section>
    </main>
  );
};

export default ErrorModule;
