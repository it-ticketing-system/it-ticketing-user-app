'use client';

import { Bell } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS, ROUTES } from '@/constants';
import { useUnreadNotificationsCount } from '@/hooks';
import NotificationBadge from '../notification-badge';

const NotificationLink = () => {
  const t = useTranslations('pwaLayout.appHeader');
  const unreadNotificationsCount = useUnreadNotificationsCount();

  return (
    <div className="relative shrink-0">
      <Link
        href={ROUTES.notifications}
        aria-label={t('notifications')}
        className="text-muted hover:bg-surface-secondary hover:text-foreground focus-visible:ring-focus relative flex size-11 shrink-0 items-center justify-center rounded-md transition-colors duration-(--motion-fast) outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        <Bell className={ICON_SIZE_CLASS.md} />
      </Link>

      <NotificationBadge
        count={unreadNotificationsCount}
        className="-inset-s-1 -top-1 h-5"
      />
    </div>
  );
};

export default NotificationLink;
