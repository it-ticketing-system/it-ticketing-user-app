'use client';

import { Button } from '@heroui/react';
import { RefreshCw, Tickets, WifiOff } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS, ROUTES } from '@/constants';

const OfflineModule = () => {
  const t = useTranslations('offline');

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <main className="bg-background text-foreground flex min-h-dvh items-center px-4 py-8 sm:px-5 md:px-6">
      <section className="mx-auto flex w-full max-w-md flex-col items-center gap-5 text-center">
        <div className="bg-primary-50 text-accent flex size-14 items-center justify-center rounded-xl">
          <WifiOff aria-hidden="true" className={ICON_SIZE_CLASS.lg} />
        </div>

        <div className="space-y-2">
          <h1 className="text-h2 text-foreground">{t('title')}</h1>
          <p className="text-body-sm text-muted leading-7">
            {t('description')}
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            type="button"
            variant="primary"
            onPress={handleRetry}
            className="h-11"
          >
            <RefreshCw aria-hidden="true" className={ICON_SIZE_CLASS.sm} />
            {t('retry')}
          </Button>

          <Link href={ROUTES.tickets} className="sm:w-auto">
            <Button type="button" variant="outline" className="h-11 w-full">
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
