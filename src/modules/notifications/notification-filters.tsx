'use client';

import { Button } from '@heroui/react';
import { CheckCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { cn } from '@/utils';
import type { NotificationTab } from '@/models';

const NOTIFICATION_TABS = [
  'all',
  'unread',
  'messages',
  'assignments',
  'system',
] as const satisfies readonly NotificationTab[];

interface NotificationFiltersProps {
  activeTab: NotificationTab;
  isPending?: boolean;
  isMarkAllReadPending?: boolean;
  unreadCount?: number;
  onMarkAllRead: () => void;
  onTabChange: (tab: NotificationTab) => void;
}

const NotificationFilters = ({
  activeTab,
  isPending = false,
  isMarkAllReadPending = false,
  unreadCount = 0,
  onMarkAllRead,
  onTabChange,
}: NotificationFiltersProps) => {
  const t = useTranslations('notifications.filters');
  const hasUnreadNotifications = unreadCount > 0;

  return (
    <section
      aria-label={t('ariaLabel')}
      className="border-border bg-surface rounded-xl border p-3 shadow-sm lg:p-4"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-1 flex [scrollbar-width:none] gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-wrap lg:justify-end lg:overflow-visible lg:p-0 [&::-webkit-scrollbar]:hidden">
          {NOTIFICATION_TABS.map((tab) => {
            const isActive = tab === activeTab;

            return (
              <Button
                key={tab}
                type="button"
                size="md"
                variant={isActive ? 'primary' : 'outline'}
                className={cn(
                  'h-10 shrink-0 rounded-full px-4',
                  !isActive && 'bg-surface',
                )}
                isDisabled={isPending}
                onPress={() => onTabChange(tab)}
              >
                {t(`tabs.${tab}`)}
              </Button>
            );
          })}
        </div>

        <Button
          type="button"
          size="md"
          variant="outline"
          className="bg-surface h-10 w-full lg:w-auto"
          isDisabled={!hasUnreadNotifications || isPending}
          isPending={isMarkAllReadPending}
          onPress={onMarkAllRead}
        >
          <CheckCheck aria-hidden="true" className={ICON_SIZE_CLASS.md} />
          {t('markAllRead')}
        </Button>
      </div>
    </section>
  );
};

export default NotificationFilters;
