'use client';

import { Button } from '@heroui/react';
import { AlertCircle, Inbox, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { cn } from '@/utils';
import type { TicketsTableProps } from './types';

interface TicketsTableErrorStateProps {
  error: NonNullable<TicketsTableProps['error']>;
  className?: string;
  isRetrying?: boolean;
  onRetry?: () => void;
}

interface TicketsTableEmptyStateProps {
  className?: string;
}

const stateClassName =
  'flex min-h-52 flex-col items-center justify-center gap-3 px-6 py-10 text-center';

export const TicketsTableErrorState = ({
  error,
  className,
  isRetrying = false,
  onRetry,
}: TicketsTableErrorStateProps) => {
  const t = useTranslations('tickets.table');
  const commonT = useTranslations('common');

  return (
    <div className={cn(stateClassName, className)}>
      <div className="bg-danger-50 text-danger flex size-12 items-center justify-center rounded-full">
        <AlertCircle aria-hidden="true" className={ICON_SIZE_CLASS.lg} />
      </div>

      <div className="space-y-1">
        <p className="text-title text-foreground">{t('error.title')}</p>

        <p className="text-body-sm text-muted">{commonT(error.messageKey)}</p>
      </div>

      <Button
        size="sm"
        variant="outline"
        isPending={isRetrying}
        onPress={onRetry}
        className="mt-1 h-10"
      >
        <RefreshCw aria-hidden="true" className={ICON_SIZE_CLASS.sm} />
        {t('error.retry')}
      </Button>
    </div>
  );
};

export const TicketsTableEmptyState = ({
  className,
}: TicketsTableEmptyStateProps) => {
  const t = useTranslations('tickets.table');

  return (
    <div className={cn(stateClassName, className)}>
      <div className="bg-primary-50 text-accent flex size-12 items-center justify-center rounded-full">
        <Inbox aria-hidden="true" className={ICON_SIZE_CLASS.lg} />
      </div>

      <div className="space-y-1">
        <p className="text-title text-foreground">{t('empty.title')}</p>

        <p className="text-body-sm text-muted">{t('empty.description')}</p>
      </div>
    </div>
  );
};
