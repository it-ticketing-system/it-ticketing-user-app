'use client';

import dynamic from 'next/dynamic';
import { useMediaQuery } from '@/hooks';
import NotificationsTableModeFallback from '../skeleton/notifications-table-mode-fallback';
import type { NotificationListProps } from './types';

type NotificationsListMode = 'desktop' | 'mobile';

const NotificationsDesktopTable = dynamic(
  () => import('./notifications-desktop-table'),
  {
    ssr: false,
    loading: () => <NotificationsTableModeFallback />,
  },
);

const MobileNotificationsList = dynamic(
  () => import('../mobile-notifications-list'),
  {
    ssr: false,
    loading: () => <NotificationsTableModeFallback />,
  },
);

const NotificationsList = ({
  activeTab,
  data,
  error = null,
  topContent,
  isLoading = false,
  isPending = false,
  onClearFilters,
  onNotificationOpen,
  onPageChange,
  onRetry,
}: NotificationListProps) => {
  const { isDesktop } = useMediaQuery();
  const mode: NotificationsListMode | null =
    isDesktop === null ? null : isDesktop ? 'desktop' : 'mobile';

  const viewProps = {
    activeTab,
    items: data.items,
    meta: data.meta,
    error,
    isLoading,
    isPending,
    onClearFilters,
    onNotificationOpen,
    onPageChange,
    onRetry,
  };

  return (
    <section className="space-y-4 lg:space-y-6">
      {topContent}
      {mode === null && <NotificationsTableModeFallback />}
      {mode === 'desktop' && <NotificationsDesktopTable {...viewProps} />}
      {mode === 'mobile' && <MobileNotificationsList {...viewProps} />}
    </section>
  );
};

export default NotificationsList;
