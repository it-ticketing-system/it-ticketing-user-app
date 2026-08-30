'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ICON_SIZE_CLASS } from '@/constants';
import { useUnreadNotificationsCount } from '@/hooks';
import { cn } from '@/utils';
import NotificationBadge from './notification-badge';
import {
  isRouteActive,
  navigationItems,
  PWA_BOTTOM_NAV_HEIGHT_CLASS,
  PWA_SHELL_CONTAINER_CLASS,
} from './shared';

const BottomNavigation = () => {
  const t = useTranslations('pwaLayout.bottomNavigation');
  const unreadNotificationsCount = useUnreadNotificationsCount();

  const pathname = usePathname();

  return (
    <nav
      aria-label={t('navigation')}
      className="border-border bg-surface fixed inset-x-0 bottom-0 z-50 border-t lg:hidden"
    >
      <div
        className={cn(
          PWA_SHELL_CONTAINER_CLASS,
          PWA_BOTTOM_NAV_HEIGHT_CLASS,
          'grid grid-cols-3',
        )}
      >
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = isRouteActive(item.href, pathname);

          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className="focus-visible:ring-focus relative flex min-w-0 flex-col items-center justify-center gap-1 outline-none focus-visible:ring-2 focus-visible:ring-inset"
            >
              <span
                className={`relative flex size-7 items-center justify-center transition-colors duration-(--motion-fast) ${
                  isActive ? 'text-accent' : 'text-muted'
                } `}
              >
                <Icon className={ICON_SIZE_CLASS.md} />
                {item.key === 'notifications' ? (
                  <NotificationBadge
                    count={unreadNotificationsCount}
                    className="-inset-s-2 -top-1 h-5"
                  />
                ) : null}
              </span>
              <span
                className={`text-badge max-w-full truncate transition-colors duration-(--motion-fast) ${
                  isActive ? 'text-accent' : 'text-muted'
                } `}
              >
                {t(item.label)}
              </span>
            </Link>
          );
        })}
      </div>

      <div
        aria-hidden="true"
        className="bg-surface h-[env(safe-area-inset-bottom)]"
      />
    </nav>
  );
};

export default BottomNavigation;
