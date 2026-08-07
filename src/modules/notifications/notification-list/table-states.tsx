'use client';

import { Button } from '@heroui/react';
import { AlertCircle, Bell, SearchX } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS, ROUTES } from '@/constants';
import { cn } from '@/utils';
import type { NotificationListProps } from './types';

interface NotificationListErrorStateProps {
  error: NonNullable<NotificationListProps['error']>;
  className?: string;
  isRetrying?: boolean;
  onRetry?: () => void;
}

interface NotificationListEmptyStateProps {
  className?: string;
  hasActiveFilter: boolean;
  onClearFilters?: () => void;
}

const stateClassName =
  'flex min-h-64 flex-col items-center justify-center gap-3 px-6 py-10 text-center';

export const NotificationListErrorState = ({
  error,
  className,
  isRetrying = false,
  onRetry,
}: NotificationListErrorStateProps) => {
  const t = useTranslations('notifications.list');
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
        {t('error.retry')}
      </Button>
    </div>
  );
};

export const NotificationListEmptyState = ({
  className,
  hasActiveFilter,
  onClearFilters,
}: NotificationListEmptyStateProps) => {
  const t = useTranslations('notifications.list');
  const Icon = hasActiveFilter ? SearchX : Bell;

  return (
    <div className={cn(stateClassName, className)}>
      <div className="bg-primary-50 text-accent flex size-16 items-center justify-center rounded-full">
        <Icon aria-hidden="true" className={ICON_SIZE_CLASS.lg} />
      </div>

      <div className="space-y-1">
        <p className="text-title text-foreground">
          {hasActiveFilter ? t('noResult.title') : t('empty.title')}
        </p>
        <p className="text-body-sm text-muted">
          {hasActiveFilter ? t('noResult.description') : t('empty.description')}
        </p>
      </div>

      {hasActiveFilter ? (
        <Button
          size="sm"
          variant="outline"
          className="mt-1 h-10"
          onPress={onClearFilters}
        >
          {t('noResult.action')}
        </Button>
      ) : (
        <Link href={ROUTES.tickets} className="mt-1">
          <Button size="sm" variant="outline" className="h-10">
            {t('empty.action')}
          </Button>
        </Link>
      )}
    </div>
  );
};
