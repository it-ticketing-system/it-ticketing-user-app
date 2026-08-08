'use client';

import { Button, Chip } from '@heroui/react';
import { RefreshCw, Tickets, WifiOff } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ICON_SIZE_CLASS, ROUTES } from '@/constants';
import { usePwa } from '@/hooks';
import { cn } from '@/utils';

const OfflineModule = () => {
  const t = useTranslations('offline');
  const { isOnline } = usePwa();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);

    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <main className="bg-background text-foreground flex min-h-dvh flex-col items-center justify-center px-4 py-8 lg:px-6">
      <section className="flex w-full max-w-md flex-col items-center text-center gap-5">
        <Chip
          variant="soft"
          color={isOnline ? 'success' : 'danger'}
          size="sm"
          className="font-medium"
        >
          <span
            className={cn(
              'ml-1.5 inline-block size-2 rounded-full',
              isOnline ? 'bg-success animate-pulse' : 'bg-danger animate-pulse',
            )}
          />
          <Chip.Label>{isOnline ? t('badgeOnline') : t('badgeOffline')}</Chip.Label>
        </Chip>

        <div className="bg-primary-50 text-primary flex size-16 items-center justify-center rounded-2xl">
          <WifiOff aria-hidden="true" className={ICON_SIZE_CLASS.lg} />
        </div>

        <div className="space-y-2">
          <h1 className="text-h2 font-bold tracking-tight text-foreground lg:text-h1">
            {t('title')}
          </h1>
          <p className="text-body-sm text-muted max-w-sm leading-7 lg:text-body">
            {t('description')}
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

          <Link href={ROUTES.tickets} className="w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full font-medium sm:w-auto sm:min-w-[140px]"
            >
              <Tickets aria-hidden="true" className={ICON_SIZE_CLASS.sm} />
              {t('tickets')}
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default OfflineModule;
