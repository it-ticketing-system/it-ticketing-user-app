'use client';

import { Badge } from '@heroui/react';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS, ROUTES } from '@/constants';

type NotificationLinkProps = {
  unreadNotificationsCount: number;
};

const NotificationLink = ({
  unreadNotificationsCount,
}: NotificationLinkProps) => {
  const t = useTranslations('pwaLayout.appHeader');

  return (
    <Badge.Anchor className="shrink-0">
      <Link
        href={ROUTES.notifications}
        aria-label={t('notifications')}
        className="text-muted hover:bg-surface-secondary hover:text-foreground focus-visible:ring-focus relative flex size-11 shrink-0 items-center justify-center rounded-md transition-colors duration-(--motion-fast) outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        <Bell
          className={ICON_SIZE_CLASS.md}
        />
      </Link>

      {unreadNotificationsCount > 0 ? (
        <Badge
          color="danger"
          size="sm"
          placement="top-left"
          className="border-surface border-2"
        >
          <Badge.Label>
            {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
          </Badge.Label>
        </Badge>
      ) : null}
    </Badge.Anchor>
  );
};

export default NotificationLink;
