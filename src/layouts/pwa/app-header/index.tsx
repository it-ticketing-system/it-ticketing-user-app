'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Logo } from '@/components/shared';
import { ROUTES } from '@/constants';
import { isRouteActive, navigationItems } from '../shared';
import NotificationLink from './notification-link';
import UserMenu from './user-menu';

type AppHeaderProps = {
  unreadNotificationsCount?: number;
};

const AppHeader = ({ unreadNotificationsCount = 1000 }: AppHeaderProps) => {
  const t = useTranslations('pwa_layout.appHeader');
  const tCommon = useTranslations('common');

  const pathname = usePathname();

  return (
    <header className="border-border bg-surface sticky top-0 w-full border-b">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-5 md:px-6 lg:h-16 lg:px-8">
        <Link
          href={ROUTES.tickets}
          aria-label={tCommon('brand.appName')}
          className="focus-visible:ring-focus flex shrink-0 items-center gap-2 rounded-md transition-colors duration-(--motion-fast) outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          <Logo />

          <span className="text-body-sm text-foreground lg:text-body font-semibold whitespace-nowrap">
            {tCommon('brand.appName')}
          </span>
        </Link>

        <nav
          aria-label={t('mainNavigation')}
          className="hidden h-full items-center gap-6 lg:flex"
        >
          {navigationItems.map((item) => {
            const isActive = isRouteActive(item.href, pathname);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`text-body-sm focus-visible:ring-focus relative flex h-full items-center justify-center px-2 font-medium transition-colors duration-(--motion-fast) outline-none focus-visible:ring-2 focus-visible:ring-inset ${
                  isActive ? 'text-accent' : 'text-muted hover:text-foreground'
                } `}
              >
                {t(item.label)}

                {isActive && (
                  <span
                    aria-hidden="true"
                    className="bg-accent absolute bottom-0 left-1/2 h-0.75 w-10 -translate-x-1/2 rounded-t-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1 lg:gap-3">
          <NotificationLink
            unreadNotificationsCount={unreadNotificationsCount}
          />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
